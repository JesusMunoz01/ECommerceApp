import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class UsersService {
    constructor(private appService: AppService) {}
    private connection = this.appService.connection;

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
        const userResponse = await fetch(`${process.env.AUTH0_MANAGEMENT_AUDIENCE}users/${userID}`, {
            headers: {
            authorization: `Bearer ${this.getAccessToken()}`,
            }
        });
        const userData = await userResponse.json();
        if(userData.logins_count === 1) {
            try{
                this.connection.query(`INSERT INTO users (id, email, name, picture, created_at, updated_at) VALUES 
                (?, ?, ?, ?, NOW(), NOW())`, [userData.user_id, userData.email, userData.name, userData.picture], (err, results) => {
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
        console.log("Post Request Done")
        return { message: "User already exists" };
    }

    async getUser(userID: string): Promise<{ message: string; }> {
        const userResponse = await fetch(`${process.env.AUTH0_MANAGEMENT_AUDIENCE}users/${userID}`, {
            headers: {
            authorization: `Bearer ${this.getAccessToken()}`,
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
        console.log("Post Request Done")
        return { message: "User already exists" };
    }

    async updateUser(userID: string, data): Promise<{ message: string; }> {
        const userResponse = await fetch(`${process.env.AUTH0_MANAGEMENT_AUDIENCE}users/${userID}`, {
            headers: {
            authorization: `Bearer ${this.getAccessToken()}`,
            }
        });
        const userData = await userResponse.json();
        const user = userData.user_id;
        try{
            this.connection.query(`UPDATE users SET email = ?, name = ?, picture = ?, updated_at = NOW() WHERE id = ?`, 
            [userData.email, userData.name, userData.picture, user], (err, results) => {
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
        console.log("Post Request Done")
        return { message: "User already exists" };
    }

    async deleteUser(userID: string): Promise<{ message: string; }> {
        const userResponse = await fetch(`${process.env.AUTH0_MANAGEMENT_AUDIENCE}users/${userID}`, {
            headers: {
            authorization: `Bearer ${this.getAccessToken()}`,
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
        console.log("Post Request Done")
        return { message: "User already exists" };
    }

}
