import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantsService } from './restaurants.service';
import { getModelToken } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurant.schema';
import { Model } from 'mongoose';

describe('Test restaurant service', () => {
  const mockRestaurantService = {
    find: jest.fn(),
  };
  let service: RestaurantsService;
  let model: Model<Restaurant>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantService,
        },
      ],
    }).compile();

    service = module.get<RestaurantsService>(RestaurantsService);
    model = module.get<Model<Restaurant>>(getModelToken(Restaurant.name));
  });

  it('Should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('findAll', () => {
    const mockRestaurant = {
      name: 'Schaden, Leannon and Feeney',
      description: 'Ergonomic cohesive local area network',
      email: 'Chandler52@gmail.com',
      phoneNo: '857-648-8687',
      address: '2133 Homenick Isle',
      category: 'Fast Food',
      images: [],
      location: {
        type: 'Point',
        coordinates: [-77.03196, 38.89037],
        formattedAddress: ', , , US',
        city: '',
        state: '',
        country: 'US',
        zipcode: '',
      },
      user: '663f5e27657084389abdc7c9',
      menu: [],
      _id: '6640952df38864ce9df1ef5d',
      __v: 0,
    };
    it('returns an array of restaurants', async () => {
      jest.spyOn(model, 'find').mockImplementationOnce(
        () =>
          ({
            limit: () => ({
              skip: jest.fn().mockResolvedValue([mockRestaurant]),
            }),
          }) as any,
      );
      const restaurant = await service.findAll({ keyword: 'restaurant' });
      expect(restaurant).toEqual([mockRestaurant]);
    });
  });
});
