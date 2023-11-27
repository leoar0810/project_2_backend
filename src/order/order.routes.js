import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder,
  getOrdersSent,
} from './order.controller';
import { Router } from 'express';
const router = Router();

// Endpoint POST /order
router.post('/', createOrder);

// ENDPOINT GET /order/sent
router.get('/sent', getOrdersSent);

// Endpoint GET /order/:id
router.get('/:id', getOrderById);

// Endpoint GET /order
router.get('/', getOrders);

// Endpoint PATCH /order/:id
router.patch('/:id', updateOrder);

// Endpoint DELETE /order/:id
router.delete('/:id', deleteOrder);

export default router;
