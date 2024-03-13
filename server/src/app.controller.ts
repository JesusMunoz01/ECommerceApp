import { Controller, Get, UseGuards, Headers, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): {data: string} {
    return this.appService.getHello();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async getHello2(@Body() body: { data: string; test: string }): Promise<{ data: string; }> {
    return this.appService.getHello();
  }
}
