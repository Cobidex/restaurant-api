import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Meal } from './schemas/meal.schema';
import Mongoose from 'mongoose';
import { Restaurant } from '../restaurants/schemas/restaurant.schema';
import { User } from '../auth/schemas/user.schema';
import mongoose from 'mongoose';

@Injectable()
export class MealService {
  constructor(
    @InjectModel(Meal.name)
    private mealModel: Mongoose.Model<Meal>,
    @InjectModel(Restaurant.name)
    private restaurantModel: Mongoose.Model<Restaurant>,
  ) {}

  async findAll(): Promise<Meal[]> {
    const meals = await this.mealModel.find();
    return meals;
  }

  async findByRestaurant(id: string): Promise<Meal[]> {
    const meals = await this.mealModel.find({ restaurant: id });
    return meals;
  }

  async findById(id: string): Promise<Meal> {
    const isValid = mongoose.isValidObjectId(id);

    if (!isValid) throw new BadRequestException('Wrong mongoose ID error');
    const meal = await this.mealModel.findById(id);
    if (!meal) throw new NotFoundException('Meal not found');
    return meal;
  }

  async create(meal: Meal, user: User): Promise<Meal> {
    const data = Object.assign(meal, { user: user._id });

    const restaurant = await this.restaurantModel.findById(meal.restaurant);

    if (!restaurant)
      throw new NotFoundException('Restaurant not found with this ID.');

    if (user.id !== restaurant.user.toString())
      throw new ForbiddenException('You cannot add meal to this restaurant');
    const mealCreated = await this.mealModel.create(data);

    restaurant.menu.push(mealCreated.id);

    await restaurant.save();

    return meal;
  }

  async updateById(id: string, meal: Meal, user: User): Promise<Meal> {
    const isValid = mongoose.isValidObjectId(id);

    if (!isValid) throw new BadRequestException('Invalid mongoose ID error');

    const res = await this.mealModel.findById(id);

    if (!res) throw new NotFoundException('Meal not found');
    if (res.user.toString() !== user.id)
      throw new ForbiddenException('You cannot update this meal');

    const edited = await this.mealModel.findByIdAndUpdate(id, meal, {
      new: true,
      runValidators: true,
    });

    return edited;
  }

  async deleteById(id: string, user: User): Promise<{ deleted: boolean }> {
    const isValid = mongoose.isValidObjectId(id);

    if (!isValid) throw new BadRequestException('Invalid mongoose ID error');

    const res = await this.mealModel.findById(id);

    if (!res) throw new NotFoundException('Meal not found');

    if (res.user.toString() !== user.id)
      throw new ForbiddenException('You cannot delete this meal');

    const restaurant = await this.restaurantModel.findById(res.restaurant);

    restaurant.menu = restaurant.menu.filter((el) => el.toString() !== res.id);

    await restaurant.save();

    const isDeleted = await this.mealModel.findByIdAndDelete(id);

    if (!isDeleted) return { deleted: false };

    return { deleted: true };
  }
}
