import { Controller, Post, Body, UseGuards, Res } from '@nestjs/common';
import { StripeService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('payments')
export class PaymentController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() data, @Res() response): Promise<void> {
    const url = await this.stripeService.createCheckoutSession(data.items);
    response.json({ url });
  }
}