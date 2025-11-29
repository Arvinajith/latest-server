import { Router } from 'express';

import {
  initiateCheckout,
  confirmPurchase,
  getMyTickets,
  cancelTicket,
  transferTicket,
} from '../controllers/ticketController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/me', authenticate, asyncHandler(getMyTickets));
router.post('/checkout', authenticate, asyncHandler(initiateCheckout));
router.post('/confirm', authenticate, asyncHandler(confirmPurchase));
router.patch('/:id/cancel', authenticate, asyncHandler(cancelTicket));
router.post('/:id/transfer', authenticate, asyncHandler(transferTicket));

export default router;

