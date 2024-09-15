import { forwardRef, Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { AppService } from 'src/app.service';
import { OrdersService } from './orders.service';
import { StripeService } from 'src/payment/payment.service';
import { PaymentModule } from 'src/payment/payment.module';

@Module({
  providers: [AppService, OrdersService, StripeService],
  controllers: [OrdersController],
  exports: [OrdersService],
  imports: [forwardRef(() => PaymentModule)]
})
export class OrdersModule {}
