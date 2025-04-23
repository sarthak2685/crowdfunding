import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AtSign, Lock, Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const LabeledInput = ({
    icon: Icon,
    label,
    id,
    value,
    onChange,
    type,
    ...props
}) => (
    <div className="space-y-2">
        <Label htmlFor={id} className="text-charcoal">
            {label}
        </Label>
        <div className="relative">
            <Icon className="absolute left-3 top-3 h-4 w-4 text-forest-green" />
            <Input
                id={id}
                type={type}
                className="pl-10 border-mint-green focus:border-deep-emerald focus:ring-2 focus:ring-forest-green/30"
                value={value}
                onChange={onChange}
                {...props}
            />
        </div>
    </div>
);

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);

    const { login } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const from = location.state?.from || "/dashboard";

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error("Please enter both email and password");
            return;
        }

        try {
            setIsLoading(true);
            const result = await login(email, password);

            if (!result.success) {
                toast.error(result.message || "Login failed. Try again.");
            } else {
                toast.success("Login successful!");
                navigate(from);
            }
        } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header />
            <div className="min-h-screen bg-soft-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md mt-16">
                    <h2 className="text-center text-3xl font-extrabold text-charcoal">
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

                <div className="mt-12 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="border-mint-green shadow-lg rounded-2xl p-8 bg-warm-beige">
                        <div className="text-center">
                            <h3 className="text-forest-green text-2xl font-bold">
                                Login
                            </h3>
                            <p className="text-charcoal text-sm">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                            <LabeledInput
                                icon={AtSign}
                                label="Email"
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                required
                            />

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-charcoal">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-forest-green" />
                                    <Input
                                        id="password"
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="••••••••"
                                        className="pl-10 border-mint-green focus:border-deep-emerald focus:ring-2 focus:ring-forest-green/30"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-3 text-forest-green"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        {passwordVisible ? <EyeOff /> : <Eye />}
                                    </button>
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
                                    <strong>Admin:</strong> admin@example.com
                                </p>
                                <p>
                                    <strong>Password:</strong> admin123
                                </p>
                                <p className="mt-1">
                                    <strong>Regular User:</strong> user@example.com
                                </p>
                                <p>
                                    <strong>Password:</strong> user123
                                </p>
                            </div>
                        </div>

                        <div className="text-center mt-6 text-sm">
                            <p className="text-charcoal">
                                Don&apos;t have an account?{" "}
                                <Link
                                    to="/register"
                                    className="font-medium text-forest-green hover:text-lime-green"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Login;