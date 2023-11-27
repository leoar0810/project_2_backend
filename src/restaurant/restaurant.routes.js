import {
  createRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getRestaurants,
  updateRestaurant,
} from './restaurant.controller';
import { Router } from 'express';
const router = Router();

// Endpoint POST /restaurant
router.post('/', createRestaurant);

// Endpoint GET /restaurant/:id
router.get('/:id', getRestaurantById);

// Endpoint GET /restaurant
router.get('/', getRestaurants);

// Endpoint PATCH /restaurant/:id
router.patch('/:id', updateRestaurant);

// Endpoint DELETE /restaurant/:id
router.delete('/:id', deleteRestaurant);

export default router;
