
import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';

// Simulated data storage - in a real app, this would be a database
const documents: any[] = [];
const systemPrompts: any[] = [
  { id: 'default', title: 'Default', prompt: 'You are a helpful assistant.' }
];

// Upload a document
export const uploadDocument = (req: Request, res: Response) => {
  try {
    // In a real implementation, this would:
    // 1. Save the uploaded file
    // 2. Extract text from the document
    // 3. Split text into chunks
    // 4. Create embeddings and store in vector database
    
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const documentId = Math.random().toString(36).substring(2, 15);
    const title = req.body.title || req.file.originalname;
    const description = req.body.description || '';
    
    // Add document to storage
    documents.push({
      id: documentId,
      title,
      description,
      filename: req.file.originalname,
      created: new Date()
    });
    
    res.json({ 
      document_id: documentId,
      message: 'Document uploaded and processed successfully' 
    });
  } catch (error) {
    console.error('Error uploading document:', error);
    res.status(500).json({ error: 'Failed to upload and process document' });
  }
};

// Create a new system prompt
export const createSystemPrompt = (req: Request, res: Response) => {
  try {
    const { title, prompt } = req.body;
    
    if (!title || !prompt) {
      return res.status(400).json({ error: 'Title and prompt are required' });
    }
    
    const id = Math.random().toString(36).substring(2, 15);
    
    // Add prompt to storage
    systemPrompts.push({ id, title, prompt });
    
    res.json({ 
      id,
      message: 'System prompt created successfully' 
    });
  } catch (error) {
    console.error('Error creating system prompt:', error);
    res.status(500).json({ error: 'Failed to create system prompt' });
  }
};

// Get all system prompts for admin
export const getSystemPrompts = (req: Request, res: Response) => {
  res.json({ prompts: systemPrompts });
};

// Delete a system prompt
export const deleteSystemPrompt = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Find the prompt index
    const index = systemPrompts.findIndex(prompt => prompt.id === id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'System prompt not found' });
    }
    
    // Prevent deleting the default prompt
    if (systemPrompts[index].id === 'default') {
      return res.status(400).json({ error: 'Cannot delete the default system prompt' });
    }
    
    // Remove the prompt
    systemPrompts.splice(index, 1);
    
    res.json({ message: 'System prompt deleted successfully' });
  } catch (error) {
    console.error('Error deleting system prompt:', error);
    res.status(500).json({ error: 'Failed to delete system prompt' });
  }
};
