import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword || !formData.phone) {
      setError("All fields are required");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setError("");
      setSuccessMessage("");
      setIsLoading(true);

      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
      });

      setSuccessMessage("Registration successful! You can now log in.");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-soft-white pt-28 pb-16 px-4">
        <div className="max-w-md w-full space-y-8 bg-warm-beige p-8 rounded-lg shadow-md border border-mint-green">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-charcoal">Create your account</h1>
            <p className="mt-2 text-sm text-charcoal">
              Or{" "}
              <Link to="/login" className="font-medium text-forest-green hover:text-lime-green">
                sign in to your existing account
              </Link>
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-coral-red/10 border border-coral-red text-coral-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-mint-green/20 border border-deep-emerald text-deep-emerald px-4 py-3 rounded-md text-sm flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                {successMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-charcoal">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 border-mint-green focus:border-deep-emerald"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-charcoal">
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 border-mint-green focus:border-deep-emerald"
                />
              </div>
              <div>
                <label htmlFor="phone" className="text-charcoal">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange} 
                  className="mt-1 border-mint-green focus:border-deep-emerald"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-charcoal">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="mt-1 border-mint-green focus:border-deep-emerald"
                />
                <p className="text-xs text-charcoal mt-1">
                  Password must be at least 6 characters long
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword" className="text-charcoal">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 border-mint-green focus:border-deep-emerald"
                />
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="w-full bg-forest-green hover:bg-lime-green text-white px-6 py-3 rounded-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create account"
                )}
              </Button>
            </div>

            <div className="text-center text-sm">
              <p className="mt-2 text-charcoal">
                By creating an account, you agree to our{" "}
                <Link to="#" className="text-forest-green hover:text-lime-green">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="#" className="text-forest-green hover:text-lime-green">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Register;