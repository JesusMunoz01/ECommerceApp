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

  async createCheckoutSession(amount: number): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Your Product',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'https://localhost:8080/success',
      cancel_url: 'https://localhost:8080/cancel',
    });
    return session.id;
  }

}
