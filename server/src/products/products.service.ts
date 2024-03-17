import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class ProductsService {
    constructor(private appService: AppService) {}
    private connection = this.appService.connection;

    async getProducts(): Promise<{ message: string; }> {
        try{
            this.connection.query(`SELECT * FROM products`, (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error getting products" };
                }
                console.log(results);
                return { message: "Products retrieved successfully" };
            });
        }
        catch(err) {
            console.log(err);
            return { message: "Error getting products" };
        }
    }
}
