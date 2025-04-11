import { useState } from "react";
import { DocumentationLayout } from "@/components/documentation/DocumentationLayout";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Documentation = () => {
  // Define documentation sections and items
  const docSections = [
    {
      id: "user-guide",
      title: "User Guide",
      items: [
        {
          id: "getting-started",
          title: "Getting Started",
          href: "getting-started",
          content: <GettingStarted />
        },
        {
          id: "uploading-documents",
          title: "Uploading Documents",
          href: "uploading-documents",
          content: <UploadingDocuments />
        },
        {
          id: "asking-questions",
          title: "Asking Questions",
          href: "asking-questions",
          content: <AskingQuestions />
        },
        {
          id: "system-prompts",
          title: "System Prompts",
          href: "system-prompts",
          content: <SystemPrompts />
        },
      ]
    },
    {
      id: "admin-guide",
      title: "Admin Guide",
      items: [
        {
          id: "admin-overview",
          title: "Admin Overview",
          href: "admin-overview",
          content: <AdminOverview />
        },
        {
          id: "document-management",
          title: "Document Management",
          href: "document-management",
          content: <DocumentManagement />
        },
        {
          id: "user-management",
          title: "User Management",
          href: "user-management",
          content: <UserManagement />
        },
        {
          id: "prompt-management",
          title: "Prompt Management",
          href: "prompt-management",
          content: <PromptManagement />
        },
      ]
    },
    {
      id: "reference",
      title: "Reference",
      items: [
        {
          id: "faq",
          title: "Frequently Asked Questions",
          href: "faq",
          content: <FAQ />
        },
        {
          id: "troubleshooting",
          title: "Troubleshooting",
          href: "troubleshooting",
          content: <Troubleshooting />
        },
        {
          id: "glossary",
          title: "Glossary",
          href: "glossary",
          content: <Glossary />
        },
        {
          id: "developer-guide",
          title: "Developer Guide",
          href: "developer-guide",
          content: <DeveloperGuide />
        }
      ]
    }
  ];

  return (
    <DocumentationLayout sections={docSections} defaultSectionId="user-guide" defaultItemId="getting-started">
      <h1 className="text-4xl font-bold mb-6">Documentation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Welcome to the I4C Chatbot documentation. This guide will help you get the most out of the application.
      </p>
    </DocumentationLayout>
  );
};

// Documentation Section Components
const GettingStarted = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Getting Started</h1>
    
    <p className="mb-6">
      This guide will help you get started with the I4C Chatbot application.
      Follow these steps to set up the application and start using it.
    </p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Installation</h2>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Clone the repository:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          git clone https://github.com/yourusername/i4c-chatbot.git
        </p>
      </li>
      <li>
        <strong>Install dependencies:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          cd i4c-chatbot/frontend
          npm install
        </p>
      </li>
      <li>
        <strong>Start the development server:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          npm run dev
        </p>
      </li>
      <li>
        <strong>Open your browser:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          Navigate to http://localhost:5173
        </p>
      </li>
    </ol>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Configuration</h2>
    
    <p className="mb-4">
      The application requires Ollama to be installed and running locally.
      You also need to pull at least one model.
    </p>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Install Ollama:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          Follow the instructions on the <a href="https://ollama.ai" target="_blank" rel="noopener noreferrer" className="underline">Ollama website</a>.
        </p>
      </li>
      <li>
        <strong>Pull a model:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          Open your terminal and run: <code>ollama pull llama3</code>
        </p>
      </li>
    </ol>
  </div>
);

const UploadingDocuments = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Uploading Documents</h1>
    
    <p className="mb-6">
      To start using the chatbot, you need to upload a PDF document.
      Follow these steps to upload a document and prepare it for querying.
    </p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Steps</h2>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Navigate to the main page:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          Open your browser and navigate to http://localhost:5173.
        </p>
      </li>
      <li>
        <strong>Select a model:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a model from the dropdown menu in the sidebar.
        </p>
      </li>
      <li>
        <strong>Upload a PDF document:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          Drag and drop a PDF file into the designated area, or click to select a file from your computer.
        </p>
      </li>
      <li>
        <strong>Wait for processing:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          The application will process the document, which may take a few minutes depending on the size of the file.
        </p>
      </li>
      <li>
        <strong>Select the document:</strong>
         <p className="mt-1 text-sm text-muted-foreground">
          Once processing is complete, select the document from the sidebar to start a new chat.
        </p>
      </li>
    </ol>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Supported File Types</h2>
    
    <ul className="list-disc ml-6 space-y-2">
      <li>PDF (.pdf)</li>
      <li>Microsoft Word (.docx, .doc)</li>
      <li>Microsoft Excel (.xlsx, .xls)</li>
    </ul>
  </div>
);

