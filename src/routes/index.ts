import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import foodRoutes from './food.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/foods', foodRoutes);

export default router;