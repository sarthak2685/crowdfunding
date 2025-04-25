import { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");

            if (token) {
                try {
                    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
                    const response = await fetch(`${apiUrl}/auth/me`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.ok) {
                        const userData = await response.json();
                        if (userData.success && userData.data) {
                            setCurrentUser(userData.data);
                            setIsAuthenticated(true);
                        } else {
                            localStorage.removeItem("token");
                        }
                    } else {
                        localStorage.removeItem("token");
                    }
                } catch (error) {
                    console.error("Auth verification error:", error);
                    localStorage.removeItem("token");
                }
            }

            setLoading(false);
        };

        verifyToken();
    }, []);

    const login = async (email, password) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const response = await fetch(`${apiUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem("token", data.token);
                setCurrentUser(data.user);
                setIsAuthenticated(true);

                toast({
                    title: "Login Successful",
                    description: `Welcome back, ${data.user.name}!`,
                });

                // Wait for state update, then navigate
                setTimeout(() => {
                    if (data.user.role === "admin") {
                        navigate("/admin");
                    } else {
                        navigate("/dashboard");
                    }
                }, 0);

                return { success: true };
            } else {
                toast({
                    title: "Login Failed",
                    description: data.message || "Invalid credentials",
                    variant: "destructive",
                });
                return { success: false, message: data.message || "Invalid credentials" };
            }
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Login Error",
                description: "Could not connect to the server. Please try again later.",
                variant: "destructive",
            });
            return { success: false, message: "Server connection error" };
        }
    };

    const register = async ({ name, email, password, phone }) => {
        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const response = await fetch(`${apiUrl}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, phone }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem("token", data.token);
                setCurrentUser(data.user);
                setIsAuthenticated(true);

                toast({
                    title: "Registration Successful",
                    description: `Welcome, ${data.user.name}!`,
                });

                navigate("/dashboard");
                return { success: true };
            } else {
                toast({
                    title: "Registration Failed",
                    description: data.message || "Failed to create account",
                    variant: "destructive",
                });
                return { success: false, message: data.message || "Registration failed" };
            }
        } catch (error) {
            console.error("Registration error:", error);
            toast({
                title: "Registration Error",
                description: "Could not connect to the server. Please try again later.",
                variant: "destructive",
            });
            return { success: false, message: "Server connection error" };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setCurrentUser(null);
        setIsAuthenticated(false);
        navigate("/login");

        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
    };

    const value = {
        currentUser,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        isAdmin: currentUser?.role === "admin",
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
