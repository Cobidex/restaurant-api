import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import Mongoose from 'mongoose';
import { User } from '../../auth/schemas/user.schema';

export enum Category {
  SOUPS = 'Soups',
  SALADS = 'Salads',
  SANDWITCHES = 'Sandwitches',
  PASTA = 'Pasta',
}

@Schema({
  timestamps: true,
})
export class Meal {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  price: number;

  @Prop()
  category: Category;

  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'Restaurant' })
  restaurant: string;

  @Prop({ type: Mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const MealSchema = SchemaFactory.createForClass(Meal);
