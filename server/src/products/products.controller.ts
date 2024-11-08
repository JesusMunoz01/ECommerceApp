import { Body, Controller, Delete, Get, Param, Patch, Post, Request, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';
import { ReviewDto } from './dto/review.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {};

    @Get()
    async getProducts(): Promise<{ message: string, products?: ProductDto }> {
      const products = await this.productsService.getProducts();
      return products
    }

    @Get(":id")
    async getProduct(@Param("id") id: string): Promise<{ message: string; }> {
      return this.productsService.getProduct(id);
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("user/:id")
    async getUserProducts(@Param("id") userID: string): Promise<{ message: string; }> {
      return this.productsService.getUserProducts(userID);
    }

    @Get(":id/reviews")
    async getProductReviews(@Param("id") itemID: string): Promise<{ message: string; }> {
      return this.productsService.getProductReviews(itemID);
    }

    @UseGuards(AuthGuard("jwt"))
    @Post("/create")
    async createProduct(@Body() createProduct: ProductDto): Promise<{ message: string; }> {
      return this.productsService.createProduct(createProduct);
    }

    @UseGuards(AuthGuard("jwt"))
    @Post(":id/reviews")
    async createReview(@Param("id") itemID: string, @Body() reviewData: ReviewDto, @Request() req) : Promise<{ message: string; }> {
      const userId = req.user.sub
      return this.productsService.createReview(userId, itemID, reviewData);
    }

    @UseGuards(AuthGuard("jwt"))
    @Patch(":id")
    async updateProduct(@Param("id") itemID: string, @Body() updateProduct: UpdateProductDto): Promise<{ message: string; }> {
      return this.productsService.updateProduct(itemID, updateProduct);
    }

    @UseGuards(AuthGuard("jwt"))
    @Delete(":id/:ownerID")
    async deleteProduct(@Param("id") itemID: string, @Param("ownerID") ownerID: string): Promise<{ message: string; }> {
      return this.productsService.deleteProduct(itemID, ownerID);
    }
}
