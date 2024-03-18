import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';
import { UpdateProductDto } from './dto/updateProduct.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {};

    @Get()
    async getProducts(): Promise<{ message: string; }> {
      return this.productsService.getProducts();
    }

    @Get(":id")
    async getProduct(@Param("id") id: string): Promise<{ message: string; }> {
      return this.productsService.getProduct(id);
    }

    @Get(":id/reviews")
    async getProductReviews(@Param("id") id: string): Promise<{ message: string; }> {
      return this.productsService.getProductReviews(id);
    }

    @Post("/create")
    async createProduct(@Body() createProduct: ProductDto): Promise<{ message: string; }> {
      return this.productsService.createProduct(createProduct);
    }

    @Patch(":id")
    async updateProduct(@Param("id") itemID: string, @Body() updateProduct: UpdateProductDto): Promise<{ message: string; }> {
      return this.productsService.updateProduct(itemID, updateProduct);
    }

    @Delete(":id/:ownerID")
    async deleteProduct(@Param("id") itemID: string, @Param("ownerID") ownerID: string): Promise<{ message: string; }> {
      return this.productsService.deleteProduct(itemID, ownerID);
    }
}
