import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CampaignCard from "@/components/CampaignCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import {
    Search,
    LightbulbIcon,
    Rocket,
    Heart,
    TrendingUp,
    Users,
    Landmark,
    Baby,
    User2,
} from "lucide-react";
import EmergencyCampaigns from "./user/EmergencyCampaigns";
import Chatbot from "./Chatbot";

const LandingPage = () => {
    const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
    const [categories, setCategories] = useState([
        "All",
        "Education",
        "Medical",
        "Environment",
        "Community",
        "Technology",
        "Elderly Care",
        "Child Welfare",
    ]);
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token);
        const fetchCampaigns = async () => {
            try {
                setIsLoading(true);

                const apiUrl = `${import.meta.env.VITE_API_URL}/campaigns`;
                const queryParams = new URLSearchParams();

                if (selectedCategory !== "All") {
                    queryParams.append("category", selectedCategory);
                }

                if (searchQuery) {
                    queryParams.append("search", searchQuery);
                }

                const fullUrl = `${apiUrl}?${queryParams.toString()}`;

                const response = await fetch(fullUrl);

                if (!response.ok) {
                    throw new Error("Failed to fetch campaigns");
                }

                const data = await response.json();

                if (data.success) {
                    setFeaturedCampaigns(data.data);
                } else {
                    const dummyCampaigns = [
                        {
                            _id: "1",
                            title: "Clean Water Initiative",
                            description:
                                "Providing clean drinking water to communities in need through sustainable water filtration systems.",
                            imageUrl:
                                "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
                            category: "Environment",
                            goalAmount: 50000,
                            raisedAmount: 32500,
                            daysLeft: 15,
                            backers: 128,
                            createdAt: new Date("2023-12-15").toISOString(),
                        },
                        {
                            _id: "2",
                            title: "Educational Scholarships for Underserved Youth",
                            description:
                                "Funding scholarships for talented students from low-income families to pursue higher education.",
                            imageUrl:
                                "https://images.unsplash.com/photo-1501854140801-50d01698950b",
                            category: "Education",
                            goalAmount: 75000,
                            raisedAmount: 45000,
                            daysLeft: 30,
                            backers: 210,
                            createdAt: new Date("2023-11-10").toISOString(),
                        },
                        {
                            _id: "3",
                            title: "Community Health Clinic Expansion",
                            description:
                                "Expanding our local health clinic to serve more patients with improved facilities and equipment.",
                            imageUrl:
                                "https://images.unsplash.com/photo-1605810230434-7631ac76ec81",
                            category: "Medical",
                            goalAmount: 100000,
                            raisedAmount: 87500,
                            daysLeft: 10,
                            backers: 312,
                            createdAt: new Date("2023-12-01").toISOString(),
                        },
                        {
                            _id: "4",
                            title: "Tech Innovation Hub",
                            description:
                                "Creating a space for young innovators to develop solutions to local problems using technology.",
                            imageUrl:
                                "https://images.unsplash.com/photo-1519389950473-47ba0277781c",
                            category: "Technology",
                            goalAmount: 120000,
                            raisedAmount: 60000,
                            daysLeft: 45,
                            backers: 175,
                            createdAt: new Date("2023-10-20").toISOString(),
                        },
                        {
                            _id: "5",
                            title: "Sunset Haven: Elderly Care Facility",
                            description:
                                "Creating a comfortable and caring environment for seniors who need specialized attention and community.",
                            imageUrl:
                                "https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c",
                            category: "Elderly Care",
                            goalAmount: 80000,
                            raisedAmount: 25000,
                            daysLeft: 40,
                            backers: 85,
                            createdAt: new Date("2023-11-28").toISOString(),
                        },
                        {
                            _id: "6",
                            title: "Bright Futures: Child Welfare Center",
                            description:
                                "Supporting orphaned children with education, healthcare, and a loving community to help them thrive.",
                            imageUrl:
                                "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c",
                            category: "Child Welfare",
                            goalAmount: 60000,
                            raisedAmount: 30000,
                            daysLeft: 25,
                            backers: 120,
                            createdAt: new Date("2023-12-05").toISOString(),
                        },
                    ];

                    setFeaturedCampaigns(dummyCampaigns);
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching campaigns:", error);
                toast({
                    title: "Error loading campaigns",
                    description:
                        "We couldn't load the campaigns at this time. Please try again later.",
                    variant: "destructive",
                });

                // Use dummy data on error
                const dummyCampaigns = [
                    // ... keep existing code (dummy campaign data)
                ];

                setFeaturedCampaigns(dummyCampaigns);
                setIsLoading(false);
            }
        };

        fetchCampaigns();
    }, [selectedCategory, searchQuery, toast]);

    const handleStartCampaign = () => {
        if (isAuthenticated) {
            navigate("/dashboard/create-campaign");
        } else {
            navigate("/login");
        }
    };

    const filteredCampaigns = featuredCampaigns.filter((campaign) => {
        const matchesCategory =
            selectedCategory === "All" ||
            campaign.category === selectedCategory;
        const matchesSearch =
            campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    return (
        <>
            <Header />
            <Chatbot />

            {/* Hero Section */}
            <section className="bg-forest-green text-soft-white pt-28 pb-20 md:pt-40 md:pb-32">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
                        Fund Ideas that Change the World
                    </h1>
                    <p
                        className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto animate-fade-in"
                        style={{ animationDelay: "0.2s" }}
                    >
                        Join our community of changemakers and bring meaningful
                        projects to life through collective funding.
                    </p>
                    <div
                        className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in"
                        style={{ animationDelay: "0.4s" }}
                    >
                        <Button
                            size="lg"
                            className="bg-mint-green text-forest-green hover:bg-lime-green px-6 py-3 rounded-full"
                            onClick={handleStartCampaign}
                        >
                            Start a Campaign
                        </Button>

                        <Button
                            size="lg"
                            variant="outline"
                            className="border-soft-white text-soft-white hover:bg-mint-green/20 px-6 py-3 rounded-full"
                            onClick={() => {
                                setSelectedCategory("All");
                                document
                                    .getElementById("campaigns")
                                    .scrollIntoView({
                                        behavior: "smooth",
                                    });
                            }}
                        >
                            Explore Campaigns
                        </Button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-12 bg-soft-white">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 rounded-lg bg-warm-beige hover:shadow-md transition-all">
                            <div className="text-4xl font-bold text-forest-green mb-2">
                                ₹1.2M+
                            </div>
                            <p className="text-charcoal">Funds Raised</p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-warm-beige hover:shadow-md transition-all">
                            <div className="text-4xl font-bold text-forest-green mb-2">
                                250+
                            </div>
                            <p className="text-charcoal">
                                Successful Campaigns
                            </p>
                        </div>
                        <div className="text-center p-6 rounded-lg bg-warm-beige hover:shadow-md transition-all">
                            <div className="text-4xl font-bold text-forest-green mb-2">
                                10K+
                            </div>
                            <p className="text-charcoal">Community Members</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Emergency Campaigns Section */}
            <EmergencyCampaigns />
            {/* Featured Campaigns Section */}
            <section id="campaigns" className="py-16 bg-soft-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-3xl font-bold mb-4 text-charcoal">
                            Explore Campaigns
                        </h2>
                        <p className="text-charcoal max-w-2xl mx-auto">
                            Discover meaningful projects that need your support.
                            Every contribution makes a difference.
                        </p>
                    </div>

                    {/* Search and Filters */}
                    <div
                        className="mb-10 animate-fade-in"
                        style={{ animationDelay: "0.2s" }}
                    >
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-5 w-5 text-forest-green" />
                                <Input
                                    type="text"
                                    placeholder="Search campaigns..."
                                    className="pl-10 border-mint-green focus:border-deep-emerald"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                            <div className="flex-shrink-0">
                                <Tabs
                                    defaultValue="All"
                                    value={selectedCategory}
                                    onValueChange={setSelectedCategory}
                                    className="w-full md:w-auto"
                                >
                                    <TabsList className="bg-mint-green/20 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 w-full md:w-auto">
                                        {categories.map((category) => (
                                            <TabsTrigger
                                                key={category}
                                                value={category}
                                                className="data-[state=active]:bg-forest-green data-[state=active]:text-white px-3 py-2 rounded-full text-xs md:text-sm"
                                            >
                                                {category}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>
                                </Tabs>
                            </div>
                        </div>
                    </div>

                    {/* Campaigns Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[...Array(6)].map((_, index) => (
                                <Card
                                    key={index}
                                    className="h-[400px] animate-pulse border-mint-green"
                                >
                                    <div className="h-48 bg-mint-green/20 rounded-t-lg"></div>
                                    <CardContent className="p-5">
                                        <div className="h-6 bg-mint-green/20 rounded mb-4 w-3/4"></div>
                                        <div className="h-4 bg-mint-green/20 rounded mb-2 w-full"></div>
                                        <div className="h-4 bg-mint-green/20 rounded mb-6 w-5/6"></div>
                                        <div className="h-2 bg-mint-green/20 rounded mb-4"></div>
                                        <div className="flex justify-between mb-6">
                                            <div className="h-4 bg-mint-green/20 rounded w-1/4"></div>
                                            <div className="h-4 bg-mint-green/20 rounded w-1/4"></div>
                                        </div>
                                        <div className="flex justify-between">
                                            <div className="h-4 bg-mint-green/20 rounded w-1/5"></div>
                                            <div className="h-4 bg-mint-green/20 rounded w-1/5"></div>
                                            <div className="h-4 bg-mint-green/20 rounded w-1/5"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredCampaigns.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredCampaigns.map((campaign) => (
                                <CampaignCard
                                    key={campaign._id}
                                    campaign={campaign}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <h3 className="text-xl font-medium text-charcoal mb-2">
                                No campaigns found
                            </h3>
                            <p className="text-charcoal mb-6">
                                Try changing your search criteria or check back
                                later for new campaigns.
                            </p>
                            <Button
                                variant="outline"
                                className="border-forest-green text-forest-green hover:bg-mint-green/20 px-4 py-2 rounded-full"
                                onClick={() => {
                                    setSearchQuery("");
                                    setSelectedCategory("All");
                                }}
                            >
                                Clear Filters
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 bg-warm-beige">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-3xl font-bold mb-4 text-charcoal">
                            How It Works
                        </h2>
                        <p className="text-charcoal max-w-2xl mx-auto">
                            Whether you're starting a campaign or supporting
                            one, our platform makes it easy to create change.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div
                            className="text-center bg-soft-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all animate-fade-in"
                            style={{ animationDelay: "0.1s" }}
                        >
                            <div className="h-16 w-16 bg-mint-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <LightbulbIcon
                                    size={28}
                                    className="text-forest-green"
                                />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-charcoal">
                                1. Create a Campaign
                            </h3>
                            <p className="text-charcoal">
                                Share your idea, set a funding goal, and tell
                                your story to inspire others to contribute.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div
                            className="text-center bg-soft-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all animate-fade-in"
                            style={{ animationDelay: "0.2s" }}
                        >
                            <div className="h-16 w-16 bg-mint-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Users
                                    size={28}
                                    className="text-forest-green"
                                />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-charcoal">
                                2. Gather Support
                            </h3>
                            <p className="text-charcoal">
                                Spread the word and collect contributions from
                                people who believe in your cause.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div
                            className="text-center bg-soft-white p-6 rounded-lg shadow-sm hover:shadow-md transition-all animate-fade-in"
                            style={{ animationDelay: "0.3s" }}
                        >
                            <div className="h-16 w-16 bg-mint-green/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Rocket
                                    size={28}
                                    className="text-forest-green"
                                />
                            </div>
                            <h3 className="text-xl font-semibold mb-3 text-charcoal">
                                3. Make It Happen
                            </h3>
                            <p className="text-charcoal">
                                Receive your funds, bring your project to life,
                                and share updates with your supporters.
                            </p>
                        </div>
                    </div>

                    <div
                        className="text-center mt-12 animate-fade-in"
                        style={{ animationDelay: "0.4s" }}
                    >
                        <Button
                            size="lg"
                            className="bg-forest-green hover:bg-lime-green text-white px-6 py-3 rounded-full cursor-pointer"
                            onClick={handleStartCampaign}
                        >
                            Start Your Campaign
                        </Button>
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-soft-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-12 animate-fade-in">
                        <h2 className="text-3xl font-bold mb-4 text-charcoal">
                            Fund What Matters
                        </h2>
                        <p className="text-charcoal max-w-2xl mx-auto">
                            Explore different categories of campaigns or
                            contribute to the causes that resonate with you.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Education Category */}
                        <div
                            className="bg-warm-beige rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
                            style={{ animationDelay: "0.1s" }}
                        >
                            <div className="h-36 bg-gradient-to-r from-deep-emerald to-forest-green flex items-center justify-center">
                                <Landmark
                                    size={48}
                                    className="text-soft-white"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-semibold text-lg mb-2 text-charcoal">
                                    Education
                                </h3>
                                <p className="text-charcoal text-sm mb-4">
                                    Support educational initiatives,
                                    scholarships, and learning resources.
                                </p>
                                <Button
                                    variant="link"
                                    className="text-forest-green hover:text-lime-green p-0 h-auto text-sm font-medium"
                                    onClick={() => {
                                        setSelectedCategory("Education");
                                        document
                                            .getElementById("campaigns")
                                            .scrollIntoView({
                                                behavior: "smooth",
                                            });
                                    }}
                                >
                                    Explore Education Campaigns →
                                </Button>
                            </div>
                        </div>

                        {/* Medical Category */}
                        <div
                            className="bg-warm-beige rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
                            style={{ animationDelay: "0.2s" }}
                        >
                            <div className="h-36 bg-gradient-to-r from-forest-green to-mint-green flex items-center justify-center">
                                <Heart size={48} className="text-soft-white" />
                            </div>
                            <div className="p-6">
                                <h3 className="font-semibold text-lg mb-2 text-charcoal">
                                    Medical
                                </h3>
                                <p className="text-charcoal text-sm mb-4">
                                    Fund medical treatments, healthcare
                                    projects, and medical research.
                                </p>
                                <Button
                                    variant="link"
                                    className="text-forest-green hover:text-lime-green p-0 h-auto text-sm font-medium"
                                    onClick={() => {
                                        setSelectedCategory("Medical");
                                        document
                                            .getElementById("campaigns")
                                            .scrollIntoView({
                                                behavior: "smooth",
                                            });
                                    }}
                                >
                                    Explore Medical Campaigns →
                                </Button>
                            </div>
                        </div>

                        {/* Elderly Care Category */}
                        <div
                            className="bg-warm-beige rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
                            style={{ animationDelay: "0.3s" }}
                        >
                            <div className="h-36 bg-gradient-to-r from-mint-green to-lime-green flex items-center justify-center">
                                <Users
                                    size={48}
                                    className="text-forest-green"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="font-semibold text-lg mb-2 text-charcoal">
                                    Elderly Care
                                </h3>
                                <p className="text-charcoal text-sm mb-4">
                                    Support initiatives for elderly care,
                                    retirement homes, and senior programs.
                                </p>
                                <Button
                                    variant="link"
                                    className="text-forest-green hover:text-lime-green p-0 h-auto text-sm font-medium"
                                    onClick={() => {
                                        setSelectedCategory("Elderly Care");
                                        document
                                            .getElementById("campaigns")
                                            .scrollIntoView({
                                                behavior: "smooth",
                                            });
                                    }}
                                >
                                    Explore Elderly Care Campaigns →
                                </Button>
                            </div>
                        </div>

                        {/* Child Welfare Category */}
                        <div
                            className="bg-warm-beige rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-fade-in"
                            style={{ animationDelay: "0.4s" }}
                        >
                            <div className="h-36 bg-gradient-to-r from-lime-green to-deep-emerald flex items-center justify-center">
                                <Baby size={48} className="text-soft-white" />
                            </div>
                            <div className="p-6">
                                <h3 className="font-semibold text-lg mb-2 text-charcoal">
                                    Child Welfare
                                </h3>
                                <p className="text-charcoal text-sm mb-4">
                                    Support orphanages, child education, and
                                    welfare programs for children in need.
                                </p>
                                <Button
                                    variant="link"
                                    className="text-forest-green hover:text-lime-green p-0 h-auto text-sm font-medium"
                                    onClick={() => {
                                        setSelectedCategory("Child Welfare");
                                        document
                                            .getElementById("campaigns")
                                            .scrollIntoView({
                                                behavior: "smooth",
                                            });
                                    }}
                                >
                                    Explore Child Welfare Campaigns →
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
          {!isAuthenticated && (
  <section className="py-16 bg-forest-green text-soft-white">
    <div className="container mx-auto px-6">
      <div className="max-w-3xl mx-auto text-center animate-fade-in">
        <h2 className="text-3xl font-bold mb-6">
          Ready to Make a Difference?
        </h2>
        <p className="text-xl mb-10">
          Join our community of changemakers and start your journey today.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/register">
            <Button
              size="lg"
              className="bg-mint-green text-forest-green hover:bg-lime-green px-6 py-3 rounded-full"
            >
              Create Account
            </Button>
          </Link>
          <Link to="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-soft-white text-soft-white hover:bg-mint-green/20 px-6 py-3 rounded-full"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
)}

            
            {/* <section className="py-16 bg-forest-green text-soft-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-3xl mx-auto text-center animate-fade-in">
                        <h2 className="text-3xl font-bold mb-6">
                            Ready to Make a Difference?
                        </h2>
                        <p className="text-xl mb-10">
                            Join our community of changemakers and start your
                            journey today.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <Link to="/register">
                                <Button
                                    size="lg"
                                    className="bg-mint-green text-forest-green hover:bg-lime-green px-6 py-3 rounded-full"
                                >
                                    Create Account
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="border-soft-white text-soft-white hover:bg-mint-green/20 px-6 py-3 rounded-full"
                                >
                                    Login
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section> */}

            <Footer />
        </>
    );
};

export default LandingPage;
