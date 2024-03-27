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

  async checkoutListener(req, signature): Promise<Stripe.Checkout.Session> {
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(req, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
      throw new Error(`Webhook Error: ${err.message}`);
    }
    
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.id;
        const userId = session.client_reference_id;
        const total = session.amount_total;
        const currency = session.currency;
        const lineItems = await this.stripe.checkout.sessions.listLineItems(orderId, { limit: 100 });

        // console.log('Line Items:', lineItems);

        const productIds = await Promise.all(lineItems.data.map(async (item) => {
          const product = await this.stripe.products.retrieve(item.price.product.toString());
          const productId = product.metadata.productId;
          const intId = parseInt(productId);
          return intId;
        }));
        
        // console.log('Product IDs:', productIds);

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
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

  }

}
