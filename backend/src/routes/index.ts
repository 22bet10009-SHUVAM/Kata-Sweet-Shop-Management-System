import { Router } from 'express';
import authRoutes from './authRoutes';
import sweetRoutes from './sweetRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

// Mount routes
router.use('/auth', authRoutes);
router.use('/sweets', sweetRoutes);
router.use('/uploads', uploadRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
