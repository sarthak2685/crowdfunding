import { Link } from "react-router-dom";
import {
    Heart,
    Facebook,
    Twitter,
    Instagram,
    Mail,
    Phone,
    MapPin,
} from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-forest-green text-soft-white pt-12 pb-6">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-1">
                        <Link
                            to="/"
                            className="flex items-center space-x-2 mb-6"
                        >
                            <span className="font-bold text-xl text-soft-white">
                                Fund
                                <span className="text-mint-green">
                                    Together
                                </span>
                            </span>
                        </Link>
                        <p className="text-mint-green/80 mb-6">
                            Empowering individuals to create change through
                            collective giving.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="#"
                                className="text-mint-green/80 hover:text-soft-white transition-colors"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="#"
                                className="text-mint-green/80 hover:text-soft-white transition-colors"
                            >
                                <Twitter size={20} />
                            </a>
                            <a
                                href="#"
                                className="text-mint-green/80 hover:text-soft-white transition-colors"
                            >
                                <Instagram size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="text-mint-green/80 hover:text-soft-white transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/#campaigns"
                                    className="text-mint-green/80 hover:text-soft-white transition-colors"
                                >
                                    Browse Campaigns
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/#how-it-works"
                                    className="text-mint-green/80 hover:text-soft-white transition-colors"
                                >
                                    How It Works
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/login"
                                    className="text-mint-green/80 hover:text-soft-white transition-colors"
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/register"
                                    className="text-mint-green/80 hover:text-soft-white transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Categories
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/#"
                                    className="text-mint-green/80 hover:text-soft-white transition-colors"
                                >
                                    Education
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/#"
                                    className="text-mint-green/80 hover:text-soft-white transition-colors"
                                >
                                    Medical
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/#"
                                    className="text-mint-green/80 hover:text-soft-white transition-colors"
                                >
                                    Environment
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/#"
                                    className="text-mint-green/80 hover:text-soft-white transition-colors"
                                >
                                    Community
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/#"
                                    className="text-mint-green/80 hover:text-soft-white transition-colors"
                                >
                                    Technology
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-lg mb-4">
                            Contact Us
                        </h3>
                        <ul className="space-y-3">
                            <li className="flex items-start space-x-3">
                                <MapPin
                                    size={18}
                                    className="text-mint-green/80 mt-0.5"
                                />
                                <span className="text-mint-green/80">
                                    123 Funding Street, Charity City, 10001
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone
                                    size={18}
                                    className="text-mint-green/80"
                                />
                                <span className="text-mint-green/80">
                                    (123) 456-7890
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail
                                    size={18}
                                    className="text-mint-green/80"
                                />
                                <span className="text-mint-green/80">
                                    support@fundtogether.com
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-mint-green/20 mt-10 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-mint-green/80 text-sm mb-4 md:mb-0">
                            © 2025 FundTogether. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            <Link
                                to="/#"
                                className="text-mint-green/80 hover:text-soft-white text-sm transition-colors"
                            >
                                Privacy Policy
                            </Link>
                            <Link
                                to="/#"
                                className="text-mint-green/80 hover:text-soft-white text-sm transition-colors"
                            >
                                Terms of Service
                            </Link>
                            <Link
                                to="/#"
                                className="text-mint-green/80 hover:text-soft-white text-sm transition-colors"
                            >
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                    <div className="mt-6 text-center text-mint-green/80 text-sm">
                        <p>
                            Made with{" "}
                            <Heart
                                size={14}
                                className="inline text-coral-red"
                            />{" "}
                            for the community
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
