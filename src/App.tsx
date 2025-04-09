
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Route guard for protected routes
const ProtectedRoute = ({ 
  element, 
  requiredRole 
}: { 
  element: JSX.Element, 
  requiredRole?: "admin" | "user" | "moderator" 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  return element;
};

// Regular user route - requires authentication but no specific role
const UserRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  return element;
};

// Admin token route - specifically for admin access using tokens
const AdminTokenRoute = ({ element }: { element: JSX.Element }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  // If logged in but not an admin, redirect to home
  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  // If not authenticated or not an admin, don't render the admin component
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/admin-auth" replace />;
  }
  
  return element;
};

// App routes with protection
const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/documentation" element={<Documentation />} />
      <Route path="/admin-auth" element={<AdminAuth />} />
      
      {/* User routes - require authentication */}
      <Route path="/" element={<UserRoute element={<Index />} />} />
      
      {/* Admin routes - use token-based authentication only */}
      <Route path="/admin" element={<AdminTokenRoute element={<Admin />} />} />
      <Route path="/admin/*" element={<AdminTokenRoute element={<Admin />} />} />
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

const App = () => (
  <ThemeProvider defaultTheme="system">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <AppRoutes />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
