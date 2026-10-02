import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Profile and Address endpoints (authenticated via Supabase access token)
router.get('/profile', requireAuth, authController.getProfile);
router.put('/profile', requireAuth, authController.updateProfile);
router.post('/addresses', requireAuth, authController.addSavedAddress);
router.post('/logout', authController.logout);

export default router;
