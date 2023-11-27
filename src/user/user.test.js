import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import userRouter from './user.routes';
import User from './user.model';
import Address from '../address/address.model';
import nodemon from '../../nodemon.json';

const app = express();
app.use(express.json());
app.use('/user', userRouter);

beforeAll(async () => {
  await mongoose.connect(`mongodb+srv:`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'test',
  });
});

beforeEach(async () => {
  await User.deleteMany();
  await Address.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Endpoints', () => {
  // Test POST /user
  it('should create a new user with an address', async () => {
    const address = {
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

    const res = await request(app).post('/user').send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      phone: '555-1234',
      address,
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toEqual('Test User');
    expect(res.body.email).toEqual('test@example.com');
    expect(res.body.phone).toEqual('555-1234');

    const addressRecieve = await Address.findById(res.body.addresses[0]);
    expect(addressRecieve).toMatchObject(address);
  });

  // Test POST /user/credentials
  it('should retrieve user by credentials', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      phone: '555-1234',
    });
    await user.save();
    const res = await request(app)
      .post('/user/credentials')
      .send({ email: 'test@example.com', password: 'password' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.email).toEqual('test@example.com');
  });

  // Test GET /user/:id
  it('should retrieve user by id', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      phone: '555-1234',
    });
    await user.save();
    const res = await request(app).get(`/user/${user._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.email).toEqual('test@example.com');
  });

  // Test PATCH /user/:id
  it('should update user by id', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      phone: '555-1234',
    });
    await user.save();
    const res = await request(app).patch(`/user/${user._id}`).send({ name: 'Updated Test User' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toEqual('Updated Test User');
    expect(res.body.email).toEqual('test@example.com');
  });

  // Test DELETE /user/:id
  it('should disable user by id', async () => {
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password',
      phone: '555-1234',
    });
    await user.save();
    const res = await request(app).delete(`/user/${user._id}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('message', 'User disabled');
    const disabledUser = await User.findById(user._id);
    expect(disabledUser.active).toEqual(false);
  });
});
