import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { OrderDto } from './dto/order.dto';

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
            const orders = await new Promise((resolve, reject) => {
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

    async createOrder(userID: string, orderData: OrderDto): Promise<{ message: string; }> {
        try{
            await this.connection.query(`INSERT INTO orders (id, productsID, ownerID, price, status, created_at, updated_at) VALUES 
            (?, ?, ?, ?, ?, NOW(), NOW())`, [orderData.id, orderData.productsID, userID, orderData.price, orderData.status], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error creating order" };
                }
                console.log(results);
                return { message: "Order created successfully" };
            });
        }
        catch(err) {
            console.log(err);
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
