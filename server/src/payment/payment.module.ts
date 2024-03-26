import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { StripeService } from './payment.service';
//import { RawBodyMiddleware } from './middleware/rawbody-middleware';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [StripeService]
})

export class PaymentModule {}