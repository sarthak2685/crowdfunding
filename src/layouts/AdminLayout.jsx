import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
    LayoutDashboard,
    CheckCircle,
    Settings,
    User,
    LogOut,
    Menu,
    X,
    Shield,
} from "lucide-react";

const AdminLayout = () => {
    const { currentUser, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        {
            name: "Admin Dashboard",
            path: "/admin",
            icon: <LayoutDashboard size={20} />,
        },
        {
            name: "Campaign Approvals",
            path: "/admin/approvals",
            icon: <CheckCircle size={20} />,
        },
    ];

    const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

    return (
        <div className="min-h-screen bg-soft-white text-charcoal">
            {/* Mobile Header */}
            <div className="md:hidden bg-forest-green shadow-sm py-4 px-6 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <span className="font-bold text-xl text-white">
                        Fund<span className="text-mint-green">Sure</span>
                    </span>
                </div>
                <button
                    onClick={toggleMobileMenu}
                    className="text-white focus:outline-none"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden fixed inset-0 z-50 bg-white pt-16 px-6">
                    <div className="space-y-6">
                        <div className="border-b pb-4">
                            <div className="flex items-center space-x-3 mb-6">
                                <div className="h-10 w-10 rounded-full bg-forest-green/10 flex items-center justify-center text-forest-green">
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <p className="font-medium">
                                        {currentUser?.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Admin
                                    </p>
                                </div>
                            </div>
                        </div>
                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-3 py-3 rounded-md ${
                                        isActive(item.path)
                                            ? "bg-forest-green text-white"
                                            : "text-charcoal hover:bg-mint-green/40"
                                    }`}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.icon}
                                    <span>{item.name}</span>
                                </Link>
                            ))}
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center space-x-3 px-3 py-3 rounded-md text-coral-red hover:bg-coral-red/10"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </nav>
                    </div>
                </div>
            )}

            {/* Desktop Layout */}
            <div className="flex">
                {/* Sidebar */}
                <aside className="hidden md:flex fixed top-0 left-0 flex-col w-64 h-screen border-r bg-white z-40">
                    <div className="p-5 border-b">
                        <div className="flex items-center space-x-2">
                            <span className="font-bold text-xl text-forest-green">
                                Fund
                                <span className="text-mint-green">
                                    Sure
                                </span>
                            </span>
                        </div>
                    </div>
                    <div className="p-5 border-b bg-warm-beige">
                        <div className="flex items-center space-x-2">
                            <div className="h-10 w-10 rounded-full bg-forest-green/20 flex items-center justify-center text-forest-green">
                                <Shield size={20} />
                            </div>
                            <div>
                                <p className="font-semibold text-forest-green">
                                    Admin Panel
                                </p>
                                <p className="text-xs text-gray-500">
                                    Manage platform
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex-1 py-6 px-4 space-y-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-3 rounded-md ${
                                    isActive(item.path)
                                        ? "bg-forest-green text-white"
                                        : "text-charcoal hover:bg-mint-green/40"
                                }`}
                            >
                                {item.icon}
                                <span>{item.name}</span>
                            </Link>
                        ))}
                    </div>
                    <div className="p-4 border-t">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="h-10 w-10 rounded-full bg-forest-green/10 flex items-center justify-center text-forest-green">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="font-medium">
                                    {currentUser?.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {currentUser?.email}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center space-x-3 px-3 py-2 rounded-md text-coral-red hover:bg-coral-red/10"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-64 p-6 md:p-8 overflow-y-auto bg-soft-white">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
