import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UserData, UsersService } from './users.service';
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

    @Post(":id/update")
    async updateUser(@Param("id") id: string, @Body() body: UserData): Promise<{ message: string; }> {
      return this.usersService.updateUser(id, body);
    }

    @Delete(":id/delete")
    async deleteUser(@Param("id") id: string): Promise<{ message: string; }> {
      return this.usersService.deleteUser(id);
    }
        
}
