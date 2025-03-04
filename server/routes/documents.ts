
import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  getDocuments, 
  getSystemPrompts, 
  selectDocument, 
  processQuery, 
  getModels, 
  uploadDocument 
} from '../controllers/documentController';

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

// Public API routes
router.get('/documents', getDocuments);
router.get('/system-prompts', getSystemPrompts);
router.post('/select-document', selectDocument);
router.post('/query', processQuery);
router.get('/models', getModels);
router.post('/upload', upload.single('file'), uploadDocument);

export default router;
