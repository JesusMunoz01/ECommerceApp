import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard("jwt"))
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post("/create")
    async createUser(@Body() body: { data: string; test: string }): Promise<{ message: string; }> {
      return this.usersService.createUser(body.data);
    }
        
}
