import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import orderRouter from './order.routes';
import Order from './order.model';
import Restaurant from '../restaurant/restaurant.model';
import Product from '../product/product.model';
import Address from '../address/address.model';
import User from '../user/user.model';
import nodemon from '../../nodemon.json';

const app = express();
app.use(express.json());
app.use('/order', orderRouter);

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

afterEach(async () => {
  await Order.deleteMany();
  await User.deleteMany();
  await Restaurant.deleteMany();
  await Product.deleteMany();
});

describe('Order routes', () => {
  let user;
  let restaurant;
  let product1;
  let product2;

  beforeAll(async () => {
    const address1 = {
      street: 'Test Street',
      number: '42',
      complement: 'Apt 4B',
      neighborhood: 'Test Neighborhood',
      city: 'Test City',
      state: 'Test State',
      zipCode: '12345',
      lat: 40.7128,
      lng: -74.006,
    };

    user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      phone: '555-1234',
      address1,
    });
    await user.save();

    const address2 = {
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

    restaurant = new Restaurant({
      name: 'Test Restaurant',
      category: 'Test Category',
      description: 'Test Description',
      address2,
    });
    await restaurant.save();

    product1 = new Product({
      name: 'Test Product 1',
      description: 'Test Description 1',
      category: 'Test Category 1',
      price: 10,
      restaurant: restaurant._id,
    });
    await product1.save();

    product2 = new Product({
      name: 'Test Product 2',
      description: 'Test Description 2',
      category: 'Test Category 2',
      price: 20,
      restaurant: restaurant._id,
    });
    await product2.save();
  });

  // Test para POST /order
  it('should create a new order', async () => {
    const response = await request(app)
      .post('/order')
      .send({
        user: user._id,
        restaurant: restaurant._id,
        products: [product1._id, product2._id],
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.user).toEqual(user._id.toString());
    expect(response.body.restaurant).toEqual(restaurant._id.toString());
    expect(response.body.products).toEqual(
      expect.arrayContaining([product1._id.toString(), product2._id.toString()])
    );
  });

  // Test para GET /order/:id
  it('should get an order by id', async () => {
    const order = await Order.create({
      user: user._id,
      restaurant: restaurant._id,
      products: [product1._id, product2._id],
    });

    const response = await request(app).get(`/order/${order._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.user).toEqual(user._id.toString());
    expect(response.body.restaurant).toEqual(restaurant._id.toString());
    expect(response.body.products).toEqual(
      expect.arrayContaining([product1._id.toString(), product2._id.toString()])
    );
  });

  // Test para GET /order
  it('should get orders', async () => {
    const order1 = await Order.create({
      user: user._id,
      restaurant: restaurant._id,
      products: [product1._id, product2._id],
    });
    const order2 = await Order.create({
      user: user._id,
      restaurant: restaurant._id,
      products: [product1._id],
    });

    const response = await request(app).get('/order');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ _id: order1._id.toString() }),
        expect.objectContaining({ _id: order2._id.toString() }),
      ])
    );
  });

  // Test para GET /order/sent
  it('should get sent orders', async () => {
    const order1 = await Order.create({
      user: user._id,
      restaurant: restaurant._id,
      products: [product1._id, product2._id],
      status: 'sent',
    });
    const order2 = await Order.create({
      user: user._id,
      restaurant: restaurant._id,
      products: [product1._id],
      status: 'received',
    });

    const response = await request(app).get('/order/sent');

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ _id: order1._id.toString() })])
    );
  });

  // Test para PATCH /order/:id
  it('should update an order', async () => {
    const order = await Order.create({
      user: user._id,
      restaurant: restaurant._id,
      products: [product1._id, product2._id],
    });

    const response = await request(app).patch(`/order/${order._id}`).send({ status: 'received' });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.status).toEqual('received');
  });

  // Test para DELETE /order/:id
  it('should delete an order', async () => {
    const order = await Order.create({
      user: user._id,
      restaurant: restaurant.__id,
      products: [product1._id, product2._id],
    });

    const response = await request(app).delete(`/order/${order._id}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: 'Order disabled' });

    const deletedOrder = await Order.findById(order._id);
    expect(deletedOrder.active).toBe(false);
  });
});