const AskingQuestions = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Asking Questions</h1>
    
    <p className="mb-6">
      Once you have uploaded a document, you can start asking questions about its content.
      The chatbot will use the document to generate answers to your questions.
    </p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Steps</h2>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Select a document:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a document from the sidebar to start a new chat.
        </p>
      </li>
      <li>
        <strong>Type your question:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your question in the chat input field at the bottom of the page.
        </p>
      </li>
      <li>
        <strong>Press Enter:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          Press Enter or click the send button to submit your question.
        </p>
      </li>
      <li>
        <strong>Read the answer:</strong>
        <p className="mt-1 text-sm text-muted-foreground">
          The chatbot will generate an answer to your question and display it in the chat window.
        </p>
      </li>
    </ol>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Tips for Asking Good Questions</h2>
    
    <ul className="list-disc ml-6 space-y-2">
      <li>Be specific and clear in your questions.</li>
      <li>Use natural language.</li>
      <li>Break down complex questions into smaller parts.</li>
      <li>Provide context if necessary.</li>
    </ul>
  </div>
);

const SystemPrompts = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">System Prompts</h1>
    
    <p className="mb-6">
      System prompts are instructions that guide the AI's behavior and responses.
      You can use system prompts to customize the chatbot's personality, tone, and knowledge.
    </p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">What are System Prompts?</h2>
    
    <p className="mb-4">
      System prompts are pre-defined instructions that tell the AI how to behave.
      They can be used to:
    </p>
    
    <ul className="list-disc ml-6 space-y-2">
      <li>Set the AI's personality (e.g., friendly, professional, humorous).</li>
      <li>Define the AI's knowledge domain (e.g., cybersecurity, finance, medicine).</li>
      <li>Specify the AI's tone (e.g., formal, informal, technical).</li>
      <li>Instruct the AI to follow specific rules or guidelines.</li>
    </ul>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">How to Use System Prompts</h2>
    
    <p className="mb-4">
      To use a system prompt, select it from the dropdown menu in the chat interface.
      The AI will then use the selected prompt to guide its responses.
    </p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Default System Prompts</h2>
    
    <p className="mb-4">
      The application comes with a set of default system prompts that you can use.
      These prompts are designed to provide a good starting point for most use cases.
    </p>
    
    <ul className="list-disc ml-6 space-y-2">
      <li><strong>Default:</strong> A general-purpose prompt that provides helpful and informative answers.</li>
      <li><strong>Cybersecurity Expert:</strong> A prompt that specializes in cybersecurity topics.</li>
      <li><strong>Friendly Chatbot:</strong> A prompt that uses a friendly and conversational tone.</li>
    </ul>
  </div>
);

const AdminOverview = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Admin Overview</h1>
    
    <p className="mb-6">
      The admin interface allows you to manage documents, users, and system prompts.
      This guide will help you navigate the admin interface and perform common tasks.
    </p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Accessing the Admin Interface</h2>
    
    <p className="mb-4">
      To access the admin interface, navigate to <code>/admin</code> in your browser.
      You will be prompted to enter an admin token.
    </p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Admin Token</h2>
    
    <p className="mb-4">
      The admin token is a secret key that is used to authenticate admin users.
      The token is stored in the <code>ADMIN_TOKEN</code> environment variable.
    </p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Admin Interface Sections</h2>
    
    <ul className="list-disc ml-6 space-y-2">
      <li><strong>Documents:</strong> Manage uploaded documents.</li>
      <li><strong>Users:</strong> Manage user accounts.</li>
      <li><strong>System Prompts:</strong> Manage system prompts.</li>
    </ul>
  </div>
);

const DocumentManagement = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Document Management</h1>
    
    <p className="mb-6">
      The document management section allows you to upload, edit, and delete documents.
      You can also view document metadata and usage statistics.
    </p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Uploading Documents</h2>
    
    <p className="mb-4">
      To upload a document, follow these steps:
    </p>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Click the "Upload Document" button.</strong>
      </li>
      <li>
        <strong>Enter the document title and description.</strong>
      </li>
      <li>
        <strong>Select a model from the dropdown menu.</strong>
      </li>
      <li>
        <strong>Drag and drop a PDF file into the designated area, or click to select a file from your computer.</strong>
      </li>
      <li>
        <strong>Click the "Upload" button.</strong>
      </li>
    </ol>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Editing Documents</h2>
    
    <p className="mb-4">
      To edit a document, follow these steps:
    </p>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Select the document from the list.</strong>
      </li>
      <li>
        <strong>Click the "Edit" button.</strong>
      </li>
      <li>
        <strong>Modify the document title and description.</strong>
      </li>
      <li>
        <strong>Click the "Save" button.</strong>
      </li>
    </ol>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Deleting Documents</h2>
    
    <p className="mb-4">
      To delete a document, follow these steps:
    </p>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Select the document from the list.</strong>
      </li>
      <li>
        <strong>Click the "Delete" button.</strong>
      </li>
      <li>
        <strong>Confirm the deletion.</strong>
      </li>
    </ol>
  </div>
);

