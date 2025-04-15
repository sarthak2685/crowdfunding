import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FolderX } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const NotFound = () => {
    return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center bg-soft-white px-4 pt-28 pb-16">
                <div className="text-center">
                    <div className="flex justify-center mb-6">
                        <div className="h-24 w-24 bg-mint-green/20 rounded-full flex items-center justify-center text-forest-green">
                            <FolderX size={48} />
                        </div>
                    </div>
                    <h1 className="text-6xl font-bold text-charcoal mb-4">
                        404
                    </h1>
                    <h2 className="text-2xl font-semibold text-charcoal mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-charcoal max-w-md mx-auto mb-8">
                        The page you are looking for doesn't exist or has been
                        moved. Check the URL or navigate back to the homepage.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/">
                            <Button
                                size="lg"
                                className="w-full sm:w-auto bg-forest-green hover:bg-lime-green text-white px-6 py-3 rounded-full"
                            >
                                Back to Home
                            </Button>
                        </Link>
                        <Link to="/login">
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full sm:w-auto border-forest-green text-forest-green hover:bg-mint-green/20 px-6 py-3 rounded-full"
                            >
                                Login
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
