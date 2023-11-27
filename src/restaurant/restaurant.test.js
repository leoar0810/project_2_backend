import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import restaurantRouter from './restaurant.routes';
import Restaurant from './restaurant.model';
import Address from '../address/address.model';
import nodemon from '../../nodemon.json';

const app = express();
app.use(express.json());
app.use('/restaurant', restaurantRouter);

beforeAll(async () => {
  await mongoose.connect(`mongodb+srv:`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'test',
  });
});

beforeEach(async () => {
  await Restaurant.deleteMany();
  await Address.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Restaurant Endpoints', () => {
  test('POST /restaurant - should create a new restaurant', async () => {
    const address = {
      street: 'Test 2 Street',
      number: '42',
      complement: 'Apt 4B',
      neighborhood: 'Test Neighborhood',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      lat: 40.7128,
      lng: -74.006,
    };
    const restaurant = {
      name: 'Test Restaurant',
      category: 'Test Category',
      description: 'Test Description',
      address,
    };
    const res = await request(app).post('/restaurant').send(restaurant);
    expect(res.status).toBe(201);
    expect(res.body.name).toBe(restaurant.name);
    expect(res.body.category).toBe(restaurant.category);
  });

  test('GET /restaurant/:id - should return a restaurant by id', async () => {
    const restaurant = new Restaurant({
      name: 'Test Restaurant 2',
      category: 'Test Category 2',
      description: 'Test Description 2',
    });
    await restaurant.save();

    const res = await request(app).get(`/restaurant/${restaurant._id}`);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(restaurant.name);
    expect(res.body.category).toBe(restaurant.category);
  });

  test('GET /restaurant - should return a list of restaurants', async () => {
    const restaurant1 = new Restaurant({
      name: 'Test Restaurant 1',
      category: 'Test Category 1',
      description: 'Test Description 1',
    });

    const restaurant2 = new Restaurant({
      name: 'Test Restaurant 2',
      category: 'Test Category 2',
      description: 'Test Description 2',
    });

    await restaurant1.save();
    await restaurant2.save();

    const res = await request(app).get('/restaurant');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  test('PATCH /restaurant/:id - should update a restaurant by id', async () => {
    const restaurant = new Restaurant({
      name: 'Test Restaurant 3',
      category: 'Test Category 3',
      description: 'Test Description 3',
    });
    await restaurant.save();

    const updatedData = {
      name: 'Updated Test Restaurant 3',
      category: 'Updated Test Category 3',
      description: 'Updated Test Description 3',
    };

    const res = await request(app).patch(`/restaurant/${restaurant._id}`).send(updatedData);
    expect(res.status).toBe(200);
    expect(res.body.name).toBe(updatedData.name);
    expect(res.body.category).toBe(updatedData.category);
  });

  test('DELETE /restaurant/:id - should delete a restaurant by id', async () => {
    const restaurant = new Restaurant({
      name: 'Test Restaurant 4',
      category: 'Test Category 4',
      description: 'Test Description 4',
    });
    await restaurant.save();

    const res = await request(app).delete(`/restaurant/${restaurant._id}`);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Restaurant disabled');
  });
});
