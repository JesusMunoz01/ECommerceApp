import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/order.dto';

@UseGuards(AuthGuard("jwt"))
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}

    @Get()
    async getAllOrders(@Req() req):  Promise<{ message: string; }>{
        return this.ordersService.getOrders(req.user);
    }

    @Get("/user/:id")
    async getUserOrders(@Req() req, @Param("id") userID: string): Promise<{ message: string; }> {
        if(req.user !== userID) {
            return { message: "Unauthorized" };
        }
        return this.ordersService.getUserOrders(req.user);
    }

    @Get('/:id')
    async getOrder(@Req() req, @Param("orderId") orderID: number): Promise<{ message: string; }> {
        return this.ordersService.getOrder(req.user, orderID);
    }

    @Patch(':id/cancel')
    async cancelOrder(@Req() req, @Param("id") productID: string): Promise<{ message: string; }> {
        return this.ordersService.cancelOrder(req.user, productID);
    }
}
