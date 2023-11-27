import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import productRouter from './product.routes';
import Product from './product.model';
import Restaurant from '../restaurant/restaurant.model';
import nodemon from '../../nodemon.json';

const app = express();
app.use(express.json());
app.use('/product', productRouter);

beforeAll(async () => {
  await mongoose.connect(`mongodb+srv:`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'test',
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Products API', () => {
  let testRestaurant;

  beforeAll(async () => {
    testRestaurant = new Restaurant({
      name: 'Test Restaurant 2',
      category: 'Test Category 2',
      description: 'Test Description 2',
    });
    await testRestaurant.save();
  });

  afterEach(async () => {
    await Restaurant.deleteMany();
    await Product.deleteMany();
  });

  // Test POST /product
  test('Create a new product', async () => {
    const response = await request(app).post('/product').send({
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: 10,
      restaurant: testRestaurant._id,
    });

    expect(response.status).toBe(201);
    expect(response.body.name).toBe('Test Product');
  });

  // Test GET /product/:id
  test('Get product by ID', async () => {
    const product = new Product({
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: 10,
      restaurant: testRestaurant._id,
    });
    await product.save();

    const response = await request(app).get(`/product/${product._id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Test Product');
  });

  // Test GET /product
  test('Get all products', async () => {
    const product = new Product({
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: 10,
      restaurant: testRestaurant._id,
    });
    await product.save();

    const response = await request(app).get('/product');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
  });

  // Test PATCH /product/:id
  test('Update a product', async () => {
    const product = new Product({
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: 10,
      restaurant: testRestaurant._id,
    });
    await product.save();

    const response = await request(app).patch(`/product/${product._id}`).send({
      name: 'Updated Product',
    });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Product');
  });

  // Test DELETE /product/:id
  test('Delete a product', async () => {
    const product = new Product({
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      price: 10,
      restaurant: testRestaurant._id,
    });
    await product.save();

    const response = await request(app).delete(`/product/${product._id}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product disabled');
  });
});
