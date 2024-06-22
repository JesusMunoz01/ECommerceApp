import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { UserDto } from './dto/userUpdate.dto';
import { promisify } from 'util';

@Injectable()
export class UsersService {
    constructor(private appService: AppService) {}
    private connection = this.appService.connection;

    // Calls Auth0's /oauth/token endpoint to get an access token
    async getAccessToken() {
        const formData = new URLSearchParams();
        formData.append('grant_type', 'client_credentials');
        formData.append('client_id', process.env.API_CLIENT_ID);
        formData.append('client_secret', process.env.API_CLIENT_SECRET);
        formData.append('audience', process.env.AUTH0_MANAGEMENT_AUDIENCE);
        const getAPIToken = await fetch(`${process.env.AUTH0_ISSUER_URL}oauth/token`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData
        });
        const aToken = await getAPIToken.json();
        return aToken.access_token;
    }

    async checkSubscription(userID: string): Promise<{ message: string; }> {
        const queryAsync = promisify(this.connection.query).bind(this.connection);
        // Check the user's plan end date and update the user's plan if necessary
        const userEndDate = await queryAsync(`SELECT endingDate FROM users WHERE id = ?`, [userID]);
        console.log(userEndDate);
        if(userEndDate[0].endingDate && userEndDate[0].endingDate < new Date()) {
            try{
                await this.connection.query(`UPDATE users SET sname = ?, endingDate = NULL, updated_at = NOW() WHERE id = ?`, 
                ["Free", userID], (err, results) => {
                    if(err) {
                        console.log(err);
                        return { message: "Error updating user" };
                    }
                    console.log(results);
                    return { message: "User subscription updated successfully" };
                });
            }catch(err) {
                console.log(err);
                return { message: "Error updating user" };
            }
        }
    }


    async createUser(userID: string, bypassLoginCount: boolean): Promise<{ message: string; }> {
        // Calls Auth0's /users/{id} endpoint to get user data using the access token
        const userResponse = await fetch(`${process.env.AUTH0_MANAGEMENT_AUDIENCE}users/${userID}`, {
            headers: {
            authorization: `Bearer ${await this.getAccessToken()}`,
            }
        });
        const userData = await userResponse.json();
        console.log(userData);
        // Checks if the user has logged in before, if not, adds the user to the database with the OAuth id
        if(userData.logins_count === 1 || bypassLoginCount) {
            try{
                const name = userData.given_name ? userData.given_name : userData.name;
                await this.connection.query(`INSERT INTO users (id, email, name, sname, created_at, updated_at) VALUES 
                (?, ?, ?, ?, NOW(), NOW())`, [userData.identities[0].user_id, userData.email, name, "Free" ], (err, results) => {
                    if(err) {
                        console.log(err);
                        return { message: "Error creating user" };
                    }
                    // Pass created user data to the client
                    return { message: "User created successfully" };
                });
            }
            catch(err) {
                console.log(err);
                return { message: "Error creating user" };
            }
        }
    }

    async getUser(userID: string): Promise<{ message: string, plan?: string, brands?: [] }> {
        try{
            const userResponse = await fetch(`${process.env.AUTH0_MANAGEMENT_AUDIENCE}users/${userID}`, {
                headers: {
                authorization: `Bearer ${await this.getAccessToken()}`,
                }
            });
            const userData = await userResponse.json();

            const queryAsync = promisify(this.connection.query).bind(this.connection);

            // Search for the user in the database
            const user = await queryAsync(`SELECT created_at FROM users WHERE id = ?`, [userData.identities[0].user_id]);

            if(user.length === 0) {
                this.createUser(userData.user_id, true);
            }

            await this.checkSubscription(userData.identities[0].user_id)

            // Fetch user plan name from the database and return it to the client
            const results = await queryAsync(`SELECT sname FROM users WHERE id = ?`, [userData.identities[0].user_id]);
            const brands = await queryAsync(`SELECT * FROM brands WHERE brandOwner = ?`, [userData.identities[0].user_id]);

            if (results && results.length > 0) {
                return { message: "User fetched successfully", plan: results[0].sname, brands: brands };
            } else {
                return { message: "User not found" };
            }
        } catch (error) {
            console.log(error);
            return { message: "Error fetching user" };
        }
    }

    async updateUser(userID: string, data: UserDto): Promise<{ message: string; }> {
        const userResponse = await fetch(`${process.env.AUTH0_MANAGEMENT_AUDIENCE}users/${userID}`, {
            headers: {
            authorization: `Bearer ${await this.getAccessToken()}`,
            }
        });
        const userData = await userResponse.json();
        const user = userData.user_id;

        /************************************************************************
        * Variables to be used in the SQL query
        * Filters out the fields that are not filled in the form and creates an array of the filled fields
        * Creates the Update SQL query and the data to be used in the query
        ************************************************************************/
        const fields = ["email", "name"];
        const filledFields = Object.keys(data).filter(key => data[key] && fields.includes(key));
        const sqlQuery = `UPDATE users SET ${filledFields.map(key => `${key} = ?`).join(", ")}, updated_at = NOW() WHERE id = ?`;
        const sqlData = [...filledFields.map(key => data[key]), user];

        try{
            await this.connection.query(sqlQuery, sqlData, (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error updating user" };
                }
                console.log(results);
                return { message: "User updated successfully" };
            });
        }catch(err) {
            console.log(err);
            return { message: "Error updating user" };
        }
    }

    async deleteUser(userID: string): Promise<{ message: string; }> {
        const userResponse = await fetch(`${process.env.AUTH0_MANAGEMENT_AUDIENCE}users/${userID}`, {
            headers: {
            authorization: `Bearer ${await this.getAccessToken()}`,
            }
        });
        const userData = await userResponse.json();
        const user = userData.user_id;
        try{
            await this.connection.query(`DELETE FROM users WHERE id = ?`, [user], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error deleting user" };
                }
                console.log(results);
                return { message: "User deleted successfully" };
            });
        }catch(err) {
            console.log(err);
            return { message: "Error deleting user" };
        }
    }

}
