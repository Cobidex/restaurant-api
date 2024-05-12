import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/createRestaurantDto';
import { UpdateRestaurantDto } from './dto/updateRestaurant.dto';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('restaurants')
export class RestaurantsController {
  constructor(private restaurantsService: RestaurantsService) {}

  @Get()
  async getAllRestaurants(@Query() query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantsService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('user')
  async createRestaurant(
    @Body() restaurant: CreateRestaurantDto,
    @CurrentUser() user: User,
  ): Promise<Restaurant> {
    return this.restaurantsService.create(restaurant, user);
  }

  @Get(':id')
  async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantsService.findById(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateRestaurant(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDto,
    @CurrentUser() user: User,
  ) {
    const res = await this.restaurantsService.findById(id);
    if (res.user.toString() !== user.id)
      throw new ForbiddenException('You cannot update this restaurant');
    return this.restaurantsService.updateById(id, restaurant);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteRestaurant(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: boolean }> {
    const res = await this.restaurantsService.findById(id);
    if (res.user.toString() !== user.id)
      throw new ForbiddenException('You cannot update this restaurant');
    const found = await this.restaurantsService.findById(id);
    const isDeleted = await this.restaurantsService.deleteImages(found.images);
    if (isDeleted) {
      this.restaurantsService.deleteById(id);
      return { deleted: true };
    } else {
      return { deleted: false };
    }
  }

  @Put('upload/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.restaurantsService.findById(id);

    const res = await this.restaurantsService.uploadImages(id, files);
    return res;
  }
}
