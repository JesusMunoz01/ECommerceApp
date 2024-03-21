import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(amount: number): Promise<string> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });
    return paymentIntent.client_secret;
  }

  // Methods
}