const UserManagement = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">User Management</h1>
    
    <p className="mb-6">
      The user management section allows you to manage user accounts.
      You can create, edit, and delete user accounts.
    </p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Creating User Accounts</h2>
    
    <p className="mb-4">
      To create a user account, follow these steps:
    </p>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Click the "Create User" button.</strong>
      </li>
      <li>
        <strong>Enter the user's name, email, and password.</strong>
      </li>
       <li>
        <strong>Select the user's role.</strong>
      </li>
      <li>
        <strong>Click the "Create" button.</strong>
      </li>
    </ol>
    
     <h2 className="text-2xl font-bold mt-8 mb-4">Editing User Accounts</h2>
    
    <p className="mb-4">
      To edit a user account, follow these steps:
    </p>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Select the user from the list.</strong>
      </li>
      <li>
        <strong>Click the "Edit" button.</strong>
      </li>
      <li>
        <strong>Modify the user's name, email, and password.</strong>
      </li>
       <li>
        <strong>Select the user's role.</strong>
      </li>
      <li>
        <strong>Click the "Save" button.</strong>
      </li>
    </ol>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Deleting User Accounts</h2>
    
    <p className="mb-4">
      To delete a user account, follow these steps:
    </p>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Select the user from the list.</strong>
      </li>
      <li>
        <strong>Click the "Delete" button.</strong>
      </li>
      <li>
        <strong>Confirm the deletion.</strong>
      </li>
    </ol>
  </div>
);

const PromptManagement = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Prompt Management</h1>
    
    <p className="mb-6">
      The prompt management section allows you to manage system prompts.
      You can create, edit, and delete system prompts.
    </p>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Creating System Prompts</h2>
    
    <p className="mb-4">
      To create a system prompt, follow these steps:
    </p>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Click the "Create Prompt" button.</strong>
      </li>
      <li>
        <strong>Enter the prompt name, description, and content.</strong>
      </li>
      <li>
        <strong>Click the "Create" button.</strong>
      </li>
    </ol>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Editing System Prompts</h2>
    
    <p className="mb-4">
      To edit a system prompt, follow these steps:
    </p>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Select the prompt from the list.</strong>
      </li>
      <li>
        <strong>Click the "Edit" button.</strong>
      </li>
      <li>
        <strong>Modify the prompt name, description, and content.</strong>
      </li>
      <li>
        <strong>Click the "Save" button.</strong>
      </li>
    </ol>
    
    <h2 className="text-2xl font-bold mt-8 mb-4">Deleting System Prompts</h2>
    
    <p className="mb-4">
      To delete a system prompt, follow these steps:
    </p>
    
    <ol className="list-decimal ml-6 space-y-3 mb-8">
      <li>
        <strong>Select the prompt from the list.</strong>
      </li>
      <li>
        <strong>Click the "Delete" button.</strong>
      </li>
      <li>
        <strong>Confirm the deletion.</strong>
      </li>
    </ol>
  </div>
);

const FAQ = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
    
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">What is the I4C Chatbot?</h2>
        <p>The I4C Chatbot is a React-based application that allows you to upload PDF documents and ask questions about their content using local AI models.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">How do I upload a document?</h2>
        <p>To upload a document, drag and drop a PDF file into the designated area, or click to select a file from your computer.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">What file types are supported?</h2>
        <p>The application currently supports PDF files. Support for other file types may be added in the future.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">How do I ask a question?</h2>
        <p>To ask a question, type your question in the chat input field at the bottom of the page and press Enter.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">How do I select a different model?</h2>
        <p>To select a different model, choose a model from the dropdown menu in the sidebar.</p>
      </div>
    </div>
  </div>
);

const Troubleshooting = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Troubleshooting</h1>
    
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">The application is not loading.</h2>
        <p>Make sure that you have installed all dependencies and that the development server is running.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">I can't upload a document.</h2>
        <p>Make sure that the file is a PDF and that it is not too large.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">The chatbot is not responding to my questions.</h2>
        <p>Make sure that you have selected a document and that the model is loaded correctly.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">I'm getting an error message.</h2>
        <p>Check the console for more information about the error. If you can't resolve the issue, please contact the developers.</p>
      </div>
    </div>
  </div>
);

const Glossary = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Glossary</h1>
    
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">AI Model</h2>
        <p>An AI model is a computer program that has been trained to perform a specific task, such as generating text or answering questions.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">System Prompt</h2>
        <p>A system prompt is a set of instructions that guide the AI's behavior and responses.</p>
      </div>
      
      <div>
        <h2 className="text-xl font-semibold mb-2">Admin Token</h2>
        <p>The admin token is a secret key that is used to authenticate admin users.</p>
      </div>
    </div>
  </div>
);

const DeveloperGuide = () => (
  <div>
    <h1 className="text-3xl font-bold mb-4">Developer Guide</h1>
    
    <p className="mb-6">
      If you're a developer looking to contribute to the I4C Chatbot project or extend its functionality,
      please refer to our comprehensive developer documentation.
    </p>
    
    <Link to="/developer">
      <Button className="mt-4">
        View Developer Documentation
        <ChevronRight className="ml-2 h-4 w-4" />
      </Button>
    </Link>
    
    <p className="mt-6 text-sm text-muted-foreground">
      The developer documentation includes detailed information about the project architecture, 
      component structure, API specifications, and guides for implementing new features.
    </p>
  </div>
);

export default Documentation;
