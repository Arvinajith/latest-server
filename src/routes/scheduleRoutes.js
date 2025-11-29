import { Router } from 'express';

import { getSchedule, upsertSchedule } from '../controllers/scheduleController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router({ mergeParams: true });

router.get('/:eventId', authenticate, asyncHandler(getSchedule));
router.put('/:eventId', authenticate, authorize('organizer', 'admin'), asyncHandler(upsertSchedule));

export default router;

