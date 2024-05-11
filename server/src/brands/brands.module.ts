import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { AppService } from 'src/app.service';

@Module({
  controllers: [BrandsController, AppService],
  providers: [BrandsService],
})
export class BrandsModule {}
