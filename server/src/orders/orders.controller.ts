import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';

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
}
