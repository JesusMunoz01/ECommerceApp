import { Controller, Post, Body, UseGuards, Res, Header, Req } from '@nestjs/common';
import { StripeService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('payments')
export class PaymentController {
  constructor(private readonly stripeService: StripeService) {}
  
  @UseGuards(AuthGuard('jwt'))
  @Post('create-checkout-session')
  async createCheckoutSession(@Body() data, @Res() response): Promise<void> {
    const url = await this.stripeService.createCheckoutSession(data.items, data.userId);
    response.json({ url });
  }

  @Post('webhook')
  @Header('Content-Type', 'application/json')
  async stripeWebhook(@Req() req, @Res() response): Promise<void> {
    console.log(req.body)
    const rawBody = req.body;
    console.log(rawBody);
    const signature = req.headers['stripe-signature'];
    const session = await this.stripeService.checkoutListener(rawBody.toString(), signature);
    response.json(session);
  }

}
