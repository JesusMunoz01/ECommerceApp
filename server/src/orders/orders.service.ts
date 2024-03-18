import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class OrdersService {
    constructor(private appService: AppService) {}
    private connection = this.appService.connection;
}
