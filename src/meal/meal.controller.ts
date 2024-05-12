import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { CreateMealDto } from './dto/createMeal.dto';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { Meal } from './schemas/meal.schema';
import { User } from '../auth/schemas/user.schema';
import { UpdateMealDto } from './dto/update-meal.dto';

@Controller('meals')
export class MealController {
  constructor(private mealService: MealService) {}

  @Get()
  async getAllMeals(): Promise<Meal[]> {
    return this.mealService.findAll();
  }

  @Get('restaurants/:id')
  async getMealsByRestaurant(@Param('id') id: string): Promise<Meal[]> {
    return this.mealService.findByRestaurant(id);
  }

  @Get(':id')
  async getMeal(@Param('id') id: string): Promise<Meal> {
    return this.mealService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard())
  async createMeal(
    @Body() createMealDto: CreateMealDto,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    return this.mealService.create(createMealDto, user);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async updateMeal(
    @Body() updateMealDto: UpdateMealDto,
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Meal> {
    return this.mealService.updateById(id, updateMealDto, user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async deleteMeal(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: boolean }> {
    return this.mealService.deleteById(id, user);
  }
}
