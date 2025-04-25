import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // <- Added Navigate
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Context providers
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/user/Dashboard";
import DonationHistory from "./pages/user/DonationHistory";
import CreateCampaign from "./pages/user/CreateCampaign";
import AdminDashboard from "./pages/admin/Dashboard";
import CampaignApproval from "./pages/admin/CampaignApproval";
import CampaignDetails from "./pages/CampaignDetails";
import NotFound from "./pages/NotFound";

// Layout components
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Redirect wrapper for /login
const LoginRedirectWrapper = () => {
    const { isAuthenticated, currentUser } = useAuth();

    if (isAuthenticated) {
        return <Navigate to={currentUser?.role === "admin" ? "/admin" : "/dashboard"} />;
    }

    return <Login />;
};

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <AuthProvider>
            <TooltipProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />

                <Routes>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginRedirectWrapper />} /> {/* <- Updated */}
                    <Route path="/register" element={<Register />} />
                    <Route path="/campaign/:id" element={<CampaignDetails />} />

                    {/* User routes */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <UserLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<UserDashboard />} />
                        <Route path="donations" element={<DonationHistory />} />
                        <Route path="create-campaign" element={<CreateCampaign />} />
                    </Route>

                    {/* Admin routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<AdminDashboard />} />
                        <Route path="approvals" element={<CampaignApproval />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </TooltipProvider>
        </AuthProvider>
    </QueryClientProvider>
);

export default App;
