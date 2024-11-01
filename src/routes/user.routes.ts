import { Router } from 'express';
import { auth } from '../middleware/auth.middleware';
import { deleteProfile, getProfile, updateProfile } from '../controllers/user.controller';

const router = Router();

router.get('/profile', auth, getProfile);
router.patch('/profile', auth, updateProfile);
router.delete('/profile', auth, deleteProfile);

export default router;