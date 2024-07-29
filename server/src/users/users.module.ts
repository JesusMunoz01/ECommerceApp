import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AppService } from 'src/app.service';
import { StripeService } from 'src/payment/payment.service';

@Module({
  providers: [UsersService, AppService, StripeService],
  controllers: [UsersController]
})
export class UsersModule {}
