import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';

@UseGuards(AuthGuard("jwt"))
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    async getOrders(@Req() req):  Promise<{ message: string; }>{
        return this.ordersService.getOrders(req.user);
    }

    @Get(":id")
    async getOrder(@Req() req): Promise<{ message: string; }> {
        return this.ordersService.getOrder(req.user);
    }

    @Post('/create')
    async createOrder(@Req() req, @Body() orderData: OrderDto): Promise<{ message: string; }> {
        return this.ordersService.createOrder(req.user, orderData);
    }
}
