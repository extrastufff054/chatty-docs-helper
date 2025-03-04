
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Directory where documents will be stored
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// In-memory storage for documents and sessions
const documents: Record<string, any> = {};
const sessions: Record<string, any> = {};
const systemPrompts: Record<string, any> = {
  'default': {
    id: 'default',
    title: 'Default System Prompt',
    content: 'You are a helpful AI assistant that answers questions based on the provided documents.',
    is_default: true
  }
};

// Get all documents
export const getDocuments = (req: Request, res: Response) => {
  try {
    // Convert document object to array
    const documentsList = Object.values(documents);
    res.json({ documents: documentsList });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

// Get all system prompts
export const getSystemPrompts = (req: Request, res: Response) => {
  try {
    // Convert prompts object to array
    const promptsList = Object.values(systemPrompts);
    res.json({ prompts: promptsList });
  } catch (error) {
    console.error('Error fetching system prompts:', error);
    res.status(500).json({ error: 'Failed to fetch system prompts' });
  }
};

// Select a document for processing
export const selectDocument = (req: Request, res: Response) => {
  try {
    const { document_id, model, prompt_id, temperature } = req.body;
    
    if (!document_id || !model) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Check if document exists
    if (!documents[document_id]) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Create a new session for this document
    const sessionId = uuidv4();
    sessions[sessionId] = {
      document_id,
      model,
      prompt_id: prompt_id || 'default',
      temperature: temperature || 0.0,
      created_at: new Date().toISOString(),
    };
    
    res.json({ session_id: sessionId });
  } catch (error) {
    console.error('Error selecting document:', error);
    res.status(500).json({ error: 'Failed to select document' });
  }
};

// Process a query against a document
export const processQuery = (req: Request, res: Response) => {
  try {
    const { session_id, query } = req.body;
    
    if (!session_id || !query) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // Check if session exists
    if (!sessions[session_id]) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    // Get session details
    const session = sessions[session_id];
    const document = documents[session.document_id];
    
    // In a real implementation, this would use a language model to process
    // For now, we'll return a mock response
    const answer = `This is a simulated answer about "${document.title}" using model "${session.model}" for query: "${query}"`;
    
    res.json({
      answer,
      tokens: answer.split(' '),  // Simplified token representation
      model: session.model,
      document_id: session.document_id,
      document_title: document.title,
    });
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: 'Failed to process query' });
  }
};

// Get available models
export const getModels = (req: Request, res: Response) => {
  try {
    // Mock list of models
    const models = ['llama3', 'mistral', 'gemma', 'phi'];
    res.json({ models });
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
};

// Upload a document (simulated)
export const uploadDocument = (req: Request, res: Response) => {
  try {
    // Mock implementation for now
    const documentId = uuidv4();
    const sessionId = uuidv4();
    
    sessions[sessionId] = {
      document_id: documentId,
      model: 'llama3',
      created_at: new Date().toISOString(),
    };
    
    res.json({ session_id: sessionId });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

// Upload a document via admin panel
export const adminUploadDocument = (req: Request, res: Response) => {
  try {
    // For a real implementation, handle file upload, processing, etc.
    // For now, just create a document record
    const documentId = uuidv4();
    const file = req.file;
    const { title, description, model } = req.body;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    // Create document record
    documents[documentId] = {
      id: documentId,
      title: title || file.originalname,
      description: description || '',
      filename: file.originalname,
      model: model || 'llama3',
      created_at: new Date().toISOString(),
    };
    
    res.json({
      document_id: documentId,
      message: 'Document uploaded successfully',
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

// Delete a document
export const deleteDocument = (req: Request, res: Response) => {
  try {
    const { documentId } = req.params;
    
    if (!documents[documentId]) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Delete the document
    delete documents[documentId];
    
    // Delete any sessions using this document
    Object.keys(sessions).forEach(sessionId => {
      if (sessions[sessionId].document_id === documentId) {
        delete sessions[sessionId];
      }
    });
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
};

// Get admin token
export const getAdminToken = (req: Request, res: Response) => {
  try {
    // For demonstration purposes, read from .env
    const adminToken = process.env.ADMIN_TOKEN || 'admin-token-secret';
    res.json({ admin_token: adminToken });
  } catch (error) {
    console.error('Error fetching admin token:', error);
    res.status(500).json({ error: 'Failed to fetch admin token' });
  }
};
