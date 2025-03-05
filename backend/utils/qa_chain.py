
import logging
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain_community.llms.ollama import OllamaEndpointNotFoundError

from backend.storage import system_prompts

logger = logging.getLogger(__name__)

class StreamingCallbackHandler:
    """A callback handler that collects tokens for streaming."""
    def __init__(self):
        self.tokens = []
        
    def on_llm_new_token(self, token: str, **kwargs) -> None:
        self.tokens.append(token)

def initialize_qa_chain(documents, model_checkpoint, prompt_id="default", temperature=0.0):
    """Initialize the QA chain with the loaded document"""
    try:
        # Optimized chunking parameters for better balance between speed and context
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1500,  # Larger chunks for more context
            chunk_overlap=150, # Moderate overlap to maintain context between chunks
            separators=["\n\n", "\n", ". ", " ", ""]
        )
        splits = text_splitter.split_documents(documents)
        logger.info(f"Document split into {len(splits)} chunks")
    except Exception as e:
        logger.exception("Error splitting document: %s", str(e))
        raise ValueError("Failed to split the document for processing.")

    try:
        # Use simpler, faster embeddings
        embeddings = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
        
        # Build FAISS index with optimized parameters
        vectordb = FAISS.from_documents(
            splits, 
            embeddings,
            # Using a higher M value for better quality at the expense of some speed
            distance_strategy="cosine"
        )
    except Exception as e:
        logger.exception("Error creating embeddings/vector store: %s", str(e))
        raise ValueError("Failed to create embeddings or vector store.")

    try:
        # Get the system prompt
        prompt_template = system_prompts.get(prompt_id, system_prompts["default"])
        
        # Create prompt template
        custom_prompt = PromptTemplate(
            input_variables=["context", "question"],
            template=prompt_template["prompt"]
        )
        
        # Initialize the Ollama LLM using the selected local model with temperature
        llm = Ollama(
            model=model_checkpoint, 
            temperature=float(temperature),
            num_ctx=4096  # Increased context window for handling more content
        )
    except Exception as e:
        logger.exception("Error initializing the Ollama LLM: %s", str(e))
        raise ValueError("Failed to initialize the language model. Check your model configuration.")

    try:
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=vectordb.as_retriever(
                search_kwargs={"k": 5}  # Retrieve more chunks for better context
            ),
            chain_type_kwargs={"prompt": custom_prompt}
        )
        return qa_chain
    except Exception as e:
        logger.exception("Error creating QA chain: %s", str(e))
        raise ValueError("Failed to initialize the QA chain.")

def process_answer(query, qa_chain):
    """Process a query with the QA chain and return the answer with streaming tokens"""
    callback_handler = StreamingCallbackHandler()
    try:
        # Pass the callback handler to the chain's run method.
        final_output = qa_chain.run(query, callbacks=[callback_handler])
        return final_output, callback_handler.tokens
    except OllamaEndpointNotFoundError as e:
        logger.exception("Ollama model endpoint not found: %s", str(e))
        error_msg = ("Ollama model endpoint not found. Please ensure that the specified model is pulled locally. "
                "Try running `ollama pull <model>` as suggested in the error message.")
        return error_msg, [error_msg]
    except Exception as e:
        logger.exception("Error during query processing: %s", str(e))
        error_msg = "An error occurred while processing your query. Please try again later."
        return error_msg, [error_msg]
