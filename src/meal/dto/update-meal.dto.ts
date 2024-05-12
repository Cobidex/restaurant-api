import {
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/meal.schema';
import { User } from '../../auth/schemas/user.schema';

export class UpdateMealDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsNumber()
  readonly price: number;

  @IsOptional()
  @IsEnum(Category, { message: 'Please enter correct category for this meal' })
  readonly category: Category;

  @IsOptional()
  @IsString()
  readonly restaurant: string;

  @IsEmpty({ message: 'You cannot provide a user Id' })
  readonly user: User;
}
