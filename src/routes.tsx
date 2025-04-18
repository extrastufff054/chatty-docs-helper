
import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminAuth from "./pages/AdminAuth";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Documentation from "./pages/Documentation";
import DeveloperDocs from "./pages/DeveloperDocs";
import { 
  ArchitectureOverview, 
  FrontendArchitecture,
  BackendArchitecture,
  DataFlow,
  CoreComponents,
  APIClient,
  DocumentProcessor,
  GettingStarted
} from "./pages/developer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/admin",
    element: <Admin />,
  },
  {
    path: "/admin/auth",
    element: <AdminAuth />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/documentation",
    element: <Documentation />,
  },
  {
    path: "/developer",
    element: <DeveloperDocs />,
  },
  {
    path: "/developer/architecture/overview",
    element: <ArchitectureOverview />,
  },
  {
    path: "/developer/architecture/frontend",
    element: <FrontendArchitecture />,
  },
  {
    path: "/developer/architecture/backend",
    element: <BackendArchitecture />,
  },
  {
    path: "/developer/architecture/data-flow",
    element: <DataFlow />,
  },
  {
    path: "/developer/components/core",
    element: <CoreComponents />,
  },
  {
    path: "/developer/apis/api-client",
    element: <APIClient />,
  },
  {
    path: "/developer/apis/document-processor",
    element: <DocumentProcessor />,
  },
  {
    path: "/developer/guide/getting-started",
    element: <GettingStarted />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
