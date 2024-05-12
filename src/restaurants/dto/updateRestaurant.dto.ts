import {
  IsEmail,
  IsEmpty,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/restaurant.schema';
import { User } from '../../auth/schemas/user.schema';

export class UpdateRestaurantDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsEmail({}, { message: 'Please enter correct email address' })
  readonly email: string;

  @IsOptional()
  @IsPhoneNumber('US')
  readonly phoneNo: string;

  @IsOptional()
  @IsString()
  readonly address: string;

  @IsOptional()
  @IsEnum(Category, { message: 'Please enter correct category' })
  readonly category: Category;

  @IsEmpty({ message: 'You cannot provide the user Id' })
  readonly user: User;
}
