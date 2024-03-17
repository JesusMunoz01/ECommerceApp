import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto } from './dto/product.dto';

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

    @Post("/create")
    async createProduct(@Param("id") userID: string, @Body() createProduct: ProductDto): Promise<{ message: string; }> {
      return this.productsService.createProduct(userID, createProduct);
    }
}
