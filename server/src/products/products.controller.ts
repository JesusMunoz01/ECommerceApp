import { Controller, Get, Param } from '@nestjs/common';
import { ProductsService } from './products.service';

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
}
