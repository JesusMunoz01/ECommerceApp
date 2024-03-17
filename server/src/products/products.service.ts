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

    async getProduct(id: string): Promise<{ message: string; }> {
        try{
            this.connection.query(`SELECT * FROM products WHERE id = ?`, [id], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error getting product" };
                }
                console.log(results);
                return { message: "Product retrieved successfully" };
            });
        }
        catch(err) {
            console.log(err);
            return { message: "Error getting product" };
        }
    }

    async createProduct(userID, productData: { name: string; description: string; price: number; stock: number; discountNumber: number; }): Promise<{ message: string; }> {
        try{
            this.connection.query(`INSERT INTO products (name, description, price, stock, discountNumber, created_at, updated_at) VALUES 
            (?, ?, ?, NOW(), NOW())`, [productData.name, productData.description, productData.price, productData.stock, productData.discountNumber], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error creating product" };
                }
                console.log(results);
                return { message: "Product created successfully" };
            });
        }
        catch(err) {
            console.log(err);
            return { message: "Error creating product" };
        }
    }
}
