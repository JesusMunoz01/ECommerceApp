import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { PaymentService } from './payment/payment.service';
import { PaymentModule } from './payment/payment.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule, OrdersModule, PaymentModule],
  controllers: [AppController],
  providers: [AppService, PaymentService],
})
export class AppModule {}
