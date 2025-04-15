import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-soft-white pt-28 pb-16 px-4">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="h-20 w-20 bg-coral-red/10 rounded-full flex items-center justify-center text-coral-red">
              <AlertTriangle size={40} />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-charcoal mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-charcoal mb-4">
            Page Not Found
          </h2>
          <p className="text-charcoal mb-8">
            The page at <code className="bg-mint-green/20 px-2 py-1 rounded">{location.pathname}</code> doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/">
              <Button className="bg-forest-green hover:bg-lime-green text-white px-6 py-3 rounded-full">
                Return to Home
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="border-forest-green text-forest-green hover:bg-mint-green/20 px-6 py-3 rounded-full">
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;