import { Controller, Get } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {};

    @Get()
    async getUser(): Promise<{ message: string; }> {
      return this.productsService.getProducts();
    }
}
