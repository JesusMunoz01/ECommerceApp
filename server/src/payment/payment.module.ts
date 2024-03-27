import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { StripeService } from './payment.service';
import { AppService } from 'src/app.service';
@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [StripeService, AppService]
})

export class PaymentModule {}
