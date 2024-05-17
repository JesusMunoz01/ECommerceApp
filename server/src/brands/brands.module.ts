import { Module } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { BrandsController } from './brands.controller';
import { AppService } from 'src/app.service';

@Module({
  providers: [BrandsService, AppService],
  controllers: [BrandsController],
})
export class BrandsModule {}
