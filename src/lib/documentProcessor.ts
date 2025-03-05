
/**
 * Document Processing Module
 * 
 * This module provides functionality for processing documents through a Python backend.
 * It handles file uploads, model selection, and query processing for the document Q&A system.
 */

import { API_BASE_URL } from '@/config/constants';
import { getOllamaModels } from './api/ollamaApi';
import { processQuery } from './api/queryProcessor';
import { initializeQAChain, uploadDocument } from './api/documentApi';
import { getFileTypeDisplay, isSupportedFileType, isFileSizeValid } from './utils/fileUtils';

export {
  API_BASE_URL,
  getOllamaModels,
  processQuery,
  initializeQAChain,
  uploadDocument,
  getFileTypeDisplay,
  isSupportedFileType,
  isFileSizeValid
};
