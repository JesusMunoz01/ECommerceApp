import { Injectable } from '@nestjs/common';
import * as mysql from 'mysql';
@Injectable()
export class AppService {
  public connection;

  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'ecommerceapp'
    });

    this.connection.connect(err => {
      if (err) {
        console.error('Error connecting: ' + err.stack);
        return;
      }

      console.log('Connected as id ' + this.connection.threadId);
    });
  }

  getHello(): {data: string} {
    return {data: 'Hello World!'};
  }
  
}
