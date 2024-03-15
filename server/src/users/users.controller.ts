import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("jwt"))
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(":id")
    async getUser(@Param("id") id: string): Promise<{ message: string; }> {
      return this.usersService.getUser(id);
    }

    @Post("/create")
    async createUser(@Body() body: { data: string; test: string }): Promise<{ message: string; }> {
      return this.usersService.createUser(body.data);
    }
        
}
