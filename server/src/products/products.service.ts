import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ReviewDto } from './dto/review.dto';

@Injectable()
export class ProductsService {
    constructor(private appService: AppService) {}
    private connection = this.appService.connection;

    private async getUserRole(userID: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.connection.query(`SELECT sname FROM users WHERE id = ?`, [userID], (err, results) => {
                if(err) {
                    console.log(err);
                    reject("error");
                }
                resolve(results[0].sname);
            });
        }).catch(err => {
            console.log(err);
            return "error";
        });
    }

    async getProducts(): Promise<{ message: string, products?: ProductDto }> {
        try{
            const products = await new Promise<ProductDto>((resolve, reject) => {
                this.connection.query(`SELECT * FROM products`, (err, results) => {
                    if (err) {
                        console.log(err);
                        reject({ message: "Error getting products" });
                    } else {
                        resolve(results);
                    }
                });
            });
            return { message: "Products retrieved successfully", products: products};
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

    async getUserProducts(userID: string): Promise<{ message: string; products?: any; }> {
        return new Promise<{ message: string; products?: any; }>((resolve, reject) => {
            this.connection.query(`SELECT * FROM products WHERE ownerId = ?`, [userID], (err, results) => {
                if(err) {
                    console.log(err);
                    reject({ message: "Error getting user products" });
                }
                resolve({ message: "User products retrieved successfully", products: results });
            });
        }).catch(err => {
            console.log(err);
            return { message: "Error getting user products" };
        });
    }

    async createProduct(productData: ProductDto): Promise<{ message: string; }> {
        try{
            const userId = productData.ownerID.split('|')[1];
            const userRole = await this.getUserRole(userId);
            console.log(userRole)
            if(userRole === "error") {
                return { message: "Error creating product" };
            }
            if(userRole === "Free" || userRole === "Premium" || userRole === "Enterprise") {
                await this.connection.query(`INSERT INTO products (name, description, price, stock, discountNum, ownerId, created_at, updated_at) VALUES 
                (?, ?, ?, ?, ?, ?, NOW(), NOW())`, [productData.name, productData.description, productData.price, productData.stock, productData.discountNumber, userId], (err, results) => {
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

                if (product.ownerId !== data.ownerID) {
                  return { message: "You are not authorized to delete this product" };
                }
            
            return new Promise<{ message: string; products?: any; }>((resolve, reject) => {
                this.connection.query(`UPDATE products SET name = ?, description = ?, price = ?, stock = ?, discountNum = ?, updated_at = NOW() WHERE id = ?`, 
                [data.name, data.description, data.price, data.stock, data.discountNumber, productID], (err, results) => {
                    if(err) {
                        console.log(err);
                        reject({ message: "Error updating product" });
                    }
                    console.log(results);
                    resolve({ message: "Product updated successfully", products: results });
                });
            }
            ).catch(err => {
                console.log(err);
                return { message: "Error updating product" };
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

    async getProductReviews(id: string): Promise<{ message: string; }> {
        try{
            await this.connection.query(`SELECT * FROM reviews WHERE productID = ?`, [id], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error getting product reviews" };
                }
                console.log(results);
                return { message: "Product reviews retrieved successfully" };
            });
        }
        catch(err) {
            console.log(err);
            return { message: "Error getting product reviews" };
        }
    }

    async createReview(itemID: string, reviewData: ReviewDto): Promise<{ message: string; }> {
        try{
            await this.connection.query(`INSERT INTO reviews (productID, userID, review, rating, created_at, updated_at) VALUES 
            (?, ?, ?, ?, NOW(), NOW())`, [itemID, reviewData.userID, reviewData.review, reviewData.rating], (err, results) => {
                if(err) {
                    console.log(err);
                    return { message: "Error creating review" };
                }
                console.log(results);
                return { message: "Review created successfully" };
            });
        }
        catch(err) {
            console.log(err);
            return { message: "Error creating review" };
        }
    }
}
