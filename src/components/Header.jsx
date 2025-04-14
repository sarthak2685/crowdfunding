import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Menu, X, Bell, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Header = () => {
    const { currentUser, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const getDashboardLink = () => {
        return isAdmin ? "/admin" : "/dashboard";
    };

    const getInitials = () => {
        if (!currentUser?.name) return "U";
        return currentUser.name
            .split(" ")
            .map((word) => word[0])
            .join("")
            .toUpperCase();
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
            }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span
                            className={`font-bold text-xl ${
                                scrolled ? "text-primary" : "text-white"
                            }`}
                        >
                            Fund
                            <span
                                className={
                                    scrolled
                                        ? "text-secondary"
                                        : "text-orange-300"
                                }
                            >
                                Together
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            to="/"
                            className={`${
                                scrolled
                                    ? "text-gray-700 hover:text-primary"
                                    : "text-white hover:text-orange-300"
                            } transition`}
                        >
                            Home
                        </Link>
                        <Link
                            to="/#campaigns"
                            className={`${
                                scrolled
                                    ? "text-gray-700 hover:text-primary"
                                    : "text-white hover:text-orange-300"
                            } transition`}
                        >
                            Campaigns
                        </Link>
                        <Link
                            to="/#how-it-works"
                            className={`${
                                scrolled
                                    ? "text-gray-700 hover:text-primary"
                                    : "text-white hover:text-orange-300"
                            } transition`}
                        >
                            How It Works
                        </Link>

                        {currentUser ? (
                            <>
                                <Link
                                    to="/notifications"
                                    className={`${
                                        scrolled
                                            ? "text-gray-700"
                                            : "text-white"
                                    } hover:text-primary`}
                                >
                                    <Bell size={20} />
                                </Link>

                                <Link to={getDashboardLink()}>
                                    <Button
                                        variant={
                                            scrolled ? "outline" : "secondary"
                                        }
                                    >
                                        Dashboard
                                    </Button>
                                </Link>

                                <Avatar>
                                    <AvatarImage
                                        src={currentUser.avatar}
                                        alt="User Avatar"
                                    />
                                    <AvatarFallback>
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>

                                <Button
                                    variant={scrolled ? "ghost" : "outline"}
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button
                                        variant={
                                            scrolled ? "outline" : "secondary"
                                        }
                                    >
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button
                                        variant={
                                            scrolled ? "default" : "outline"
                                        }
                                    >
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`md:hidden ${
                            scrolled ? "text-gray-700" : "text-white"
                        }`}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-white pt-20 px-6">
                    <nav className="flex flex-col space-y-4">
                        {["Home", "Campaigns", "How It Works"].map(
                            (label, i) => (
                                <Link
                                    key={i}
                                    to={`/${label
                                        .toLowerCase()
                                        .replace(/ /g, "-")}`}
                                    className="text-gray-700 hover:text-primary text-lg py-2"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {label}
                                </Link>
                            )
                        )}

                        <div className="pt-6 border-t">
                            {currentUser ? (
                                <>
                                    <div className="flex items-center space-x-3 mb-6">
                                        <Avatar>
                                            <AvatarImage
                                                src={currentUser.avatar}
                                            />
                                            <AvatarFallback>
                                                {getInitials()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">
                                                {currentUser.name}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {currentUser.email}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Link
                                            to={getDashboardLink()}
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                        >
                                            <Button
                                                className="w-full"
                                                variant="outline"
                                            >
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
                                        <Button
                                            className="w-full"
                                            variant="outline"
                                        >
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
