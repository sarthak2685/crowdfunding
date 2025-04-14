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
                scrolled
                    ? "bg-soft-white shadow-md py-2"
                    : "bg-forest-green py-4"
            }`}
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span
                            className={`font-bold text-xl ${
                                scrolled ? "text-charcoal" : "text-soft-white"
                            }`}
                        >
                            Fund
                            <span
                                className={
                                    scrolled
                                        ? "text-deep-emerald"
                                        : "text-mint-green"
                                }
                            >
                                Together
                            </span>
                        </span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center space-x-6">
                        {[
                            { label: "Home", path: "/" },
                            { label: "Campaigns", path: "/campaigns" },
                            { label: "How It Works", path: "/how-it-works" },
                        ].map(({ label, path }) => (
                            <Link
                                key={label}
                                to={path}
                                className={`px-3 py-2 rounded-full transition ${
                                    scrolled
                                        ? "text-charcoal hover:bg-mint-green/20 hover:text-deep-emerald"
                                        : "text-soft-white hover:bg-mint-green/20 hover:text-mint-green"
                                }`}
                            >
                                {label}
                            </Link>
                        ))}

                        {currentUser ? (
                            <>
                                <Link
                                    to="/notifications"
                                    className={`p-2 rounded-full transition ${
                                        scrolled
                                            ? "text-charcoal hover:bg-mint-green/20 hover:text-deep-emerald"
                                            : "text-soft-white hover:bg-mint-green/20 hover:text-mint-green"
                                    }`}
                                >
                                    <Bell size={20} />
                                </Link>

                                <Link to={getDashboardLink()}>
                                    <Button
                                        className={`px-4 py-2 rounded-full transition ${
                                            scrolled
                                                ? "bg-forest-green text-white hover:bg-lime-green"
                                                : "bg-mint-green text-forest-green hover:bg-lime-green hover:text-white"
                                        }`}
                                    >
                                        Dashboard
                                    </Button>
                                </Link>

                                <Avatar className="border-2 border-mint-green">
                                    <AvatarImage
                                        src={currentUser.avatar}
                                        alt="User Avatar"
                                    />
                                    <AvatarFallback className="text-white bg-deep-emerald">
                                        {getInitials()}
                                    </AvatarFallback>
                                </Avatar>

                                <Button
                                    className="px-4 py-2 rounded-full border-coral-red bg-coral-red text-white hover:bg-red-600"
                                    onClick={handleLogout}
                                >
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <Button className="px-4 py-2 rounded-full bg-forest-green text-white hover:bg-lime-green">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/register">
                                    <Button className="px-4 py-2 rounded-full bg-forest-green text-white hover:bg-lime-green">
                                        Sign Up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className={`p-2 md:hidden rounded-full ${
                            scrolled
                                ? "text-charcoal hover:bg-mint-green/20"
                                : "text-soft-white hover:bg-mint-green/20"
                        }`}
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-50 bg-soft-white pt-20 px-6">
                    <nav className="flex flex-col space-y-4">
                        {["Home", "Campaigns", "How It Works"].map(
                            (label, i) => (
                                <Link
                                    key={i}
                                    to={`/${label
                                        .toLowerCase()
                                        .replace(/ /g, "-")}`}
                                    className="px-4 py-3 rounded-full text-charcoal hover:bg-mint-green/20 hover:text-forest-green text-lg"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {label}
                                </Link>
                            )
                        )}

                        <div className="pt-6 border-t border-mint-green">
                            {currentUser ? (
                                <>
                                    <div className="flex items-center space-x-3 mb-6 p-4 bg-mint-green/10 rounded-lg">
                                        <Avatar className="border-2 border-mint-green">
                                            <AvatarImage
                                                src={currentUser.avatar}
                                            />
                                            <AvatarFallback className="bg-deep-emerald text-white">
                                                {getInitials()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium text-charcoal">
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
                                            <Button className="w-full px-4 py-2 rounded-full bg-forest-green text-white hover:bg-lime-green">
                                                Dashboard
                                            </Button>
                                        </Link>
                                        <Button
                                            className="w-full px-4 py-2 rounded-full border-coral-red text-coral-red hover:bg-coral-red/10"
                                            variant="outline"
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
                                            className="w-full px-4 py-2 rounded-full border-forest-green text-forest-green hover:bg-mint-green/20"
                                            variant="outline"
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Button className="w-full px-4 py-2 rounded-full bg-forest-green text-white hover:bg-lime-green">
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
