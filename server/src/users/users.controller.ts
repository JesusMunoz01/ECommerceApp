import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("jwt"))
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post("/create")
    async createUser(@Body() body: { data: string; test: string }): Promise<{ message: string; }> {
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
          const userResponse = await fetch(`${process.env.AUTH0_MANAGEMENT_AUDIENCE}users/${body.data}`, {
            headers: {
              authorization: `Bearer ${aToken.access_token}`,
            }
          });
          const userData = await userResponse.json();
          if(userData.logins_count === 1) {
            console.log("First login")
            return { message: "First login" };
          }
          console.log("Post Request Done")
          return this.usersService.createUser();
        }
        
}
