import { Injectable } from '@nestjs/common';
import { AppService } from 'src/app.service';

@Injectable()
export class UsersService {
    constructor(private appService: AppService) {}

    createUser(): { message: string }{
        return { message: 'User created' }
    }
}
