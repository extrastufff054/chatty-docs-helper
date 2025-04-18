
import { useState } from "react";
import { DocumentationLayout } from "@/components/documentation/DocumentationLayout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronRight, Code, FileCode, GitBranch, Layers, Package, Workflow } from "lucide-react";

const DeveloperDocs = () => {
  // Define documentation sections and items
  const docSections = [
    {
      id: "architecture",
      title: "Architecture",
      items: [
        {
          id: "overview",
          title: "System Overview",
          href: "architecture-overview",
          content: <ArchitectureOverviewPreview />
        },
        {
          id: "frontend",
          title: "Frontend Architecture",
          href: "frontend-architecture",
          content: <FrontendArchitecturePreview />
        },
        {
          id: "backend",
          title: "Backend Architecture",
          href: "backend-architecture",
          content: <BackendArchitecturePreview />
        },
        {
          id: "data-flow",
          title: "Data Flow",
          href: "data-flow",
          content: <DataFlowPreview />
        }
      ]
    },
    {
      id: "components",
      title: "Components",
      items: [
        {
          id: "core-components",
          title: "Core Components",
          href: "core-components",
          content: <CoreComponentsPreview />
        },
        {
          id: "ui-components",
          title: "UI Components",
          href: "ui-components",
          content: <div>Detailed UI component documentation with usage examples.</div>
        },
        {
          id: "utilities",
          title: "Utilities & Helpers",
          href: "utilities",
          content: <div>Documentation of utility functions and helper modules.</div>
        }
      ]
    },
    {
      id: "apis",
      title: "APIs & Services",
      items: [
        {
          id: "api-client",
          title: "API Client",
          href: "api-client",
          content: <APIClientPreview />
        },
        {
          id: "document-processor",
          title: "Document Processor",
          href: "document-processor",
          content: <DocumentProcessorPreview />
        },
        {
          id: "auth-services",
          title: "Authentication Services",
          href: "auth-services",
          content: <div>Documentation of authentication services and security mechanisms.</div>
        }
      ]
    },
    {
      id: "development",
      title: "Development Guide",
      items: [
        {
          id: "getting-started",
          title: "Getting Started",
          href: "getting-started",
          content: <GettingStartedPreview />
        },
        {
          id: "workflow",
          title: "Development Workflow",
          href: "development-workflow",
          content: <div>Guidelines for development workflow, branch management, and contributions.</div>
        },
        {
          id: "best-practices",
          title: "Best Practices",
          href: "best-practices",
          content: <div>Best practices for code organization, naming conventions, and architectural patterns.</div>
        },
        {
          id: "common-patterns",
          title: "Common Patterns",
          href: "common-patterns",
          content: <div>Frequently used code patterns and solutions to common problems.</div>
        }
      ]
    },
    {
      id: "function-reference",
      title: "Function Reference",
      items: [
        {
          id: "document-processing-functions",
          title: "Document Processing Functions",
          href: "document-processing-functions",
          content: <div>Detailed reference for document processing functions.</div>
        },
        {
          id: "api-client-functions",
          title: "API Client Functions",
          href: "api-client-functions",
          content: <div>Reference documentation for API client functions.</div>
        },
        {
          id: "auth-functions",
          title: "Authentication Functions",
          href: "auth-functions",
          content: <div>Reference for authentication-related functions.</div>
        },
        {
          id: "utility-functions",
          title: "Utility Functions",
          href: "utility-functions",
          content: <div>Documentation for utility functions and helpers.</div>
        }
      ]
    }
  ];

  return (
    <DocumentationLayout sections={docSections} defaultSectionId="architecture" defaultItemId="overview">
      <h1 className="text-4xl font-bold mb-6">Developer Documentation</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Welcome to the comprehensive developer documentation for the Indian Cybercrime Coordination Centre (I4C) Chatbot project.
        This guide will help you understand the codebase, architecture, and development workflows.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
        <Link to="/developer/architecture/overview" className="no-underline">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Layers className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Architecture</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Understand the system architecture, components, and data flow.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Explore Architecture <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Link>
        
        <Link to="/developer/components/core" className="no-underline">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Package className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Components</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Learn about the core components and UI building blocks.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Components <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Link>
        
        <Link to="/developer/apis/api-client" className="no-underline">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Code className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">APIs & Services</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Explore the API clients, services, and document processing.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Browse APIs <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Link>
        
        <Link to="/developer/guide/getting-started" className="no-underline">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Workflow className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Getting Started</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Set up your development environment and workflow.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              Get Started <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Link>
        
        <Link to="/documentation" className="no-underline">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <FileCode className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">User Documentation</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              View the end-user documentation for reference.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              User Docs <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Link>
        
        <Link to="https://github.com/yourusername/i4c-chatbot" target="_blank" className="no-underline">
          <div className="border rounded-lg p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <GitBranch className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold">Source Code</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Access the project repository and contribute.
            </p>
            <Button variant="outline" size="sm" className="w-full">
              View Repository <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </Link>
      </div>
    </DocumentationLayout>
  );
};

// Preview Components
const ArchitectureOverviewPreview = () => (
  <div>
    <p className="mb-4">
      Explore the high-level architecture, system components, and how they interact.
    </p>
    <Link to="/developer/architecture/overview">
      <Button size="sm">
        View Architecture Details <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </Link>
  </div>
);

const FrontendArchitecturePreview = () => (
  <div>
    <p className="mb-4">
      Learn about the React-based frontend architecture, component structure, and state management.
    </p>
    <Link to="/developer/architecture/frontend">
      <Button size="sm">
        View Frontend Architecture <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </Link>
  </div>
);

const BackendArchitecturePreview = () => (
  <div>
    <p className="mb-4">
      Discover the Flask backend, API endpoints, and integration with AI models.
    </p>
    <Link to="/developer/architecture/backend">
      <Button size="sm">
        View Backend Architecture <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </Link>
  </div>
);

const DataFlowPreview = () => (
  <div>
    <p className="mb-4">
      Follow the data as it flows through the system, from user input to AI-generated responses.
    </p>
    <Link to="/developer/architecture/data-flow">
      <Button size="sm">
        View Data Flow <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </Link>
  </div>
);

const CoreComponentsPreview = () => (
  <div>
    <p className="mb-4">
      Explore the core components that make up the application, their purpose, and interactions.
    </p>
    <Link to="/developer/components/core">
      <Button size="sm">
        View Core Components <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </Link>
  </div>
);

const APIClientPreview = () => (
  <div>
    <p className="mb-4">
      Learn about the API client functions, their usage patterns, and implementation details.
    </p>
    <Link to="/developer/apis/api-client">
      <Button size="sm">
        View API Client <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </Link>
  </div>
);

const DocumentProcessorPreview = () => (
  <div>
    <p className="mb-4">
      Discover how documents are processed, embedded, and made queryable in the application.
    </p>
    <Link to="/developer/apis/document-processor">
      <Button size="sm">
        View Document Processor <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </Link>
  </div>
);

const GettingStartedPreview = () => (
  <div>
    <p className="mb-4">
      Get your development environment set up quickly with this step-by-step guide.
    </p>
    <Link to="/developer/guide/getting-started">
      <Button size="sm">
        Get Started <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </Link>
  </div>
);

export default DeveloperDocs;
