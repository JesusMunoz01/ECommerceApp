import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post()
  create(@Body() createBrandDto: CreateBrandDto) {
    return this.brandsService.create(createBrandDto);
  }

  @Get()
  async findAll() {
    return this.brandsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.brandsService.findOne(+id);
  }

  @Get('/:bid/products/:uid')
  findBrandProducts(@Param('bid') bid: string, @Param('uid') uid: string) {
    return this.brandsService.findUserBrandProducts(+bid, uid);
  }

  @UseGuards(AuthGuard("jwt"))
  @Get('user/:id')
  findBrandOwner(@Param('id') id: string) {
    return this.brandsService.findByOwner(id);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(+id, updateBrandDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Patch('/:bid/products/:uid')
  addProducts(@Param('bid') bid: string, @Param('uid') uid: string, @Body() products: number[]) {
    return this.brandsService.addProducts(+bid, uid, products);
  }

  @UseGuards(AuthGuard("jwt"))
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandsService.remove(+id);
  }
}
