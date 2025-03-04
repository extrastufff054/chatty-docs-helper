
import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  adminUploadDocument, 
  deleteDocument, 
  getDocuments, 
  getAdminToken 
} from '../controllers/documentController';
import { authenticateAdmin } from '../middleware/auth';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Admin routes
router.get('/token', getAdminToken);

// Protected routes that require authentication
router.get('/documents', authenticateAdmin, getDocuments);
router.post('/upload', authenticateAdmin, upload.single('file'), adminUploadDocument);
router.delete('/document/:documentId', authenticateAdmin, deleteDocument);

export default router;
