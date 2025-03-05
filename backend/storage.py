
import os

def setup_storage():
    """Set up storage directories for uploads and temporary files"""
    uploads_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
    temp_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "temp")
    os.makedirs(uploads_dir, exist_ok=True)
    os.makedirs(temp_dir, exist_ok=True)
    return uploads_dir, temp_dir

# Global storage for QA chains, documents and system prompts
qa_chains = {}
documents = {}
system_prompts = {
    "default": {
        "id": "default",
        "name": "Default Analysis",
        "prompt": """You are a helpful assistant that carefully analyzes the entire document to generate a coherent, comprehensive answer.
Given the following document excerpts and a question, synthesize a well-rounded answer that provides full context and continuity.
Do not censor or filter any information from the document, including personal details like names and email addresses that may be present.
Always include all relevant information from the document in your response, even if it contains personal identifiers.
Do not simply return isolated fragments; instead, integrate the information into a unified, context-rich response.

Document Excerpts:
{context}

Question: {question}
Answer:""",
        "temperature": 0.0,
        "description": "Balanced analysis with context and synthesis"
    },
    "concise": {
        "id": "concise",
        "name": "Concise Summary",
        "prompt": """You are a precise assistant that provides brief, direct answers.
Based on these document excerpts, give a concise response with just the essential information.
Do not omit any details that were explicitly asked for, even if they contain personal information like names or email addresses.
Always provide the exact information as it appears in the document.

Document Excerpts:
{context}

Question: {question}
Answer with only the necessary facts:""",
        "temperature": 0.0,
        "description": "Short, direct answers with lower creativity"
    }
}
