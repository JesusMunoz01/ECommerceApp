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
      const result = await this.connection.query('INSERT INTO brands SET ?', createBrandDto);
      console.log(result)
      return { message: 'Brand page created successfully', data: result}
    } catch (error) {
      return { message: 'Error creating brand page', data: error}
    }
  }

  async findAll() {
    try {
      const result = await this.connection.query('SELECT * FROM brands');
      console.log(result)
      return { message: 'Brand page created successfully', data: result}
    } catch (error) {
      return { message: 'Error creating brand page', data: error}
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} brand`;
  }

  update(id: number, updateBrandDto: UpdateBrandDto) {
    return `This action updates a #${id} brand`;
  }

  remove(id: number) {
    return `This action removes a #${id} brand`;
  }
}
