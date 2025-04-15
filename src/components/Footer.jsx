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
        <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-1">
                        <Link
                            to="/"
                            className="flex items-center space-x-2 mb-6"
                        >
                            <span className="font-bold text-2xl text-white">
                                Fund
                                <span className="text-mint-green">
                                    Together
                                </span>
                            </span>
                        </Link>
                        <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                            Empowering individuals to create meaningful change
                            through collective giving and community support.
                        </p>
                        <div className="flex space-x-5">
                            <a
                                href="#"
                                className="text-gray-400 hover:text-mint-green transition-colors duration-300"
                                aria-label="Facebook"
                            >
                                <Facebook
                                    size={20}
                                    className="text-mint-green"
                                />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-mint-green transition-colors duration-300"
                                aria-label="Twitter"
                            >
                                <Twitter
                                    size={20}
                                    className="text-mint-green"
                                />
                            </a>
                            <a
                                href="#"
                                className="text-gray-400 hover:text-mint-green transition-colors duration-300"
                                aria-label="Instagram"
                            >
                                <Instagram
                                    size={20}
                                    className="text-mint-green"
                                />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h3 className="font-semibold text-lg text-white mb-5">
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            {[
                                { name: "Home", path: "/" },
                                {
                                    name: "Browse Campaigns",
                                    path: "/campaigns",
                                },
                                { name: "How It Works", path: "/how-it-works" },
                                { name: "Login", path: "/login" },
                                { name: "Sign Up", path: "/register" },
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        to={item.path}
                                        className="text-gray-400 hover:text-mint-green transition-colors duration-300 text-sm"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories Column */}
                    <div>
                        <h3 className="font-semibold text-lg text-white mb-5">
                            Categories
                        </h3>
                        <ul className="space-y-3">
                            {[
                                "Education",
                                "Medical",
                                "Environment",
                                "Community",
                                "Technology",
                            ].map((category) => (
                                <li key={category}>
                                    <Link
                                        to={`/categories/${category.toLowerCase()}`}
                                        className="text-gray-400 hover:text-mint-green transition-colors duration-300 text-sm"
                                    >
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="font-semibold text-lg text-white mb-5">
                            Contact Us
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin
                                    size={18}
                                    className="text-mint-green mt-0.5 flex-shrink-0"
                                />
                                <span className="text-gray-400 text-sm">
                                    123 Funding Street, Charity City, 10001
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone
                                    size={18}
                                    className="text-mint-green flex-shrink-0"
                                />
                                <span className="text-gray-400 text-sm">
                                    (123) 456-7890
                                </span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail
                                    size={18}
                                    className="text-mint-green flex-shrink-0"
                                />
                                <a
                                    href="mailto:support@fundtogether.com"
                                    className="text-gray-400 hover:text-mint-green transition-colors duration-300 text-sm"
                                >
                                    support@fundtogether.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="border-t border-gray-800 mt-12 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-500 text-xs md:text-sm mb-4 md:mb-0">
                            © {new Date().getFullYear()} FundTogether. All
                            rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            {[
                                "Privacy Policy",
                                "Terms of Service",
                                "Cookie Policy",
                            ].map((item) => (
                                <Link
                                    key={item}
                                    to={`/${item
                                        .toLowerCase()
                                        .replace(/\s+/g, "-")}`}
                                    className="text-gray-500 hover:text-mint-green transition-colors duration-300 text-xs md:text-sm"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="mt-6 text-center text-gray-500 text-xs">
                        <p>
                            Made with{" "}
                            <Heart
                                size={12}
                                className="inline text-coral-red mx-0.5"
                            />{" "}
                            by the FundTogether community
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
