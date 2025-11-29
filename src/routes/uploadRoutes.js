import { Router } from 'express';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

import { cloudinaryClient } from '../config/cloudinary.js';
import { handleUpload } from '../controllers/uploadController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = Router();

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryClient,
  params: {
    folder: 'events',
    resource_type: 'auto',
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post('/', authenticate, authorize('organizer', 'admin'), upload.array('files', 5), handleUpload);

export default router;

