import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

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

    async getOrder(orderID: string): Promise<{ message: string; }> {
        try{
            await this.connection.query(`SELECT * FROM orders WHERE id = ?`, [orderID], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error getting order" };
                }
                console.log(results);
                return { message: "Order retrieved successfully" };
            });
        }
        catch(err) {
            console.log(err);
            return { message: "Error getting order" };
        }
    }
}
