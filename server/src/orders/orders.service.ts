import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { Order, OrderDetails, OrderDto, OrderItemDto, StripeItem } from './dto/order.dto';

type OrderInsertResponse = {
    affectedRows: number;
    insertId: number; // Assuming you have an auto-incrementing ID for orders
    warningStatus: number;
};

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

    async getUserOrders(userID: string): Promise<{ message: string; fullOrders?: Order[] }> {
        try{
            const ordersDetails: OrderDetails[] = await new Promise((resolve, reject) => {
                this.connection.query(`SELECT * from orders WHERE userId = ?`, [userID.split('|')[1]], 
                    (err, results) => {
                            if(err) {
                                console.log(err);
                                reject({ message: "Error getting user orders" });
                            }
                            //console.log(results);
                            resolve(results);
                    })
                })
            const fullOrders: Order[] = await new Promise(async (resolve, reject) => {
                try {

                    // Sort orderDetails by the `created` date in descending order
                    const sortedOrdersDetails = ordersDetails.sort((a, b) => {
                        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    });

                    const ordersWithItems: Order[] = await Promise.all(
                        sortedOrdersDetails.map(async (order) => {
                            const items: OrderItemDto = await new Promise((resolve, reject) => {
                                this.connection.query(`
                                    SELECT 
                                        oi.quantity,
                                        p.name AS productName, 
                                        p.price AS productPrice
                                    FROM 
                                        orderitems oi
                                    JOIN 
                                        products p ON oi.productId = p.id
                                    WHERE 
                                        oi.orderId = ?;
                                    `, [order.id], (err, results) => {
                                    if (err) {
                                        console.log(err);
                                        return reject({ message: "Error getting user orders" });
                                    }
                                    resolve(results);
                                });
                            });
                            // Destructure to only send needed details
                            const {userId, ...orderInfo} = order
                            return { ...orderInfo, items };
                        })
                    );
                    resolve(ordersWithItems);
                } catch (error) {
                    reject(error);
                }
            });                

            return { message: "User orders retrieved successfully", fullOrders };
        }
        catch(err) {
            console.log(err);
            return { message: "Error getting user orders" };
        }
    }

    async getOrder(userID: string, orderID: number): Promise<{ message: string; order?: Order }> {
        try{
            const orderDetails: OrderDetails = await new Promise((resolve, reject) => {
                this.connection.query(`
                    SELECT
                        id,
                        total, 
                        orderDate, 
                        status,
                        shippingAddress 
                    FROM 
                        orders 
                    WHERE 
                        userId = ? and id = ?`, [userID.split('|')[1], orderID], 
                    (err, results) => {
                            if(err) {
                                console.log(err);
                                reject({ message: "Error getting user orders" });
                            }
                            //console.log(results);
                            resolve(results[0]);
                    })
            })
            const orderItems: OrderItemDto = await new Promise((resolve, reject) => {
                this.connection.query(`
                    SELECT 
                        oi.quantity,
                        p.name AS productName, 
                        p.price AS productPrice
                    FROM 
                        orderitems oi
                    JOIN 
                        products p ON oi.productId = p.id
                    WHERE
                        oi.orderId = ?;
                    `, [orderID], (err, results) => {
                    if(err) {
                        console.log(err);
                        reject({ message: "Error getting order" });
                    }
                    
                    resolve(results);
                })
            })

            const {userId, orderDate, ...orderInfo} = orderDetails

            const formattedDate = orderDate.toLocaleString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false
              });

            const  order = {...orderInfo, orderDate: formattedDate, items: orderItems}
            return { message: "Order retrieved successfully", order };
        }
        catch(err) {
            console.log(err);
            return { message: "Error getting order" };
        }
    }

    async createOrder(orderData: OrderDto, orderItems: StripeItem[]): Promise<{ message: string; }> {
        try{
            const order: OrderInsertResponse = await new Promise((resolve, reject) => {
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
              await Promise.all(orderItems.map(async (item) => {
                await new Promise((resolve, reject) => {
                  this.connection.query("INSERT INTO orderItems (orderId, productId, quantity, price) VALUES (?, ?, ?, ?)",
                    [order.insertId, item.id, item.quantity, item.subtotal], (err, results) => {
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
