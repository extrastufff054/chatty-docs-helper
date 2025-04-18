
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FrontendArchitecture = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Frontend Architecture</h1>
      
      <p className="mb-6">
        The frontend is built using React with TypeScript, focusing on component reusability, state management, and responsive design.
      </p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Directory Structure</h2>
      
      <Card className="mb-8">
        <CardContent className="pt-6">
          <pre className="text-sm overflow-auto p-4 bg-muted rounded-md">
{`src/
├── components/         # Reusable UI components
│   ├── ui/             # Base UI components (shadcn/ui)
│   ├── admin/          # Admin interface components
│   ├── auth/           # Authentication components
│   └── documentation/  # Documentation components
├── contexts/           # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and business logic
├── pages/              # Application pages/routes
└── config/             # Configuration files`}
          </pre>
        </CardContent>
      </Card>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Component Hierarchies</h2>
      
      <p className="mb-4">The main component hierarchies include:</p>
      
      <Tabs defaultValue="chat" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="chat">Chat Interface</TabsTrigger>
          <TabsTrigger value="admin">Admin Panel</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
        </TabsList>
        
        <TabsContent value="chat">
          <Card>
            <CardContent className="pt-6">
              <pre className="text-sm overflow-auto p-4 bg-muted rounded-md">
{`Index.tsx
├── DocumentSelector
│   └── ModelDropdown
├── ChatInterface
│   ├── ChatMessage
│   ├── ChatInput
│   └── ChatControls
└── DocumentUploader
    └── DropzoneArea`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admin">
          <Card>
            <CardContent className="pt-6">
              <pre className="text-sm overflow-auto p-4 bg-muted rounded-md">
{`Admin.tsx
├── AdminHeader
├── DocumentUpload
│   ├── DropzoneArea
│   └── UploadProgressBar
├── DocumentsList
│   └── DocumentCard
├── SystemPromptManagement
│   ├── PromptList
│   └── PromptForm
└── UserManagement
    └── UserTable`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="auth">
          <Card>
            <CardContent className="pt-6">
              <pre className="text-sm overflow-auto p-4 bg-muted rounded-md">
{`Auth.tsx
├── AuthContext (Provider)
├── LoginForm
│   └── Form components
└── SignupForm
    └── Form components`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link to="/developer/architecture/overview">
          <Button variant="outline">Back to Overview</Button>
        </Link>
        <Link to="/developer/components/core">
          <Button>Explore Components</Button>
        </Link>
      </div>
    </div>
  );
};

export default FrontendArchitecture;
