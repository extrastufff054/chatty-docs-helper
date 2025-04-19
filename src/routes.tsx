
import { createBrowserRouter } from "react-router-dom";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import AdminAuth from "./pages/AdminAuth";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import Documentation from "./pages/Documentation";
import DeveloperDocs from "./pages/DeveloperDocs";

// Improved router with consistent nesting and organization
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
    path: "/developer/*",
    element: <DeveloperDocs />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
