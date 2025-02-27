
# PDF Chatbot User Guide

Welcome to PDF Chatbot! This guide will help you get started with using the application to chat with your PDF documents.

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Uploading Documents](#uploading-documents)
4. [Choosing a Model](#choosing-a-model)
5. [Asking Questions](#asking-questions)
6. [Tips and Best Practices](#tips-and-best-practices)
7. [Troubleshooting](#troubleshooting)
8. [FAQ](#faq)

## Overview

PDF Chatbot is an application that allows you to upload PDF documents and ask questions about their content. The application uses local AI models through Ollama to generate responses based on your documents, providing a convenient way to extract information without having to read through entire documents manually.

## Getting Started

To use PDF Chatbot, you need:

1. A modern web browser (Chrome, Firefox, Safari, or Edge)
2. Ollama installed on your computer (download from [ollama.ai](https://ollama.ai))
3. At least one Ollama model downloaded (e.g., `llama3`, `mistral`, or `gemma`)

## Uploading Documents

1. Navigate to the main page of the application
2. Find the "Upload PDF" section in the sidebar
3. Either drag and drop a PDF file onto the upload area or click to browse for a file
4. Wait for the document to be processed (this may take a few moments depending on the size of the document)
5. Once processed, you'll see the name of your document below the upload area

**Supported File Types:**
- PDF documents (`.pdf` files)

**Document Size Limits:**
- While there's no strict size limit, very large documents (100+ pages) may take longer to process and might require more system resources

## Choosing a Model

1. In the sidebar, find the "Choose Ollama Model" section
2. Select one of the available models from the list
3. If no models are shown, you need to install Ollama and download at least one model using the command `ollama pull modelname`

**Recommended Models:**
- `llama3` - Good all-around model for most documents
- `mistral` - Good for technical documents
- `phi` - Faster for simpler documents
- `gemma` - Alternative option with good performance

## Asking Questions

1. After uploading a document and selecting a model, the chat input will become active
2. Type your question in the input field at the bottom of the chat area
3. Press Enter or click the Send button to submit your question
4. The answer will be streamed back word by word in the chat area

**Example Questions:**
- "What is the main topic of this document?"
- "Summarize the key points in the third section."
- "What recommendations are made in the conclusion?"
- "Extract all the dates mentioned in the document."
- "What is the author's opinion on [specific topic]?"

## Tips and Best Practices

### For Better Results

1. **Be specific**: Ask clear, focused questions for more accurate answers
2. **Provide context**: Include relevant context in your questions
3. **Try different models**: If one model doesn't give satisfactory answers, try another
4. **Start simple**: Begin with simple questions to understand the document's content before asking complex ones
5. **Break down complex questions**: Split complex queries into multiple simpler questions

### Document Preparation

1. **Use searchable PDFs**: Make sure your PDFs contain text and are not just scanned images
2. **Smaller documents work better**: If you have very large documents, consider splitting them
3. **Remove unnecessary pages**: Tables of contents, indices, and reference pages may add noise

## Troubleshooting

### Common Issues

**Issue**: No models available in the dropdown
- **Solution**: Ensure Ollama is installed and running, and you've pulled at least one model

**Issue**: Error when uploading a PDF
- **Solution**: Check if the PDF is valid and not password-protected. Try with a different PDF.

**Issue**: Very slow responses
- **Solution**: Try using a smaller model, or process a smaller document

**Issue**: Answers are not relevant to my questions
- **Solution**: Ask more specific questions, use a different model, or check if the document contains the information you're looking for

**Issue**: Application doesn't load
- **Solution**: Check your internet connection and ensure your browser is up to date

## FAQ

**Q: Is my data sent to any external servers?**
A: No. All processing happens locally on your computer. Your documents and questions do not leave your machine.

**Q: Why do I need to install Ollama?**
A: Ollama provides the AI models that power the PDF Chatbot. These models run locally on your computer.

**Q: How accurate are the answers?**
A: The accuracy depends on several factors including the quality of the document, the complexity of the question, and the model used. The system attempts to find relevant information but may not always provide perfect answers.

**Q: Can I use this offline?**
A: Yes, once the application is loaded in your browser, it can work completely offline as long as Ollama is running locally.

**Q: Can I process multiple documents at once?**
A: The current version supports one document at a time. To ask questions about a different document, upload the new document and it will replace the current one.

**Q: Are there any limits to how many questions I can ask?**
A: No, you can ask as many questions as you like about your uploaded document.

---

If you encounter any issues not covered in this guide, please check the documentation page within the application for more detailed information or contact support.
