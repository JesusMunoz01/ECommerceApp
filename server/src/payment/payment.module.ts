import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { StripeService } from './payment.service';
@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [StripeService]
})

export class PaymentModule {}
