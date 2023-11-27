import {
  createUser,
  deleteUser,
  getUserById,
  getUserByCredentials,
  updateUser,
} from './user.controller';
import { Router } from 'express';
const router = Router();

// Endpoint POST /user
router.post('/', createUser);

// Endpoint POST /user/credentials
router.post('/credentials', getUserByCredentials);

// Endpoint GET /user/:id
router.get('/:id', getUserById);

// Endpoint PATCH /user/:id
router.patch('/:id', updateUser);

// Endpoint DELETE /user/:id
router.delete('/:id', deleteUser);

export default router;
