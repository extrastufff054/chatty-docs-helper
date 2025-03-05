
import logging
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import Docx2txtLoader
from langchain_community.document_loaders import UnstructuredExcelLoader

logger = logging.getLogger(__name__)

def load_document(filepath):
    """Load a document using the appropriate loader based on file extension"""
    try:
        # Determine the document type based on file extension
        file_extension = os.path.splitext(filepath)[1].lower()
        
        # Select appropriate loader based on file type
        if file_extension == '.pdf':
            loader = PyPDFLoader(filepath)
            documents = loader.load()
        elif file_extension == '.docx':
            loader = Docx2txtLoader(filepath)
            documents = loader.load()
        elif file_extension in ['.xlsx', '.xls']:
            loader = UnstructuredExcelLoader(filepath, mode="elements")
            documents = loader.load()
        else:
            raise ValueError(f"Unsupported file type: {file_extension}. Supported formats are PDF, DOCX, XLSX, and XLS.")
            
        logger.info(f"Successfully loaded {file_extension} document from {filepath}")
        return documents
    except Exception as e:
        logger.exception(f"Error loading document: {str(e)}")
        raise ValueError(f"Failed to load the document. The error was: {str(e)}")
