import { Router } from 'express';

import { getAnalytics } from '../controllers/analyticsController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', authenticate, authorize('organizer', 'admin'), asyncHandler(getAnalytics));

export default router;

