import { Router } from 'express';

import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  getEventAttendees,
} from '../controllers/eventController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getEvents));
router.get('/:id', asyncHandler(getEventById));

router.post('/', authenticate, authorize('organizer', 'admin'), asyncHandler(createEvent));
router.put('/:id', authenticate, authorize('organizer', 'admin'), asyncHandler(updateEvent));
router.delete('/:id', authenticate, authorize('organizer', 'admin'), asyncHandler(deleteEvent));
router.post('/:id/approve', authenticate, authorize('admin'), asyncHandler(approveEvent));
router.get('/:id/attendees', authenticate, authorize('organizer', 'admin'), asyncHandler(getEventAttendees));

export default router;

