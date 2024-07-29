import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { UpdateFields, UsersService } from './users.service';
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
      return this.usersService.createUser(id, false);
    }

    @Patch(":id")
    async updateUser(@Param("id") id: string, @Body() userData: UserDto): Promise<{ message: string; }> {
      return this.usersService.updateUser(id, userData);
    }

    @Patch("/auth/:id")
    async updateUserAuth(@Param("id") userID: string, @Request() req, @Body() data: UpdateFields) {
      const authUserId = req.user.sub
      return this.usersService.updateAuthData(userID, data, authUserId);
    }

    @Delete(":id")
    async deleteUser(@Param("id") id: string, @Request() req): Promise<{ message: string; }> {
      return this.usersService.deleteUser(id, req.user.sub);
    }
}
