import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';

@UseGuards(AuthGuard("jwt"))
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
}
