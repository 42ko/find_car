import { Controller, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  getCars(@Body('coords') coords: any, @Body('radius') radius?: number) {
    return this.carsService.findNearbyCars(coords, radius);
  }
}
