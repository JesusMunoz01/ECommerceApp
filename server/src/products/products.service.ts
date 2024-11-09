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
                // console.log(results);
                return { message: "Product retrieved successfully" };
            });
        }
        catch(err) {
            console.log(err);
            return { message: "Error getting product" };
        }
    }

    async getUserProducts(userID: string): Promise<{ message: string; products?: ProductDto; }> {
        return new Promise<{ message: string; products?: ProductDto & {brandId: number}; }>((resolve, reject) => {
            this.connection.query(`
                SELECT p.*, pb.brandId
                FROM products p
                LEFT JOIN productbrand pb ON p.id = pb.productId
                WHERE p.ownerId = ?`, [userID], (err, results) => {
                    // console.log(results);
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
            return new Promise<{ message: string; product?: UpdateProductDto; }>(async (resolve, reject) => {
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
    
                this.connection.query(`UPDATE products SET name = ?, description = ?, price = ?, stock = ?, discountNum = ?, updated_at = NOW() WHERE id = ?`, 
                [data.name, data.description, data.price, data.stock, data.discountNumber, productID], (err, results) => {
                    if(err) {
                        console.log(err);
                        reject({ message: "Error updating product" });
                    }
                    console.log(results);
                    resolve({ message: "Product updated successfully", product: {name: data.name, description: data.description, 
                        price: data.price, stock: data.stock, discountNumber: data.discountNumber}});
                });
            }
            )
        })
        .catch(err => {
            console.log(err);
            return { message: "Error updating product" };
        });
        }
        catch(err) {
            console.log(err);
            return { message: "Error updating product" };
        }
    }

    async deleteProduct(productID: string, ownerID: string): Promise<{ message: string; }> {
        try {
            return new Promise<{ message: string; }>(async (resolve, reject) => {
                await this.connection.query(`SELECT * FROM products WHERE id = ?`, [productID], (err, results) => {
                    if (err) {
                        console.log(err);
                        reject({ message: "Error retrieving product" });
                    }
            
                    if (results.length === 0) {
                        reject({ message: "Product not found" });
                    }
            
                    const product = results[0];
                    if (product.ownerId !== ownerID.split('|')[1]) {
                        reject({ message: "You are not authorized to delete this product" });
                    }
            
                    this.connection.query(`DELETE FROM products WHERE id = ?`, [productID], (err, results) => {
                    if (err) {
                        console.log(err);
                        reject({ message: "Error deleting product" });
                    }
                        resolve({ message: "Product deleted successfully" });
                    });
                });
            })
        } catch (err) {
          console.log(err);
          return { message: "Error deleting product" };
        }
    }

    async getProductReviews(id: string): Promise<{ message: string, reviews?: ReviewDto }> {
        try{
            const [reviews] = await this.connection.query(`SELECT * FROM reviews WHERE productID = ?`, [id]);

            return {message: "Product reviews retrieved successfully", reviews: reviews,}
        }
        catch(err) {
            console.log(err);
            return { message: "Error getting product reviews" };
        }
    }

    async createReview(userId: string, itemID: string, reviewData: ReviewDto): Promise<{ message: string; }> {
        try{
            // Search to see if there is already a review
            const [existingReview] = await this.connection.query(
                `SELECT * FROM reviews WHERE productID = ? AND userID = ?`,
                [itemID, userId.split("|")[1]]
            );
    
            if (existingReview) {
                return { message: "User has already reviewed this item" };
            }

            // Insert Review
            await this.connection.query(`INSERT INTO reviews (productID, userID, review, rating, created_at, updated_at) VALUES 
            (?, ?, ?, ?, NOW(), NOW())`, [itemID, userId.split("|")[1], reviewData.review, reviewData.rating], (err, results) => {
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
