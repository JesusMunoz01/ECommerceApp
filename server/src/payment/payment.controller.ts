import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { StripeService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(@Body() body: { amount: number }): Promise<{ clientSecret: string }> {
    const clientSecret = await this.stripeService.createPaymentIntent(body.amount);
    return { clientSecret };
  }

  // Controllers
}
