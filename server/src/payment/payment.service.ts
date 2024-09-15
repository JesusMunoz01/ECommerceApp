import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { OrderDto } from 'src/orders/dto/order.dto';
import { OrdersService } from 'src/orders/orders.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  public readonly stripe: Stripe;
  private connection = this.appService.connection;

  constructor(private appService: AppService, 
    @Inject(forwardRef(() => OrdersService)) private readonly orderService: OrdersService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });
  }
  
  async createCoupon() {
    const coupon = await this.stripe.coupons.create({
      percent_off: 50, // Assuming the user paid $9.99 and the upgrade cost is $19.99, so 50% off.
      duration: 'once',
      name: 'Upgrade discount',
    });
    return coupon.id;
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
          planName: planName,
          discount_used_for_upgrade: planName === "Premium" ? 'false' : 'true',
        }
      },
    });

    return session.url;
  }


  async createUpgradeSubscription(planId, userId): Promise<string> {
    
    const couponId = await this.createCoupon();
    let planName = "Enterprise";

    const dbUserId = userId.split('|')[1]

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: "price_1P077DIaMlkIlLqjeZXgNdMF",
          quantity: 1,
        },
      ],
      mode: 'subscription',
      discounts: [{ coupon: couponId }],
      success_url: `${process.env.CLIENT_URL}`,
      cancel_url: `${process.env.CLIENT_URL}`,
      subscription_data: {
        metadata: {
          userId: dbUserId,
          planName: planName,
          // discount_used_for_upgrade: 'true',
        }
      },
    });

    return session.url;
  }

  async cancelSubscription(userId: string): Promise<string> {
    try{
      const subID:string = await new Promise((resolve, reject) => {
        this.connection.query(`SELECT sid FROM users WHERE id = ?`, [userId.split('|')[1]], (err, results) => {
          if (err) {
            console.log(err);
            reject({ message: "Error getting user" });
          } else {
            resolve(results[0].sid);
          }
        });
      });

      if(subID === null)
        return 'Subscription not found';

      const cancelAttempt = await this.stripe.subscriptions.cancel(subID, { prorate: true });

      if(cancelAttempt.status === 'canceled'){
        await new Promise((resolve, reject) => {
          this.connection.query(`UPDATE users SET sactive = ? WHERE id = ?`, [false, userId.split('|')[1]], (err, results) => {
            if (err) {
              console.log(err);
              reject({ message: "Error updating user" });
            } else {
              resolve(results);
            }
          });
        });
        return 'Subscription cancelled';
      }
      else
        return 'Error cancelling subscription';
    } catch (error) {
      return error.message;
    }
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
      case 'customer.subscription.updated' || 'customer.subscription.created':
        const userSID = event.data.object.metadata.userId;
        const planName = event.data.object.metadata.planName;
        // console.log(planName)
        const subscription = event.data.object as Stripe.Subscription;
        const subscriptionName = subscription.metadata.planName;
        // console.log("-------------------")
        // console.log(subscriptionName)
        const userPid = subscription.customer;
        const userSubId = subscription.id;
        const endingDate = subscription.current_period_end;
        // const planId = subscription.items.data[0].price.id;

        // Update user plan in database
        await new Promise((resolve, reject) => {
          this.connection.query(`UPDATE users SET sname = ?, endingDate = FROM_UNIXTIME(?), pid = ?, sid = ?, sactive = ? WHERE id = ?`, 
            [planName, endingDate, userPid, userSubId, true, userSID], (err, results) => {
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
        console.log(session)
        const orderId = session.id;
        const userId = session.client_reference_id;
        const total = session.amount_total;
        const lineItems = await this.stripe.checkout.sessions.listLineItems(orderId, { limit: 100 });

        // const productIds = await Promise.all(lineItems.data.map(async (item) => {
        //   const product = await this.stripe.products.retrieve(item.price.product.toString());
        //   const productId = product.metadata.productId;
        //   const intId = parseInt(productId);
        //   return intId;
        // }));

        // Retrieve the PaymentIntent to get the payment method
        const paymentIntentId = session.payment_intent as string;
        const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

          // Extract payment method details
        const paymentMethodId = paymentIntent.payment_method as string;
        const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);

        // Get payment method type (e.g., card) and brand if available
        const paymentMethodType = paymentMethod.type;
        const paymentTime = paymentIntent.created


        // Retrieve the shipping address from the session
        const shippingDetails = session.shipping_details;
        const shippingAddress = shippingDetails
          ? `${shippingDetails.address.line1}, ${shippingDetails.address.city}, ${shippingDetails.address.country}`
          : "N/A"

        const orderData: OrderDto = {
          userId,
          total,
          shippingAddress,
          paymentMethod: paymentMethodType,
          status: "Completed"
        }

        // Create order in database
        this.orderService.createOrder(orderData, lineItems)

        // TODO: Delete order if failed (here or order.service.ts)


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
      // TODO: Handle subscription cancellation
      //case 'customer.subscription.deleted':
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}
