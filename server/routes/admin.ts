
import express from 'express';
import { uploadDocument, createSystemPrompt, getSystemPrompts, deleteSystemPrompt } from '../controllers/adminController';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Admin routes - all protected by authentication
router.post('/upload', authenticate, uploadDocument);
router.post('/system-prompts', authenticate, createSystemPrompt);
router.get('/system-prompts', authenticate, getSystemPrompts);
router.delete('/system-prompts/:id', authenticate, deleteSystemPrompt);

export default router;
