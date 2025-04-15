import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Calendar,
    Users,
    Target,
    Heart,
    Share2,
    User,
    Clock,
    AlertCircle,
    CheckCircle,
    Loader2,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const CampaignDetails = () => {
    const { id } = useParams();
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [campaign, setCampaign] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [donationAmount, setDonationAmount] = useState("10");
    const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
    const [isDonating, setIsDonating] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                setIsLoading(true);
                // Simulated fetch with dummy data
                setTimeout(() => {
                    const dummyCampaign = {
                        _id: id,
                        title: "Clean Water Initiative",
                        description:
                            "Providing clean drinking water to communities in need through sustainable water filtration systems.",
                        longDescription: `
              <p>Access to clean water is a fundamental human right, yet millions around the world still lack this basic necessity. Our project aims to install sustainable water filtration systems in communities facing severe water scarcity and contamination issues.</p>
              
              <p>With your support, we will:</p>
              <ul>
                <li>Install 50 water filtration systems in rural communities</li>
                <li>Train local technicians to maintain the systems</li>
                <li>Conduct water quality testing and monitoring</li>
                <li>Educate communities on water conservation and hygiene practices</li>
              </ul>
              
              <p>Each water filtration system can provide clean drinking water for up to 200 people daily, potentially impacting 10,000 individuals in total. The systems are designed to be durable, with minimal maintenance requirements and a lifespan of up to 10 years.</p>
            `,
                        imageUrl:
                            "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
                        category: "Environment",
                        goalAmount: 50000,
                        raisedAmount: 32500,
                        backers: 128,
                        daysLeft: 15,
                        createdAt: new Date("2023-12-15").toISOString(),
                        creator: {
                            _id: "123",
                            name: "Sarah Johnson",
                            profilePic: "https://i.pravatar.cc/150?img=32",
                        },
                        updates: [
                            {
                                _id: "1",
                                date: new Date("2024-01-10").toISOString(),
                                title: "First 10 water filters installed!",
                                content:
                                    "We've successfully installed the first 10 water filtration systems in Greenville community.",
                            },
                        ],
                        comments: [
                            {
                                _id: "1",
                                user: {
                                    name: "Michael Roberts",
                                    profilePic:
                                        "https://i.pravatar.cc/150?img=68",
                                },
                                date: new Date("2024-01-15").toISOString(),
                                content:
                                    "This is an amazing initiative! I've seen firsthand how access to clean water can transform communities.",
                            },
                        ],
                    };

                    setCampaign(dummyCampaign);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching campaign:", error);
                setIsLoading(false);
                toast({
                    title: "🚫 Error Loading Campaign",
                    description: "Failed to load campaign details. Please try again.",
                    variant: "destructive",
                    duration: 5000,
                    className: "bg-red-600 text-white border-none shadow-xl",
                    style: {
                      position: "fixed",
                      top: "1rem",
                      right: "1rem",
                      zIndex: 9999,
                    },
                  });
                  
            }
        };

        fetchCampaign();
    }, [id]);

    const progress = campaign
        ? Math.min(
              Math.round((campaign.raisedAmount / campaign.goalAmount) * 100),
              100
          )
        : 0;

    const handleDonateClick = () => {
        if (!currentUser) {
            navigate("/login", { state: { from: `/campaign/${id}` } });
            return;
        }

        setIsDonationDialogOpen(true);
    };

    const handleDonationSubmit = async () => {
        try {
            setIsDonating(true);

            await new Promise((resolve) => setTimeout(resolve, 2000));

            setPaymentSuccess(true);

            setCampaign((prev) => ({
                ...prev,
                raisedAmount: prev.raisedAmount + parseFloat(donationAmount),
                backers: prev.backers + 1,
            }));

            setTimeout(() => {
                setIsDonationDialogOpen(false);
                setPaymentSuccess(false);
                setIsDonating(false);

                toast({
                    title: "🙏 Thank You for Your Donation!",
                    description: `You have successfully donated ₹${donationAmount} to this campaign.`,
                    variant: "success", // If your system supports success variant
                    duration: 5000,
                    className: "bg-green-600 text-white border-none shadow-xl",
                    style: {
                      position: "fixed",
                      top: "1rem",
                      right: "1rem",
                      zIndex: 9999,
                    },
                  });
                  
            }, 3000);
        } catch (error) {
            console.error("Donation error:", error);
            setIsDonating(false);
            toast({
                title: "❌ Donation Failed",
                description:
                  error.message ||
                  "There was an error processing your donation. Please try again.",
                variant: "destructive",
                duration: 5000,
                className: "bg-red-600 text-white border-none shadow-xl",
                style: {
                  position: "fixed",
                  top: "1rem",
                  right: "1rem",
                  zIndex: 9999,
                },
              });
              
        }
    };

    const handleShareClick = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: campaign.title,
                    text: campaign.description,
                    url: window.location.href,
                })
                .catch((error) => console.log("Error sharing:", error));
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast({
                title: "🔗 Link Copied!",
                description: "Campaign link copied to clipboard.",
                duration: 3000,
                className: "bg-zinc-800 text-white border-none shadow-xl",
                style: {
                  position: "fixed",
                  top: "1rem",
                  right: "1rem",
                  zIndex: 9999,
                },
              });
              
        }
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <div className="container mx-auto px-4 pt-28 pb-16">
                    <div className="flex justify-center items-center min-h-[60vh]">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-forest-green"></div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    if (!campaign) {
        return (
            <>
                <Header />
                <div className="container mx-auto px-4 pt-28 pb-16">
                    <div className="text-center py-16">
                        <AlertCircle className="h-16 w-16 text-coral-red mx-auto mb-6" />
                        <h1 className="text-3xl font-bold mb-4 text-charcoal">
                            Campaign Not Found
                        </h1>
                        <p className="text-gray-600 mb-8">
                            The campaign you're looking for doesn't exist or has
                            been removed.
                        </p>
                        <Link to="/">
                            <Button className="bg-forest-green hover:bg-lime-green text-white px-4 py-2 rounded-full">
                                Back to Home
                            </Button>
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />

            <main className="container mx-auto px-4 pt-28 pb-16 bg-soft-white">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <img
                            src={campaign.imageUrl || "/placeholder.svg"}
                            alt={campaign.title}
                            className="w-full h-80 object-cover rounded-lg mb-6"
                        />

                        <h1 className="text-3xl font-bold mb-4 text-charcoal">
                            {campaign.title}
                        </h1>

                        <p className="text-gray-700 mb-6">
                            {campaign.description}
                        </p>

                        <div className="flex items-center mb-8">
                            <img
                                src={campaign.creator.profilePic}
                                alt={campaign.creator.name}
                                className="w-10 h-10 rounded-full mr-3 object-cover"
                            />
                            <div>
                                <p className="font-medium text-charcoal">
                                    Created by
                                </p>
                                <p className="text-forest-green">
                                    {campaign.creator.name}
                                </p>
                            </div>
                        </div>

                        <Tabs defaultValue="about" className="mb-8">
                            <TabsList className="grid grid-cols-3 mb-6 rounded-full bg-mint-green/20">
                                <TabsTrigger
                                    value="about"
                                    className="data-[state=active]:bg-forest-green py-2 rounded-full data-[state=active]:text-white"
                                >
                                    About
                                </TabsTrigger>
                                <TabsTrigger
                                    value="updates"
                                    className="data-[state=active]:bg-forest-green py-2 rounded-full data-[state=active]:text-white"
                                >
                                    Updates ({campaign.updates.length})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="comments"
                                    className="data-[state=active]:bg-forest-green py-2 rounded-full data-[state=active]:text-white"
                                >
                                    Comments ({campaign.comments.length})
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="about" className="space-y-6">
                                <div
                                    className="prose prose-lg max-w-none"
                                    dangerouslySetInnerHTML={{
                                        __html: campaign.longDescription,
                                    }}
                                ></div>
                            </TabsContent>

                            <TabsContent value="updates" className="space-y-6">
                                {campaign.updates.map((update) => (
                                    <Card
                                        key={update._id}
                                        className="overflow-hidden border-mint-green"
                                    >
                                        <div className="bg-mint-green/10 px-6 py-3 border-b border-mint-green">
                                            <div className="flex justify-between items-center">
                                                <h3 className="font-semibold text-forest-green">
                                                    {update.title}
                                                </h3>
                                                <span className="text-sm text-gray-500">
                                                    {format(
                                                        new Date(update.date),
                                                        "MMM d, yyyy"
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                        <CardContent className="p-6">
                                            <p className="text-charcoal">
                                                {update.content}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </TabsContent>

                            <TabsContent value="comments" className="space-y-6">
                                {campaign.comments.map((comment) => (
                                    <div
                                        key={comment._id}
                                        className="border-b border-mint-green pb-6 last:border-0"
                                    >
                                        <div className="flex items-start gap-4">
                                            <img
                                                src={comment.user.profilePic}
                                                alt={comment.user.name}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-2">
                                                    <p className="font-medium text-charcoal">
                                                        {comment.user.name}
                                                    </p>
                                                    <span className="text-sm text-gray-500">
                                                        {format(
                                                            new Date(
                                                                comment.date
                                                            ),
                                                            "MMM d, yyyy"
                                                        )}
                                                    </span>
                                                </div>
                                                <p className="text-gray-700">
                                                    {comment.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {currentUser ? (
                                    <div className="mt-8 pt-6 border-t border-mint-green">
                                        <h3 className="font-semibold mb-4 text-charcoal">
                                            Leave a comment
                                        </h3>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-mint-green/20 flex items-center justify-center">
                                                <User
                                                    size={20}
                                                    className="text-forest-green"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Input
                                                    className="mb-3"
                                                    placeholder="Write your comment..."
                                                />
                                                <Button className="bg-forest-green hover:bg-lime-green text-white px-4 py-2 rounded-full">
                                                    Post Comment
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="mt-8 pt-6 border-t border-mint-green text-center">
                                        <p className="text-gray-600 mb-4">
                                            Please sign in to leave a comment
                                        </p>
                                        <Link
                                            to="/login"
                                            state={{ from: `/campaign/${id}` }}
                                        >
                                            <Button
                                                variant="outline"
                                                className="border-forest-green text-forest-green hover:bg-mint-green/20 px-4 py-2 rounded-full"
                                            >
                                                Sign In
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28">
                            <Card className="mb-6 border-mint-green">
                                <CardContent className="p-6">
                                    {/* Progress Bar */}
                                    <div className="mb-6">
                                        <div className="h-2 w-full bg-mint-green/20 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-deep-emerald rounded-full"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <span className="font-semibold text-2xl text-forest-green">
                                                ₹
                                                {campaign.raisedAmount.toLocaleString()}
                                            </span>
                                            <span className="text-gray-500">
                                                raised of ₹
                                                {campaign.goalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Campaign Stats */}
                                    <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-mint-green">
                                        <div className="text-center">
                                            <p className="text-2xl font-semibold text-forest-green">
                                                {progress}%
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                Funded
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-semibold text-forest-green">
                                                {campaign.backers}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                Backers
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-semibold text-forest-green">
                                                {campaign.daysLeft}
                                            </p>
                                            <p className="text-gray-500 text-sm">
                                                Days Left
                                            </p>
                                        </div>
                                    </div>

                                    {/* Donation Button */}
                                    <Button
                                        className="flex flex-wrap w-full mb-4 bg-forest-green  hover:bg-lime-green text-white px-4 py-2 rounded-full"
                                        onClick={handleDonateClick}
                                    >
                                        <Heart className="mr-2 h-5 w-5" />
                                        Back this project
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="flex flex-wrap w-full border-forest-green text-forest-green hover:bg-mint-green/20 px-4 py-2 rounded-full"
                                        onClick={handleShareClick}
                                    >
                                        <Share2 className="mr-2 h-5 w-5" />
                                        Share
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="border-mint-green">
                                <CardContent className="p-6 space-y-4">
                                    <h3 className="font-semibold text-lg mb-2 text-forest-green">
                                        Campaign Details
                                    </h3>

                                    <div className="flex items-center text-charcoal">
                                        <Calendar className="h-5 w-5 mr-3 text-forest-green" />
                                        <div>
                                            <p className="font-medium">
                                                Created on
                                            </p>
                                            <p className="text-sm">
                                                {format(
                                                    new Date(
                                                        campaign.createdAt
                                                    ),
                                                    "MMMM d, yyyy"
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-charcoal">
                                        <Clock className="h-5 w-5 mr-3 text-forest-green" />
                                        <div>
                                            <p className="font-medium">
                                                End Date
                                            </p>
                                            <p className="text-sm">
                                                {format(
                                                    new Date(
                                                        new Date().getTime() +
                                                            campaign.daysLeft *
                                                                24 *
                                                                60 *
                                                                60 *
                                                                1000
                                                    ),
                                                    "MMMM d, yyyy"
                                                )}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-charcoal">
                                        <Target className="h-5 w-5 mr-3 text-forest-green" />
                                        <div>
                                            <p className="font-medium">
                                                Category
                                            </p>
                                            <p className="text-sm">
                                                {campaign.category}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center text-charcoal">
                                        <Users className="h-5 w-5 mr-3 text-forest-green" />
                                        <div>
                                            <p className="font-medium">
                                                Total Backers
                                            </p>
                                            <p className="text-sm">
                                                {campaign.backers} supporters
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>

            {/* Donation Dialog */}
            <Dialog
                open={isDonationDialogOpen}
                onOpenChange={setIsDonationDialogOpen}
            >
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-forest-green">
                            Support this campaign
                        </DialogTitle>
                        <DialogDescription>
                            Enter the amount you would like to donate to help
                            fund this project.
                        </DialogDescription>
                    </DialogHeader>

                    {paymentSuccess ? (
                        <div className="py-6 text-center">
                            <div className="h-16 w-16 bg-mint-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="h-8 w-8 text-deep-emerald" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2 text-forest-green">
                                Thank You!
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Your donation of ₹{donationAmount} has been
                                successfully processed.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="relative mt-2">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">₹</span>
                                </div>
                                <Input
                                    type="number"
                                    min="1"
                                    step="1"
                                    className="pl-10"
                                    value={donationAmount}
                                    onChange={(e) =>
                                        setDonationAmount(e.target.value)
                                    }
                                    disabled={isDonating}
                                />
                            </div>

                            <div className="flex flex-wrap gap-2 mt-4">
                                {["10", "25", "50", "100"].map((amount) => (
                                    <Button
                                        key={amount}
                                        type="button"
                                        variant={
                                            donationAmount === amount
                                                ? "default"
                                                : "outline"
                                        }
                                        className={`px-4 py-2 rounded-full ${
                                            donationAmount === amount
                                                ? "bg-forest-green hover:bg-lime-green text-white"
                                                : "border-forest-green text-forest-green hover:bg-mint-green/20"
                                        }`}
                                        onClick={() =>
                                            setDonationAmount(amount)
                                        }
                                        disabled={isDonating}
                                    >
                                        ₹{amount}
                                    </Button>
                                ))}
                            </div>

                            <DialogFooter className="mt-6">
                                <Button
                                    variant="outline"
                                    className="border-forest-green text-forest-green hover:bg-mint-green/20 px-4 py-2 rounded-full"
                                    onClick={() =>
                                        setIsDonationDialogOpen(false)
                                    }
                                    disabled={isDonating}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="bg-forest-green hover:bg-lime-green text-white px-4 py-2 rounded-full"
                                    onClick={handleDonationSubmit}
                                    disabled={
                                        isDonating ||
                                        parseFloat(donationAmount) <= 0
                                    }
                                >
                                    {isDonating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        "Complete Donation"
                                    )}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            <Footer />
        </>
    );
};

export default CampaignDetails;
