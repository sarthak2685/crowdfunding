import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AtSign, Lock, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const location = useLocation();

    // Where to redirect after login
    const from = location.state?.from || "/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        try {
            setError("");
            setIsLoading(true);
            const result = await login(email, password);

            if (!result.success) {
                setError(result.message || "Login failed. Try again.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-soft-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-charcoal">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-charcoal">
                        Or{" "}
                        <Link
                            to="/register"
                            className="font-medium text-forest-green hover:text-lime-green"
                        >
                            create a new account
                        </Link>
                    </p>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <Card className="border-mint-green">
                        <CardHeader>
                            <CardTitle className="text-forest-green">
                                Login
                            </CardTitle>
                            <CardDescription className="text-charcoal">
                                Enter your credentials to access your account
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {error && (
                                <Alert
                                    variant="destructive"
                                    className="mb-6 bg-coral-red/10 border-coral-red"
                                >
                                    <AlertTriangle className="h-4 w-4 text-coral-red" />
                                    <AlertDescription className="text-coral-red">
                                        {error}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="text-charcoal"
                                    >
                                        Email
                                    </Label>
                                    <div className="relative">
                                        <AtSign className="absolute left-3 top-3 h-4 w-4 text-forest-green" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            className="pl-10 border-mint-green focus:border-deep-emerald"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            autoComplete="email"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label
                                            htmlFor="password"
                                            className="text-charcoal"
                                        >
                                            Password
                                        </Label>
                                        <Link
                                            to="/forgot-password"
                                            className="text-sm font-medium text-forest-green hover:text-lime-green"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-forest-green" />
                                        <Input
                                            id="password"
                                            type="password"
                                            placeholder="••••••••"
                                            className="pl-10 border-mint-green focus:border-deep-emerald"
                                            value={password}
                                            onChange={(e) =>
                                                setPassword(e.target.value)
                                            }
                                            autoComplete="current-password"
                                            required
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-forest-green hover:bg-lime-green text-white px-4 py-2 rounded-full"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Signing in..." : "Sign In"}
                                </Button>
                            </form>

                            <div className="mt-6">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-mint-green" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-soft-white text-charcoal">
                                            Demo Credentials
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 border border-mint-green rounded-md p-2 text-xs text-charcoal bg-mint-green/10">
                                    <p>
                                        <strong>Admin:</strong>{" "}
                                        admin@example.com
                                    </p>
                                    <p>
                                        <strong>Password:</strong> admin123
                                    </p>
                                    <p className="mt-1">
                                        <strong>Regular User:</strong>{" "}
                                        user@example.com
                                    </p>
                                    <p>
                                        <strong>Password:</strong> user123
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-center">
                            <p className="text-sm text-charcoal">
                                Don&apos;t have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-medium text-forest-green hover:text-lime-green"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;
