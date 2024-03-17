import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { AppService } from 'src/app.service';

@Module({
  providers: [ProductsService, AppService],
  controllers: [ProductsController]
})
export class ProductsModule {}
