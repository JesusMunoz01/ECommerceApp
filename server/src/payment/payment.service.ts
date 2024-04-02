import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ProductDto } from 'src/products/dto/product.dto';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private readonly stripe: Stripe;
  private connection = this.appService.connection;

  constructor(private appService: AppService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }

  async createCheckoutSession(items, userId): Promise<string> {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: items.map(item => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
            metadata: {
              productId: item.id,
            }
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

  async createSubscription(planId, userId): Promise<string> {
    let price;

    if(planId === 1)
      return 'Free plan does not require payment';
    else if(planId === 2)
      price = "price_1P076aIaMlkIlLqjzNNVBPcH"
    else if(planId === 3)
      price = "price_1P077DIaMlkIlLqjeZXgNdMF"
    else
      return 'Invalid plan ID';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: userId,
      metadata: {"userId": userId, "planId": planId, "priceId": price, "plan": "Premium"},
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}`,
      cancel_url: `${process.env.CLIENT_URL}`,
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
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription;
        const userSubId = subscription.customer;
        const planId = subscription.items.data[0].price.id;
        const plan = await this.stripe.plans.retrieve(planId);
        const userSID = subscription.metadata.userId;
        console.log(subscription.metadata);

        // Update user plan in database
        const user = await new Promise((resolve, reject) => {
          this.connection.query(`UPDATE users SET plan = ?, pid = ? WHERE id = ?`, [plan.nickname, userSubId, userId], (err, results) => {
            if (err) {
              console.log(err);
              reject({ message: "Error updating user" });
            } else {
              resolve(results);
            }
          });
        });
        return event.data.object as Stripe.Checkout.Session;
      case 'checkout.session.completed':
        if(!event.data.object.client_reference_id)
          break;
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.id;
        const userId = session.client_reference_id;
        const total = session.amount_total;
        const currency = session.currency;
        const lineItems = await this.stripe.checkout.sessions.listLineItems(orderId, { limit: 100 });

        const productIds = await Promise.all(lineItems.data.map(async (item) => {
          const product = await this.stripe.products.retrieve(item.price.product.toString());
          const productId = product.metadata.productId;
          const intId = parseInt(productId);
          return intId;
        }));

        // Create order in database
        const order = await new Promise((resolve, reject) => {
          this.connection.query(`INSERT INTO orders (productsID, ownerID, price, status) VALUES (?, ?, ?, "Pending")`, [productIds, userId, total], (err, results) => {
            if (err) {
              console.log(err);
              reject({ message: "Error creating order" });
            } else {
              resolve(results);
            }
          });
        });
        return event.data.object as Stripe.Checkout.Session;
      case 'checkout.session.failed':
        console.log('Payment failed');
        console.log(event.data.object);
        return event.data.object as Stripe.Checkout.Session;
      case 'subscription_schedule.canceled':
        console.log('Subscription canceled');
        console.log(event.data.object);
        return event.data.object as Stripe.Checkout.Session;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

  }

}
