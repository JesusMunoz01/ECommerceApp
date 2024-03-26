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

  async createCheckoutSession(items, userId): Promise<string> {
    console.log(items);
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            //images: [item.image],
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}`,
      cancel_url:  `${process.env.CLIENT_URL}`,
      client_reference_id: userId,
    });
    return session.url;
  }

  async checkoutListener(req, signature): Promise<Stripe.Checkout.Session> {
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(req, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'checkout.session.completed':
        return event.data.object as Stripe.Checkout.Session;
      case 'checkout.session.failed':
        console.log('Payment failed');
        console.log(event.data.object);
        return event.data.object as Stripe.Checkout.Session;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

  }

}
