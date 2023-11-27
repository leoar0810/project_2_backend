import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
  acceptProduct,
} from './product.controller';
import { Router } from 'express';
const router = Router();

// Endpoint POST /product
router.post('/', createProduct);

// Endpoint GET /product/:id
router.get('/:id', getProductById);

// Endpoint GET /product
router.get('/', getProducts);

// Endpoint PATCH /product/:id
router.patch('/:id', updateProduct);

// Endpoint DELETE /product/:id
router.delete('/:id', deleteProduct);

export default router;
