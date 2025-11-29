import { Router } from 'express';

import {
  getUsers,
  updateUserRole,
  getPendingEvents,
  getTransactions,
  exportAttendees,
  getFeedback,
} from '../controllers/adminController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/users', asyncHandler(getUsers));
router.put('/users/:id', asyncHandler(updateUserRole));
router.get('/events/pending', asyncHandler(getPendingEvents));
router.get('/transactions', asyncHandler(getTransactions));
router.get('/events/:eventId/attendees/export', asyncHandler(exportAttendees));
router.get('/events/:eventId/feedback', asyncHandler(getFeedback));

export default router;

