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
    let planName;

    const dbUserId = userId.split('|')[1]

    if(planId === 1){
      return 'Free plan does not require payment';}
    else if(planId === 2){
      price = "price_1P076aIaMlkIlLqjzNNVBPcH"
      planName = "Premium"
    }
    else if(planId === 3){
      price = "price_1P077DIaMlkIlLqjeZXgNdMF"
      planName = "Enterprise"
    }
    else
      return 'Invalid plan ID';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}`,
      cancel_url: `${process.env.CLIENT_URL}`,
      subscription_data: {
        metadata: {
          userId: dbUserId,
          planName: planName
        }
      },
    });

    return session.url;
  }

  async createUpgradeSubscription(planId, userId): Promise<string> {
    let price;
    let planName;

    const dbUserId = userId.split('|')[1]

    const userStripeId = await new Promise((resolve, reject) => {
      this.connection.query(`SELECT sid FROM users WHERE id = ?`, [dbUserId], (err, results) => {
        if (err) {
          console.log(err);
          reject({ message: "Error getting user" });
        } else {
          resolve(results[0].sid);
        }
      });
    });

    if(planId === 2){
      price = "price_1P076aIaMlkIlLqjzNNVBPcH"
      planName = "Premium"
    }
    else if(planId === 3){
      price = "price_1P077DIaMlkIlLqjeZXgNdMF"
      planName = "Enterprise"
    }
    else
      return 'Invalid plan ID';

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer: userStripeId as string,
      line_items: [
        {
          price: price,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}`,
      cancel_url: `${process.env.CLIENT_URL}`,
      subscription_data: {
        metadata: {
          userId: dbUserId,
          planName: planName
        }
      },
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
      // Subscription created or updated --------------------------------------
      case 'customer.subscription.updated':
        const userSID = event.data.object.metadata.userId;
        const planName = event.data.object.metadata.planName;
        const subscription = event.data.object as Stripe.Subscription;
        const userSubId = subscription.customer;
        const endingDate = subscription.current_period_end;
        // const planId = subscription.items.data[0].price.id;

        // Update user plan in database
        await new Promise((resolve, reject) => {
          this.connection.query(`UPDATE users SET sname = ?, endingDate = FROM_UNIXTIME(?), pid = ? WHERE id = ?`, [planName, endingDate, userSubId, userSID], (err, results) => {
            if (err) {
              console.log(err);
              reject({ message: "Error updating user" });
            } else {
              resolve(results);
            }
          });
        });
        return event.data.object as Stripe.Checkout.Session;
      // Order completed --------------------------------------
      case 'checkout.session.completed':
        if(!event.data.object.client_reference_id)
          break;
        const session = event.data.object as Stripe.Checkout.Session;
        const orderId = session.id;
        const userId = session.client_reference_id;
        const total = session.amount_total;
        // const currency = session.currency;
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
      // Payment failed --------------------------------------
      case 'checkout.session.failed':
        console.log('Payment failed');
        console.log(event.data.object);
        return event.data.object as Stripe.Checkout.Session;
      // Subcription ended and not renewed --------------------------------------
      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice;

        if(invoice.billing_reason === 'subscription_cycle' && invoice.status !== 'paid'){
          const userStripeId = event.data.object.customer;

          // Update user plan in database
          await new Promise((resolve, reject) => {
            this.connection.query(`UPDATE users SET sname = Free WHERE sid = ?`, [userStripeId], (err, results) => {
              if (err) {
                console.log(err);
                reject({ message: "Error updating user" });
              } else {
                resolve(results);
              }
            });
          });
        }
        return event.data.object as Stripe.Checkout.Session;
      // Order refunded --------------------------------------
      case 'charge.refunded':
        const charge = event.data.object as Stripe.Charge;
        // Order refunded
        if(charge.metadata.orderId)
          await new Promise((resolve, reject) => {
          this.connection.query(`UPDATE orders SET status = "Cancelled" WHERE id = ?`, [charge.metadata.orderId], (err, results) => {
            if (err) {
              console.log(err);
              reject({ message: "Error refunding order" });
            } else {
              resolve(results);
            }
          });
        });
        // Subscription refunded
        if(charge.customer)
          await new Promise((resolve, reject) => {
          this.connection.query(`UPDATE users SET sname = Free WHERE sid = ?`, [charge.customer], (err, results) => {
            if (err) {
              console.log(err);
              reject({ message: "Error refunding subscription" });
            } else {
              resolve(results);
            }
          });
        });
        return event.data.object as Stripe.Checkout.Session;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
