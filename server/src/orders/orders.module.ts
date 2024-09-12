import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { AppService } from 'src/app.service';
import { OrdersService } from './orders.service';

@Module({
  providers: [AppService, OrdersService],
  controllers: [OrdersController],
  exports: [OrdersService]
})
export class OrdersModule {}
