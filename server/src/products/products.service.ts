import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

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

    async createProduct(userID: string, productData: ProductDto): Promise<{ message: string; }> {
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

    async updateProduct(id: string, data: UpdateProductDto): Promise<{ message: string; }> {
        try{
            this.connection.query(`UPDATE products SET name = ?, description = ?, price = ?, stock = ?, discountNumber = ?, updated_at = NOW() WHERE id = ?`, 
            [data.name, data.description, data.price, data.stock, data.discountNumber, id], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error updating product" };
                }
                console.log(results);
                return { message: "Product updated successfully" };
            });
        }
        catch(err) {
            console.log(err);
            return { message: "Error updating product" };
        }
    }

    async deleteProduct(id: string): Promise<{ message: string; }> {
        try{
            this.connection.query(`DELETE FROM products WHERE id = ?`, [id], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error deleting product" };
                }
                console.log(results);
                return { message: "Product deleted successfully" };
            });
        }
        catch(err) {
            console.log(err);
            return { message: "Error deleting product" };
        }
    }
}
