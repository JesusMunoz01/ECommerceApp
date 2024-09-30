import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { AppService } from 'src/app.service';
import { OrdersService } from './orders.service';
import { StripeService } from 'src/payment/payment.service';

@Module({
  providers: [AppService, OrdersService, StripeService],
  controllers: [OrdersController],
  exports: [OrdersService],
})
export class OrdersModule {}
