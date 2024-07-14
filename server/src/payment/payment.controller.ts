import { Controller, Post, Body, UseGuards, Res, Header, Req, RawBodyRequest, Request } from '@nestjs/common';
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

  @UseGuards(AuthGuard('jwt'))
  @Post("create-subscription")
  async createSubscription(@Body() data, @Res() response): Promise<void> {
    console.log("here")
    console.log(data)
    const url = await this.stripeService.createSubscription(data.tier, data.userId);
    response.json({ url });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('upgrade-subscription')
  async upgradeSubscription(@Body() data, @Res() response): Promise<void> {
    const url = await this.stripeService.createUpgradeSubscription(data.tier, data.userId);
    response.json({ url });
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('cancel-subscription')
  async cancelSubscription(@Request() req, @Res() response): Promise<void> {
    const userId = req.user.sub;
    const url = await this.stripeService.cancelSubscription(userId);
    response.json({ url });
  }

  @Post('webhook')
  @Header('Content-Type', 'application/json')
  async stripeWebhook(@Req() req: RawBodyRequest<Request>, @Res() response): Promise<void> {
    const rawBody = req.rawBody;
    const signature = req.headers['stripe-signature'];
    const session = await this.stripeService.checkoutListener(rawBody, signature);
    response.json(session);
  }

}
