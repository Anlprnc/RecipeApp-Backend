import { Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/user.entity';
import { AuthRequest } from '../middleware/auth.middleware';
import fs from 'fs';
import path from 'path';

const userRepository = AppDataSource.getRepository(User);

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { password: _, ...userWithoutPassword } = req.user!;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    const { email } = req.body;

    if (email && email !== user.email) {
      const existingUser = await userRepository.findOne({ where: { email } });
      if (existingUser) {
        res.status(400).json({ error: 'Email already in use' });
        return;
      }
      user.email = email;
    }

    await userRepository.save(user);

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Error updating profile' });
  }
};

export const deleteProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    await userRepository.remove(req.user!);
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting profile' });
  }
};

export const uploadAvatar = async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const user = await userRepository.findOne({
            where: { id: req.user!.id }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.avatarUrl) {
            const oldAvatarPath = path.join(__dirname, '../../', user.avatarUrl);
            if (fs.existsSync(oldAvatarPath)) {
                fs.unlinkSync(oldAvatarPath);
            }
        }

        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        user.avatarUrl = avatarUrl;
        await userRepository.save(user);

        res.json({ avatarUrl });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: 'Error uploading avatar' });
    }
};