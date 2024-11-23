import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { UserDto } from './dto/userUpdate.dto';
import { promisify } from 'util';
import { ManagementClient } from 'auth0';
import { StripeService } from 'src/payment/payment.service';

export type UpdateFields = {
    email?: string;
    password?: string;
    name?: string;
}

@Injectable()
export class UsersService {
    constructor(private appService: AppService, private stripeService: StripeService) {}
    private connection = this.appService.connection;
    private readonly stripe = this.stripeService.stripe;

    async getManagementClient() {
        const token = await this.getAccessToken();
        return new ManagementClient({
            domain: process.env.AUTH0_DOMAIN,
            token: token
        });
    }

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

    async deleteStripeData(userID: string){
        try{
            const user = await new Promise((resolve, reject) => {
                this.connection.query(`SELECT * FROM users WHERE id = ?`, [userID], (err, results) => {
                    if(err) {
                        console.log(err);
                        reject({ message: "Error deleting user" });
                    }
                    resolve(results);
                });
            });

            if(user[0].sid && user[0].sactive) {
                const subscriptions = await this.stripe.subscriptions.list({ customer: user[0].sid });
                if(subscriptions && subscriptions.data.length > 0) {
                    for(const subscription of subscriptions.data) {
                        await this.stripe.subscriptions.cancel(subscription.id);
                    }
                }
            }

            if(user[0].pid) {
                await this.stripe.customers.del(user[0].sid);
            }
        }catch(err) {
            console.log(err);
            return { message: "Error deleting user" };
        }
    }

    async deleteAuthUser(authID: string){
        try {
          const management = await this.getManagementClient();
          await management.users.delete({ id: authID });
          console.log(`User with ID ${authID} has been deleted.`);
        } catch (error) {
            console.error('Error deleting user:', error);
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error response from Auth0 API:', error.response.data);
            console.error('Status code:', error.response.status);
          } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error setting up request:', error.message);
          }
          console.error('Error config:', error.config);
        }
      };

    async checkSubscription(userID: string): Promise<{ message: string; }> {
        const queryAsync = promisify(this.connection.query).bind(this.connection);
        // Check the user's plan end date and update the user's plan if necessary
        const userEndDate = await queryAsync(`SELECT endingDate FROM users WHERE id = ?`, [userID]);
        
        console.log(userEndDate);
        
        // TODO: Use the console log to see how a new user data looks like, currently it leads to an error
        // cannot read properties of undefined (reading 'endingDate')

        if(userEndDate[0].endingDate && userEndDate[0].endingDate < new Date()) {
            try{
                await this.connection.query(`UPDATE users SET sname = ?, sactive = ?, endingDate = NULL, updated_at = NOW() WHERE id = ?`, 
                ["Free", false, userID], (err, results) => {
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

    async getUser(userID: string): Promise<{ message: string, plan?: string, brands?: [], subEndDate?: string }> {
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
            const results = await queryAsync(`SELECT sname, endingDate, sactive FROM users WHERE id = ?`, [userData.identities[0].user_id]);
            const brands = await queryAsync(`SELECT * FROM brands WHERE brandOwner = ?`, [userData.identities[0].user_id]);

            // Fetch user reviews
            const reviews = await queryAsync(`SELECT productId FROM reviews WHERE ownerId = ?`, [userData.identities[0].user_id])

            if (results && results.length > 0) {
                const subData = { plan: results[0].sname, subEndDate: results[0].endingDate, subActive: results[0].sactive, reviews};
                return { message: "User fetched successfully", brands: brands, ...subData };
            } else {
                return { message: "User not found" };
            }
        } catch (error) {
            console.log(error);
            return { message: "Error fetching user" };
        }
    }

    async updateUser(userID: string, data: UserDto): Promise<{ message: string; }> {
        // const userResponse = await fetch(`${process.env.AUTH0_MANAGEMENT_AUDIENCE}users/${userID}`, {
        //     headers: {
        //     authorization: `Bearer ${await this.getAccessToken()}`,
        //     }
        // });
        // const userData = await userResponse.json();
        // console.log(userData)
        const user = userID;

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

    async updateAuthData(userID: string, data: UpdateFields, authUserID: string){
        if(userID !== authUserID) {
            return { message: "Unauthorized" };
        }

        const isAuth0User = authUserID.startsWith("auth0|");

        const updateFields: UpdateFields  = {}

        if(isAuth0User){
            if(data.email) updateFields.email = data.email;
            if(data.password) updateFields.password = data.password;
        }

        if (data.name) updateFields.name = data.name;

        if(Object.keys(updateFields).length === 0) {
            return { message: "No fields to update" };
        }

        try{
            if(updateFields.password) {
                const management = await this.getManagementClient();
                await management.users.update( { id: userID }, updateFields );
                return { message: "Password updated successfully" };
            }
            const fields = ["email", "name"];
            const filledFields = Object.keys(data).filter(key => data[key] && fields.includes(key));
            const sqlQuery = `UPDATE users SET ${filledFields.map(key => `${key} = ?`).join(", ")}, updated_at = NOW() WHERE id = ?`;
            const sqlData = [...filledFields.map(key => data[key]), userID.split('|')[1]];
            await this.connection.query(sqlQuery, sqlData, (err) => {
                if(err) {
                    console.log(err);
                    return { message: "Error updating user" };
                }
            });
            return { message: "Password updated successfully" };
        }catch(err) {
            console.log(err);
            return { message: "Error updating password" };
        }
    }

    async deleteUser(userID: string, authUserID: string): Promise<{ message: string; }> {
        if(userID !== authUserID.split('|')[1]) {
            return { message: "Unauthorized" };
        }

        try{
            // Use db data for stripe subscription deletion
            await this.deleteStripeData(userID);

            // Delete user from Auth0 
            await this.deleteAuthUser(authUserID);

            // Delete user from db
            await this.connection.query(`DELETE FROM users WHERE id = ?`, [userID], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error deleting user" };
                }
                console.log(results);
                return { message: "User deleted successfully" };
            });

            return { message: "User deleted successfully" };

        }catch(err) {
            console.log(err)
            return {message: "Failed to delete user"}
        }
    }

}
