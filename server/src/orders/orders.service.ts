import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { CompleteOrderDto, OrderDto } from './dto/order.dto';
import Stripe from 'stripe';

@Injectable()
export class OrdersService {
    constructor(private appService: AppService) {}
    private connection = this.appService.connection;

    async getOrders(userID: string): Promise<{ message: string; }> {
        try{
            await this.connection.query(`SELECT * FROM orders WHERE user_id = ?`, [userID], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error getting orders" };
                }
                console.log(results);
                return { message: "Orders retrieved successfully" };
            });
        }
        catch(err) {
            console.log(err);
            return { message: "Error getting orders" };
        }
    }

    async getUserOrders(userID: string): Promise<{ message: string; orders?: any }> {
        try{
            const orders: CompleteOrderDto[] = await new Promise((resolve, reject) => {
                this.connection.query(`
                    SELECT 
                        o.*,
                        p.id AS productId, 
                        p.name AS productName, 
                        p.price AS productPrice, 
                        oi.quantity 
                    FROM 
                        orders o
                    JOIN 
                        orderItems oi ON o.id = oi.orderId
                    JOIN 
                        products p ON oi.productId = p.id
                    WHERE 
                        o.userId = ?;
                    `, [userID.split('|')[1]], (err, results) => {
                    if(err) {
                        console.log(err);
                        reject({ message: "Error getting user orders" });
                    }
                    console.log(results);
                    resolve(results);
                })
            })
            return { message: "User orders retrieved successfully", orders };
        }
        catch(err) {
            console.log(err);
            return { message: "Error getting user orders" };
        }
    }

    async getOrder(userID: string, orderID: number): Promise<{ message: string; order?:any }> {
        // TODO: Test query and format results
        try{
            const order = await new Promise((resolve, reject) => {
                this.connection.query(`
                    SELECT 
                        o.*,
                        p.id AS productId, 
                        p.name AS productName, 
                        p.price AS productPrice, 
                        oi.quantity 
                    FROM 
                        orders o
                    JOIN 
                        orderItems oi ON o.id = oi.orderId
                    JOIN 
                        products p ON oi.productId = p.id
                    WHERE
                        o.userId = ? AND o.id = ?;
                    `, [userID.split('|')[1], orderID], (err, results) => {
                    if(err) {
                        console.log(err);
                        reject({ message: "Error getting order" });
                    }
                    console.log(results);
                    resolve(results);
                })
            })
            return { message: "Order retrieved successfully", order };
        }
        catch(err) {
            console.log(err);
            return { message: "Error getting order" };
        }
    }

    async createOrder(orderData: OrderDto, lineItems: Stripe.Response<Stripe.ApiList<Stripe.LineItem>>): Promise<{ message: string; }> {
        try{
            const order: any = await new Promise((resolve, reject) => {
                this.connection.query("INSERT INTO orders (userId, total, status, paymentMethod, shippingAddress) VALUES (?, ?, ?, ?, ?)",
                  [orderData.userId, orderData.total, orderData.status, orderData.paymentMethod, orderData.shippingAddress], (err, results) => {
                  if (err) {
                    console.log(err);
                    reject({ message: "Error creating order" });
                  } else {
                    resolve(results);
                  }
                });
              });
      
              // Create order items in database
              // TODO: Verify if product IDs are correct
              await Promise.all(lineItems.data.map(async (item) => {
                await new Promise((resolve, reject) => {
                  this.connection.query("INSERT INTO orderItems (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)",
                    [order.insertId, item.price.product, item.quantity, item.amount_subtotal], (err, results) => {
                    if (err) {
                      console.log(err);
                      reject({ message: "Error creating order items" });
                    } else {
                      resolve(results);
                    }
                  });
                });
              }));
        }
        catch(err) {
            console.log(err);
            // TODO: Delete order if failed (here or payment.service.ts)
            return { message: "Error creating order" };
        }
    }

    async cancelOrder(userID: string, orderID: string): Promise<{ message: string; }> {
        try{
            await this.connection.query(`UPDATE orders SET status = ? WHERE id = ? AND ownerID = ?`, ["cancelled", orderID, userID], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error cancelling order" };
                }
                console.log(results);
                return { message: "Order cancelled successfully" };
            });
        }
        catch(err) {
            console.log(err);
            return { message: "Error cancelling order" };
        }
    }
}
