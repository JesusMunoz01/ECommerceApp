import { Controller, Get, UseGuards, Headers } from '@nestjs/common';
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
  @Get("/protected")
  async getHello2(@Headers('authorization') authorization: string): Promise<{ data: string; }> {
    const token = authorization.split(' ')[1];
    const userResponse = await fetch(`${process.env.AUTH0_ISSUER_URL}userinfo`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    console.log(await userResponse.json());
    return this.appService.getHello();
  }
}
