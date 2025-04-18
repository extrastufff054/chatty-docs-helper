
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const GettingStarted = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Getting Started with Development</h1>
      
      <p className="mb-6">
        This guide will help you set up your development environment and start
        contributing to the I4C Chatbot project.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Prerequisites</h2>
      
      <div className="space-y-2 mb-8">
        <div className="p-3 bg-muted rounded-md">
          <span className="font-medium">Node.js 16 or higher</span>
        </div>
        <div className="p-3 bg-muted rounded-md">
          <span className="font-medium">Python 3.9 or higher</span>
        </div>
        <div className="p-3 bg-muted rounded-md">
          <span className="font-medium">Ollama installed locally</span>
        </div>
        <div className="p-3 bg-muted rounded-md">
          <span className="font-medium">Git</span>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Installation Steps</h2>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">1. Clone the Repository</h3>
          <pre className="text-xs p-3 bg-muted rounded-md overflow-auto mb-6">
{`git clone https://github.com/yourusername/i4c-chatbot.git
cd i4c-chatbot`}
          </pre>
          
          <h3 className="text-lg font-semibold mb-4">2. Install Frontend Dependencies</h3>
          <pre className="text-xs p-3 bg-muted rounded-md overflow-auto mb-6">
{`cd frontend
npm install`}
          </pre>
          
          <h3 className="text-lg font-semibold mb-4">3. Install Backend Dependencies</h3>
          <pre className="text-xs p-3 bg-muted rounded-md overflow-auto mb-6">
{`cd ../backend
pip install -r requirements.txt`}
          </pre>
          
          <h3 className="text-lg font-semibold mb-4">4. Environment Configuration</h3>
          <pre className="text-xs p-3 bg-muted rounded-md overflow-auto mb-6">
{`# Create .env files from examples
cd frontend
cp .env.example .env

cd ../backend
cp .env.example .env

# Edit the .env files with your configuration`}
          </pre>
          
          <h3 className="text-lg font-semibold mb-4">5. Start Ollama</h3>
          <pre className="text-xs p-3 bg-muted rounded-md overflow-auto mb-6">
{`# In a separate terminal
ollama serve`}
          </pre>
          
          <h3 className="text-lg font-semibold mb-4">6. Pull a Model</h3>
          <pre className="text-xs p-3 bg-muted rounded-md overflow-auto mb-6">
{`# In another terminal
ollama pull llama3`}
          </pre>
          
          <h3 className="text-lg font-semibold mb-4">7. Start the Backend</h3>
          <pre className="text-xs p-3 bg-muted rounded-md overflow-auto mb-6">
{`# From the backend directory
python app.py`}
          </pre>
          
          <h3 className="text-lg font-semibold mb-4">8. Start the Frontend</h3>
          <pre className="text-xs p-3 bg-muted rounded-md overflow-auto mb-6">
{`# From the frontend directory
npm run dev`}
          </pre>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Project Structure</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Frontend</h3>
            <pre className="text-xs p-3 bg-muted rounded-md overflow-auto">
{`frontend/
├── public/          # Static assets
├── src/
│   ├── components/  # React components
│   ├── contexts/    # React contexts
│   ├── hooks/       # Custom React hooks
│   ├── lib/         # Utility functions
│   ├── pages/       # Application pages
│   └── config/      # Configuration files
├── .env             # Environment variables
└── package.json     # Dependencies`}
            </pre>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">Backend</h3>
            <pre className="text-xs p-3 bg-muted rounded-md overflow-auto">
{`backend/
├── app.py           # Main Flask application
├── routes/          # API routes
├── processors/      # Document processing logic
├── models/          # Data models
├── utils/           # Utility functions
├── config.py        # Configuration
├── .env             # Environment variables
└── requirements.txt # Dependencies`}
            </pre>
          </CardContent>
        </Card>
      </div>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Development Workflow</h2>
      
      <ol className="list-decimal pl-5 space-y-4 mb-8">
        <li>
          <strong>Create a new branch</strong> for your feature or bugfix
          <pre className="text-xs p-2 bg-muted rounded-md mt-2">git checkout -b feature/your-feature-name</pre>
        </li>
        <li>
          <strong>Make your changes</strong> to the codebase
        </li>
        <li>
          <strong>Write tests</strong> if applicable
        </li>
        <li>
          <strong>Run linting and tests</strong>
          <pre className="text-xs p-2 bg-muted rounded-md mt-2">npm run lint
npm test</pre>
        </li>
        <li>
          <strong>Commit your changes</strong> with a descriptive message
          <pre className="text-xs p-2 bg-muted rounded-md mt-2">git commit -m "feat: add new document upload feature"</pre>
        </li>
        <li>
          <strong>Push your branch</strong> to the remote repository
          <pre className="text-xs p-2 bg-muted rounded-md mt-2">git push -u origin feature/your-feature-name</pre>
        </li>
        <li>
          <strong>Create a pull request</strong> against the main branch
        </li>
      </ol>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link to="/developer">
          <Button variant="outline">Back to Overview</Button>
        </Link>
        <Link to="/developer/apis/document-processor">
          <Button>Explore Documentation</Button>
        </Link>
      </div>
    </div>
  );
};

export default GettingStarted;
