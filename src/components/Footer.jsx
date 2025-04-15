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
        <footer className="bg-gray-900 text-gray-300 pt-12 pb-8 px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
                    {/* Brand Column */}
                    <div className="sm:col-span-2 lg:col-span-1">
                        <Link
                            to="/"
                            className="flex items-center space-x-2 mb-4"
                        >
                            <span className="font-bold text-2xl text-white">
                                Fund
                                <span className="text-mint-green">
                                    Sure
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
                        <h3 className="font-semibold text-lg text-white mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2.5">
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
                                        className="text-gray-400 hover:text-mint-green transition-colors duration-300 text-sm flex items-center"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Categories Column */}
                    <div>
                        <h3 className="font-semibold text-lg text-white mb-4">
                            Categories
                        </h3>
                        <ul className="space-y-2.5">
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
                                        className="text-gray-400 hover:text-mint-green transition-colors duration-300 text-sm flex items-center"
                                    >
                                        {category}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="font-semibold text-lg text-white mb-4">
                            Contact Us
                        </h3>
                        <ul className="space-y-3">
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
                <div className="border-t border-gray-800 mt-10 pt-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-500 text-xs md:text-sm text-center md:text-left">
                            © {new Date().getFullYear()} FundTogether. All
                            rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
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
                                    className="text-gray-500 hover:text-mint-green transition-colors duration-300 text-xs md:text-sm whitespace-nowrap"
                                >
                                    {item}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 text-center text-gray-500 text-xs">
                        <p className="inline-flex items-center">
                            Made with{" "}
                            <Heart
                                size={12}
                                className="mx-1 text-coral-red"
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