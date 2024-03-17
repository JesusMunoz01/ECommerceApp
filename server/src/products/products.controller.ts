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

    @Post("/create")
    async createProduct(@Param("id") userID: string, @Body() createProduct: ProductDto): Promise<{ message: string; }> {
      return this.productsService.createProduct(userID, createProduct);
    }

    @Patch(":id")
    async updateProduct(@Param("id") id: string, @Body() updateProduct: UpdateProductDto): Promise<{ message: string; }> {
      return this.productsService.updateProduct(id, updateProduct);
    }

    @Delete(":id")
    async deleteProduct(@Param("id") id: string): Promise<{ message: string; }> {
      return this.productsService.deleteProduct(id);
    }
}
