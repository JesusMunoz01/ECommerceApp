import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @UseGuards(AuthGuard("jwt"))
  @Post()
  create(@Body() createBrandDto: CreateBrandDto, @Request() req) {
    const userId = req.user.id;
    return this.brandsService.create(createBrandDto, userId);
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
  @Patch(':id/:uid')
  update(@Param('id') id: string, @Param('uid') uid: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandsService.update(+id, updateBrandDto, uid);
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

  @UseGuards(AuthGuard("jwt"))
  @Delete('products/:uid')
  removeProducts(@Param('uid') uid: string, @Body() products: number[]) {
    return this.brandsService.removeProducts(uid, products);
  }
}
