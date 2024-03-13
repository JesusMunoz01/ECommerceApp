import { Controller, Get, UseGuards, Headers, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Headers('authorization') authorization: string): {data: string} {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post("/user")
  async getHello2(@Body() body: { data: string; test: string }): Promise<{ data: string; }> {
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
      return { data: "First login" };
    }
    console.log("Post Request Done")
    return this.appService.getHello();
  }
}
