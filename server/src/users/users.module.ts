import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AppService } from 'src/app.service';

@Module({
  providers: [UsersService, AppService],
  controllers: [UsersController]
})
export class UsersModule {}
