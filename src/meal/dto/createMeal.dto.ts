import {
  IsEmpty,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/meal.schema';
import { User } from 'src/auth/schemas/user.schema';

export class CreateMealDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Please enter correct category for this meal' })
  readonly category: Category;

  @IsNotEmpty()
  @IsString()
  readonly restaurant: string;

  @IsEmpty({ message: 'You cannot provide a user Id' })
  readonly user: User;
}
