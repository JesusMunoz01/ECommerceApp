import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { AppService } from 'src/app.service';

@Module({
  providers: [OrdersService, AppService],
  controllers: [OrdersController]
})
export class OrdersModule {}
