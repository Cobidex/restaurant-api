import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import ApiFeatures from '../utils/apiFeatures.utils';
import { CreateRestaurantDto } from './dto/createRestaurantDto';
import { User } from '../auth/schemas/user.schema';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private restaurantModel: mongoose.Model<Restaurant>,
  ) {}

  async findAll(query: Query): Promise<Restaurant[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    const restaurants = await this.restaurantModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    return restaurants;
  }

  async create(
    restaurant: CreateRestaurantDto,
    user: User,
  ): Promise<Restaurant> {
    const location = await ApiFeatures.getRestaurantLocation(
      restaurant.address,
    );
    const data = Object.assign(restaurant, { user: user._id, location });
    const res = await this.restaurantModel.create(data);
    return res;
  }

  async findById(id: string): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
      throw new BadRequestException(
        'Wrong mongoose id error please enter correct id',
      );
    const restaurant = await this.restaurantModel.findById(id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async updateById(id: string, restauarant: Restaurant): Promise<Restaurant> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
      throw new BadRequestException(
        'Wrong mongoose id error please enter correct id',
      );
    const res = await this.restaurantModel.findByIdAndUpdate(id, restauarant, {
      new: true,
      runValidators: true,
    });

    if (!res) throw new NotFoundException('Restaurant not found');
    return res;
  }

  async deleteById(id: string): Promise<{ deleted: boolean }> {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId)
      throw new BadRequestException(
        'Wrong mongoose id error please enter correct id',
      );
    const res = await this.restaurantModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Restaurant not found');
    return { deleted: true };
  }

  async uploadImages(id: string, files: Express.Multer.File[]) {
    const images = await ApiFeatures.upload(files);
    const restaurant = await this.restaurantModel.findByIdAndUpdate(
      id,
      {
        images: images as object[],
      },
      {
        new: true,
        runValidators: true,
      },
    );
    return restaurant;
  }

  async deleteImages(images) {
    if (images.length === 0) return true;
    const res = await ApiFeatures.deleteImages(images);
    return res;
  }
}
