import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

export type UserData = {
    email?: string;
    name?: string;
    updated_at: string;
}

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

    async createUser(userID: string): Promise<{ message: string; }> {
        // Calls Auth0's /users/{id} endpoint to get user data using the access token
        const userResponse = await fetch(`${process.env.AUTH0_MANAGEMENT_AUDIENCE}users/${userID}`, {
            headers: {
            authorization: `Bearer ${await this.getAccessToken()}`,
            }
        });
        const userData = await userResponse.json();
        // Checks if the user has logged in before, if not, adds the user to the database
        if(userData.logins_count === 1) {
            try{
                this.connection.query(`INSERT INTO users (id, email, name, created_at, updated_at) VALUES 
                (?, ?, ?, NOW(), NOW())`, [userData.identities[0].user_id, userData.email, userData.given_name ], (err, results) => {
                    if(err) {
                        console.log(err);
                        return { message: "Error creating user" };
                    }
                    console.log(results);
                    return { message: "User created successfully" };
                });
            }
            catch(err) {
                console.log(err);
                return { message: "Error creating user" };
            }
        }
        return { message: "User already exists" };
    }

    async getUser(userID: string): Promise<{ message: string; }> {
        const userResponse = await fetch(`${process.env.AUTH0_MANAGEMENT_AUDIENCE}users/${userID}`, {
            headers: {
            authorization: `Bearer ${await this.getAccessToken()}`,
            }
        });
        const userData = await userResponse.json();
        const user = userData.user_id;
        try{
            this.connection.query(`SELECT * FROM users WHERE id = ?`, [user], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error fetching user" };
                }
                console.log(results);
                return { message: "User fetched successfully" };
            });
        }catch(err) {
            console.log(err);
            return { message: "Error fetching user" };
        }
        return { message: "User already exists" };
    }

    async updateUser(userID: string, data: UserData): Promise<{ message: string; }> {
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
            this.connection.query(sqlQuery, sqlData, (err, results) => {
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
        return { message: "User already exists" };
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
            this.connection.query(`DELETE FROM users WHERE id = ?`, [user], (err, results) => {
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
        return { message: "User already exists" };
    }

}
