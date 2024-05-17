import { Injectable } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AppService } from 'src/app.service';

@Injectable()
export class BrandsService {
  constructor(private appService: AppService) {}
  private connection = this.appService.connection;

  async create(createBrandDto: CreateBrandDto) {
    try {
      await this.connection.query('INSERT INTO brands (name, description, image, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())', 
      [createBrandDto.name, createBrandDto.description, createBrandDto.image]);
      return { message: 'Brand page created successfully', data: createBrandDto}
    } catch (error) {
      console.log(error)
      return { message: 'Error creating brand page', data: error}
    }
  }

  async findAll() {
    try {
      const result = await new Promise((resolve, reject) => {
        this.connection.query('SELECT * FROM brands', (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          resolve(results);
        });
      });
      
      return { message: 'Brand page found successfully', data: result };
    } catch (error) {
      console.log(error);
      return { message: 'Error finding brand page', data: error };
    }
  }
  

  async findOne(id: number) {
    try {
      const result = await new Promise((resolve, reject) => {
        this.connection.query('SELECT * FROM brands WHERE id = ?', [id], (err, results) => {
          if (err) {
            console.log(err);
            reject(err);
            return;
          }
          resolve(results);
        });
      });
      
      return { message: 'Brand page found successfully', data: result };
    } catch (error) {
      console.log(error);
      return { message: 'Error finding brand page', data: error };
    }
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
