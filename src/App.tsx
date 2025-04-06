
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

// App routes with protection
const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public routes */}
      <Route path="/auth" element={<Auth />} />
      <Route path="/documentation" element={<Documentation />} />
      
      {/* User routes - require authentication */}
      <Route path="/" element={<UserRoute element={<Index />} />} />
      
      {/* Admin routes - require admin role */}
      <Route path="/admin" element={
        <ProtectedRoute element={<Admin />} requiredRole="admin" />
      } />
      <Route path="/admin/*" element={
        <ProtectedRoute element={<Admin />} requiredRole="admin" />
      } />
      
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
