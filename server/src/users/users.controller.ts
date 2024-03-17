import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/userUpdate.dto';

@UseGuards(AuthGuard("jwt"))
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get(":id")
    async getUser(@Param("id") id: string): Promise<{ message: string; }> {
      return this.usersService.getUser(id);
    }

    @Post("/create")
    async createUser(@Body() id: string): Promise<{ message: string; }> {
      return this.usersService.createUser(id);
    }

    @Patch(":id")
    async updateUser(@Param("id") id: string, @Body() userData: UserDto): Promise<{ message: string; }> {
      return this.usersService.updateUser(id, userData);
    }

    @Delete(":id")
    async deleteUser(@Param("id") id: string): Promise<{ message: string; }> {
      return this.usersService.deleteUser(id);
    }
        
}
