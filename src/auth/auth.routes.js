import { login } from './auth.controller';
import { Router } from 'express';
const router = Router();

// Endpoint POST /login
router.post('/login', login);

export default router;
