import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { StripeService } from './payment.service';
import { AppService } from 'src/app.service';
import { OrdersModule } from 'src/orders/orders.module';
import { UsersService } from 'src/users/users.service';
@Module({
  imports: [OrdersModule],
  controllers: [PaymentController],
  providers: [StripeService, AppService, UsersService]
})

export class PaymentModule {}
