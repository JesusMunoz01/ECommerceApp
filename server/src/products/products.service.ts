import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Injectable()
export class ProductsService {
    constructor(private appService: AppService) {}
    private connection = this.appService.connection;

    private async getUserRole(userID: string): Promise<string> {
        try{
            const userRole = await this.connection.query(`SELECT role FROM users WHERE id = ?`, [userID]);
            return userRole[0].role;
        }
        catch(err) {
            console.log(err);
            return "error";
        }
    }

    async getProducts(): Promise<{ message: string; }> {
        try{
            await this.connection.query(`SELECT * FROM products`, (err, results) => {
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
            await this.connection.query(`SELECT * FROM products WHERE id = ?`, [id], (err, results) => {
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

    async createProduct(productData: ProductDto): Promise<{ message: string; }> {
        try{
            const userRole = await this.getUserRole(productData.ownerID);
            if(userRole === "error") {
                return { message: "Error creating product" };
            }
            if(userRole === "seller" || userRole === "business") {
                await this.connection.query(`INSERT INTO products (name, description, price, stock, discountNumber, ownerID, created_at, updated_at) VALUES 
                (?, ?, ?, NOW(), NOW())`, [productData.name, productData.description, productData.price, productData.stock, productData.discountNumber, productData.ownerID], (err, results) => {
                    if(err) {
                        console.log(err);
                        return { message: "Error creating product" };
                    }
                    console.log(results);
                    return { message: "Product created successfully" };
                });
            }
            return { message: "You are not authorized to create a product" };
        }
        catch(err) {
            console.log(err);
            return { message: "Error creating product" };
        }
    }

    async updateProduct(productID: string, data: UpdateProductDto): Promise<{ message: string; }> {
        try{
            await this.connection.query(`SELECT * FROM products WHERE id = ?`, [productID], (err, results) => {
                if (err) {
                  console.log(err);
                  return { message: "Error retrieving product" };
                }
          
                if (results.length === 0) {
                  return { message: "Product not found" };
                }
          
                const product = results[0];
          
                if (product.ownerID !== data.ownerID) {
                  return { message: "You are not authorized to delete this product" };
                }

            this.connection.query(`UPDATE products SET name = ?, description = ?, price = ?, stock = ?, discountNumber = ?, updated_at = NOW() WHERE id = ?`, 
            [data.name, data.description, data.price, data.stock, data.discountNumber], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error updating product" };
                }
                console.log(results);
                return { message: "Product updated successfully" };
            });
        })
        }
        catch(err) {
            console.log(err);
            return { message: "Error updating product" };
        }
    }

    async deleteProduct(productID: string, ownerID: string): Promise<{ message: string; }> {
        try {
            await this.connection.query(`SELECT * FROM products WHERE id = ?`, [productID], (err, results) => {
            if (err) {
              console.log(err);
              return { message: "Error retrieving product" };
            }
      
            if (results.length === 0) {
              return { message: "Product not found" };
            }
      
            const product = results[0];
      
            if (product.ownerID !== ownerID) {
              return { message: "You are not authorized to delete this product" };
            }
      
            this.connection.query(`DELETE FROM products WHERE id = ?`, [productID], (err, results) => {
              if (err) {
                console.log(err);
                return { message: "Error deleting product" };
              }
              console.log(results);
              return { message: "Product deleted successfully" };
            });
          });
        } catch (err) {
          console.log(err);
          return { message: "Error deleting product" };
        }
    }
}
