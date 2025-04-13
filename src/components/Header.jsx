
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Menu, X, User } from 'lucide-react';

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const getDashboardLink = () => {
    if (isAdmin()) {
      return '/admin';
    }
    return '/dashboard';
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className={`font-bold text-xl ${scrolled ? 'text-primary' : 'text-white'}`}>
              Fund<span className={scrolled ? 'text-secondary' : 'text-orange-300'}>Together</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`${scrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-orange-300'} transition-colors`}
            >
              Home
            </Link>
            <Link 
              to="/#campaigns" 
              className={`${scrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-orange-300'} transition-colors`}
            >
              Campaigns
            </Link>
            <Link 
              to="/#how-it-works" 
              className={`${scrolled ? 'text-gray-700 hover:text-primary' : 'text-white hover:text-orange-300'} transition-colors`}
            >
              How It Works
            </Link>
            {currentUser ? (
              <div className="flex items-center space-x-4">
                <Link to={getDashboardLink()}>
                  <Button variant={scrolled ? "outline" : "secondary"}>
                    Dashboard
                  </Button>
                </Link>
                <Button 
                  variant={scrolled ? "ghost" : "outline"} 
                  className={!scrolled && "text-white border-white hover:bg-white/20 hover:text-white"}
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button 
                    variant={scrolled ? "outline" : "secondary"}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button 
                    variant={scrolled ? "default" : "outline"} 
                    className={!scrolled && "text-white border-white hover:bg-white/20 hover:text-white"}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu} 
            className={`md:hidden ${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white pt-20 px-6">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-primary py-2 text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/#campaigns" 
              className="text-gray-700 hover:text-primary py-2 text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Campaigns
            </Link>
            <Link 
              to="/#how-it-works" 
              className="text-gray-700 hover:text-primary py-2 text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            
            <div className="pt-6 border-t">
              {currentUser ? (
                <>
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <User size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{currentUser.name}</p>
                      <p className="text-sm text-gray-500">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Link 
                      to={getDashboardLink()}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Button className="w-full" variant="outline">
                        Dashboard
                      </Button>
                    </Link>
                    <Button 
                      className="w-full" 
                      variant="ghost" 
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link 
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full" variant="outline">
                      Login
                    </Button>
                  </Link>
                  <Link 
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
