import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import CampaignCard from "@/components/CampaignCard";
import {
    Wallet,
    TrendingUp,
    PlusCircle,
    ArrowRightCircle,
    Heart,
} from "lucide-react";

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [userStats, setUserStats] = useState({
        totalDonated: 0,
        campaignsSupported: 0,
        campaignsCreated: 0,
    });
    const [recentDonations, setRecentDonations] = useState([]);
    const [userCampaigns, setUserCampaigns] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                // Simulated fetch
                setTimeout(() => {
                    const dummyData = {
                        stats: {
                            totalDonated: 750,
                            campaignsSupported: 5,
                            campaignsCreated: 2,
                        },
                        recentDonations: [
                            {
                                _id: "1",
                                campaignId: "1",
                                campaignTitle: "Clean Water Initiative",
                                amount: 250,
                                date: new Date("2024-01-15").toISOString(),
                            },
                            {
                                _id: "2",
                                campaignId: "3",
                                campaignTitle:
                                    "Community Health Clinic Expansion",
                                amount: 100,
                                date: new Date("2024-02-05").toISOString(),
                            },
                            {
                                _id: "3",
                                campaignId: "5",
                                campaignTitle: "Urban Garden Project",
                                amount: 75,
                                date: new Date("2024-02-20").toISOString(),
                            },
                        ],
                        userCampaigns: [
                            {
                                _id: "7",
                                title: "Education for All",
                                description:
                                    "Providing educational resources and support to underserved communities.",
                                imageUrl:
                                    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
                                category: "Education",
                                goalAmount: 20000,
                                raisedAmount: 5000,
                                daysLeft: 25,
                                backers: 42,
                                createdAt: new Date("2024-01-05").toISOString(),
                                status: "active",
                            },
                            {
                                _id: "8",
                                title: "Youth Coding Camp",
                                description:
                                    "Teaching coding and technology skills to disadvantaged youth.",
                                imageUrl:
                                    "https://images.unsplash.com/photo-1498936178812-4b2e558d2937",
                                category: "Technology",
                                goalAmount: 15000,
                                raisedAmount: 12000,
                                daysLeft: 5,
                                backers: 78,
                                createdAt: new Date("2023-12-10").toISOString(),
                                status: "active",
                            },
                        ],
                    };

                    setUserStats(dummyData.stats);
                    setRecentDonations(dummyData.recentDonations);
                    setUserCampaigns(dummyData.userCampaigns);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <div className="bg-soft-white min-h-screen p-6">
            <div className="mb-6 bg-warm-beige/70 p-4 rounded-lg">
                <h1 className="text-2xl font-bold text-charcoal mb-2">
                    Your Dashboard
                </h1>
                <p className="text-charcoal/80">
                    Welcome back, {currentUser?.name}! Here's an overview of
                    your activity.
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-mint-green">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="h-12 w-12 bg-mint-green/20 rounded-full flex items-center justify-center mr-4">
                                <Wallet
                                    size={24}
                                    className="text-forest-green"
                                />
                            </div>
                            <div>
                                <p className="text-charcoal text-sm">
                                    Total Donated
                                </p>
                                <p className="text-2xl font-bold text-charcoal">
                                    Rs. {userStats.totalDonated}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-mint-green">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="h-12 w-12 bg-coral-red/20 rounded-full flex items-center justify-center mr-4">
                                <Heart size={24} className="text-coral-red" />
                            </div>
                            <div>
                                <p className="text-charcoal text-sm">
                                    Campaigns Supported
                                </p>
                                <p className="text-2xl font-bold text-charcoal">
                                    {userStats.campaignsSupported}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-mint-green">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="h-12 w-12 bg-mint-green/20 rounded-full flex items-center justify-center mr-4">
                                <TrendingUp
                                    size={24}
                                    className="text-forest-green"
                                />
                            </div>
                            <div>
                                <p className="text-charcoal text-sm">
                                    Campaigns Created
                                </p>
                                <p className="text-2xl font-bold text-charcoal">
                                    {userStats.campaignsCreated}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Your Campaigns */}
            <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-charcoal">
                        Your Campaigns
                    </h2>
                    <Link to="/dashboard/create-campaign">
                        <Button className="bg-deep-emerald hover:bg-lime-green text-soft-white flex flex-wrap md:px-4 md:py-2 rounded-full">
                            <PlusCircle size={18} className="mr-2" />
                            Create Campaign
                        </Button>
                    </Link>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[...Array(2)].map((_, index) => (
                            <Card
                                key={index}
                                className="h-[400px] animate-pulse bg-warm-beige"
                            >
                                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                                <CardContent className="p-5">
                                    <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                                    <div className="h-4 bg-gray-200 rounded mb-6 w-5/6"></div>
                                    <div className="h-2 bg-gray-200 rounded mb-4"></div>
                                    <div className="flex justify-between mb-6">
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : userCampaigns.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userCampaigns.map((campaign) => (
                            <CampaignCard
                                key={campaign._id}
                                campaign={campaign}
                            />
                        ))}
                    </div>
                ) : (
                    <Card className="bg-warm-beige border-dashed border-2 border-deep-emerald">
                        <CardContent className="p-10 text-center">
                            <div className="h-16 w-16 bg-lime-green rounded-full flex items-center justify-center mx-auto mb-4">
                                <PlusCircle
                                    size={32}
                                    className="text-soft-white"
                                />
                            </div>
                            <h3 className="text-xl font-medium text-charcoal mb-2">
                                No campaigns yet
                            </h3>
                            <p className="text-deep-emerald mb-6">
                                Create your first campaign and start raising
                                funds for your cause.
                            </p>
                            <Link to="/dashboard/create-campaign">
                                <Button className="bg-deep-emerald hover:bg-lime-green text-soft-white">
                                    Create Your First Campaign
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>

            {/* Recent Donations */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-charcoal">
                        Recent Donations
                    </h2>
                    <Link
                        to="/dashboard/donations"
                        className="text-deep-emerald hover:text-lime-green flex items-center"
                    >
                        View All <ArrowRightCircle size={16} className="ml-1" />
                    </Link>
                </div>

                {isLoading ? (
                    <Card className="bg-warm-beige">
                        <CardContent className="p-0">
                            <div className="animate-pulse">
                                {[...Array(3)].map((_, index) => (
                                    <div
                                        key={index}
                                        className="border-b last:border-0 p-4"
                                    >
                                        <div className="flex justify-between mb-2">
                                            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                                            <div className="h-5 bg-gray-200 rounded w-1/5"></div>
                                        </div>
                                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ) : recentDonations.length > 0 ? (
                    <Card className="bg-soft-white">
                        <CardContent className="p-0">
                            {recentDonations.map((donation, index) => (
                                <div
                                    key={donation._id}
                                    className={`p-4 flex justify-between items-center ${
                                        index < recentDonations.length - 1
                                            ? "border-b"
                                            : ""
                                    }`}
                                >
                                    <div>
                                        <Link
                                            to={`/campaign/${donation.campaignId}`}
                                            className="font-medium text-deep-emerald hover:text-lime-green transition-colors"
                                        >
                                            {donation.campaignTitle}
                                        </Link>
                                        <p className="text-sm text-charcoal">
                                            {new Date(
                                                donation.date
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="font-semibold text-charcoal">
                                        Rs.{donation.amount}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-warm-beige border-dashed border-2 border-deep-emerald">
                        <CardContent className="p-10 text-center">
                            <div className="h-16 w-16 bg-lime-green rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart size={32} className="text-soft-white" />
                            </div>
                            <h3 className="text-xl font-medium text-charcoal mb-2">
                                No donations yet
                            </h3>
                            <p className="text-deep-emerald mb-6">
                                Once you support a campaign, your donations will
                                appear here.
                            </p>
                            <Link to="/">
                                <Button className="bg-deep-emerald hover:bg-lime-green text-soft-white">
                                    Explore Campaigns
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
