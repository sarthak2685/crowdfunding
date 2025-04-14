
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, role }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} />;
  }

  // If role is specified and user doesn't have that role, redirect to appropriate page
  if (role && currentUser && role === 'admin' && currentUser.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  // Render children if authenticated and has appropriate role
  return children;
};

export default ProtectedRoute;
