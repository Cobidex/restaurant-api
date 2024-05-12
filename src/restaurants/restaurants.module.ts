import { Module } from '@nestjs/common';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RestaurantSchema } from './schemas/restaurant.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Restaurant', schema: RestaurantSchema },
    ]),
    AuthModule,
  ],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [MongooseModule],
})
export class RestaurantsModule {}
