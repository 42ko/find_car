import { Controller, Post, Body } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService){}
  @Post()
  getCars(@Body() body: any) {
    return this.carsService.findNearbyCars(body.coords)
  }
}
