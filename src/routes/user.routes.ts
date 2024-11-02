import { Router } from 'express';
import { getProfile, updateProfile, deleteProfile, uploadAvatar } from '../controllers/user.controller';
import { auth } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/profile', auth, getProfile);
router.patch('/profile', auth, async (req, res) => {
  await updateProfile(req, res);
});
router.delete('/profile', auth, async (req, res) => {
  await deleteProfile(req, res);
});
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  await uploadAvatar(req, res);
});

export default router;