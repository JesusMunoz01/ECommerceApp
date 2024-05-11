import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { StripeService } from './payment/payment.service';
import { PaymentModule } from './payment/payment.module';
import { BrandsModule } from './brands/brands.module';

@Module({
  imports: [AuthModule, UsersModule, ProductsModule, OrdersModule, PaymentModule, BrandsModule],
  controllers: [AppController],
  providers: [AppService, StripeService],
})
export class AppModule {}
