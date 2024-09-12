import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AppService } from 'src/app.service';
import { StripeService } from 'src/payment/payment.service';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [OrdersModule],
  providers: [UsersService, AppService, StripeService],
  controllers: [UsersController]
})
export class UsersModule {}
