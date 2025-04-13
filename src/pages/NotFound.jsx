
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FolderX } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
            <FolderX size={48} />
          </div>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-8">
          The page you are looking for doesn't exist or has been moved. 
          Check the URL or navigate back to the homepage.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/">
            <Button size="lg" className="w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
          <Link to="/login">
            <Button 
              size="lg" 
              variant="outline" 
              className="w-full sm:w-auto"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
