import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { StripeService } from './payment.service';
import * as bodyParser from 'body-parser';
import { RawBodyMiddleware } from './middleware/rawBody.middleware';

@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [StripeService]
})
export class PaymentModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RawBodyMiddleware)
      .forRoutes("webhook");
  }
}
