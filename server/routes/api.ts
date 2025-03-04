
import express from 'express';
import { getModels, selectDocument, getDocuments, getSystemPrompts, handleQuery } from '../controllers/apiController';

const router = express.Router();

// API Routes
router.get('/models', getModels);
router.get('/documents', getDocuments);
router.get('/system-prompts', getSystemPrompts);
router.post('/select-document', selectDocument);
router.post('/query', handleQuery);

export default router;
