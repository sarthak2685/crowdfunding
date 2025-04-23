import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarClock, Target, Users, IndianRupee, Heart, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const CampaignCard = ({ campaign }) => {
    const {
        _id,
        title,
        description,
        imageUrl,
        category,
        goalAmount,
        raisedAmount,
        daysLeft,
        backers,
        createdAt,
        videos,
        status
    } = campaign;

    const [donationAmount, setDonationAmount] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [showDonateDialog, setShowDonateDialog] = useState(false);
    const { toast } = useToast();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    // Calculate progress percentage
    const progress = Math.min(
        Math.round((raisedAmount / goalAmount) * 100),
        100
    );

    // Format date
    const timeAgo = formatDistanceToNow(new Date(createdAt), {
        addSuffix: true,
    });

    // Determine image URL based on data structure
    const getImageUrl = () => {
        const apiBaseUrl = import.meta.env.VITE_IMG_URL || "http://localhost:5000";
        
        if (typeof imageUrl === 'string') {
            return imageUrl.startsWith('http') 
                ? imageUrl 
                : `${apiBaseUrl}${imageUrl}`;
        }
        
        if (Array.isArray(imageUrl) && imageUrl.length > 0) {
            const firstImage = imageUrl[0];
            return typeof firstImage === 'string' && firstImage.startsWith('http') 
                ? firstImage 
                : `${apiBaseUrl}${firstImage}`;
        }
        
        if (videos && Array.isArray(videos) && videos.length > 0 && typeof videos[0] === 'string') {
            return `${apiBaseUrl}${videos[0].replace('.mp4', '-thumbnail.jpg')}`;
        }
        
        return "/placeholder.svg";
    };

    const fullImageUrl = getImageUrl();

    // Status banner configuration - Dark Green Theme
    const statusConfig = {
        pending: {
            text: "Pending",
            color: "bg-amber-600", // Dark amber
            icon: "⏳"
        },
        active: {
            text: "Active",
            color: "bg-green-700", // Dark forest green
            icon: "🚀"
        },
        completed: {
            text: "Completed",
            color: "bg-emerald-700", // Dark emerald
            icon: "✅"
        },
        rejected: {
            text: "Rejected",
            color: "bg-red-700", // Dark red
            icon: "❌"
        }
    };

    const handleDonateClick = () => {
        if (!currentUser) {
            toast({
                title: "Login Required",
                description: "Please login to donate to this campaign.",
                variant: "destructive",
            });
            navigate("/login", { state: { from: `/campaign/${_id}` } });
            return;
        }
        
        if (status !== "active") {
            toast({
                title: "Campaign Not Active",
                description: `This campaign is currently ${status}. Only active campaigns can receive donations.`,
                variant: "destructive",
            });
            return;
        }
        
        setShowDonateDialog(true);
    };

    const handleDonationSubmit = async () => {
        if (donationAmount <= 0) {
            toast({
                title: "Invalid Amount",
                description: "Please enter a valid donation amount.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        try {
            const apiUrl =
                import.meta.env.VITE_API_URL || "http://localhost:5000";
            const response = await fetch(`${apiUrl}/donations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    campaignId: _id,
                    amount: donationAmount,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to process donation");
            }

            toast({
                title: "Donation Successful!",
                description: `You have successfully donated ₹${donationAmount} to ${title}.`,
            });

            setShowDonateDialog(false);

            if (window.location.pathname.includes("/dashboard")) {
                window.location.reload();
            }
        } catch (error) {
            console.error("Donation error:", error);
            toast({
                title: "Donation Failed",
                description:
                    error.message ||
                    "There was an error processing your donation.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="campaign-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700">
                <div className="relative h-48 w-full overflow-hidden group">
                    <img
                        src={fullImageUrl}
                        alt={title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/placeholder.svg";
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-0 left-0 m-3">
                        <Badge className={cn(
                            "font-medium text-white px-3 py-1 rounded-full shadow-sm",
                            category === "Animal Welfare" 
                                ? "bg-teal-700 hover:bg-teal-800" // Dark teal for animal welfare
                                : "bg-green-700 hover:bg-green-800" // Dark green for others
                        )}>
                            {category}
                            {category === "Animal Welfare" && (
                                <span className="ml-1">🐾</span>
                            )}
                        </Badge>
                    </div>
                </div>

                <div className="p-5 relative">
                    {/* Status banner - Right side of content area */}
                    {status && (
                        <div className={`absolute top-5 right-5 ${statusConfig[status]?.color} text-white px-3 py-1 rounded-md shadow-sm flex items-center`}>
                            <span className="mr-1 text-xs">{statusConfig[status]?.icon}</span>
                            <span className="text-xs font-semibold">{statusConfig[status]?.text}</span>
                        </div>
                    )}

                    <h3 className="font-bold text-lg mb-2 line-clamp-1 text-gray-900 dark:text-white pr-16">
                        <Link
                            to={`/campaign/${_id}`}
                            className="hover:text-green-700 dark:hover:text-green-400 transition-colors"
                        >
                            {title}
                        </Link>
                    </h3>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">
                        {description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 mb-3">
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-semibold text-green-700 dark:text-green-400">
                                ₹{raisedAmount.toLocaleString()}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                                {progress}% of ₹{goalAmount.toLocaleString()}
                            </span>
                        </div>
                        <Progress
                            value={progress}
                            className="h-2 bg-gray-100 dark:bg-gray-700"
                            indicatorClassName="bg-green-700 dark:bg-green-600"
                        />
                    </div>

                    {/* Donate Button */}
                    <div className="mt-4 mb-3">
                        <Button
                            onClick={handleDonateClick}
                            className={cn(
                                "w-full px-4 py-2 rounded-full flex items-center justify-center font-bold",
                                status === "active"
                                    ? "bg-green-700 hover:bg-green-800 text-white shadow-md"
                                    : status === "pending"
                                        ? "bg-[#2D6A4F] hover:bg-[#1B4332] text-white cursor-not-allowed"
                                        : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed"
                            )}
                            disabled={status !== "active"}
                        >
                            <Heart className="w-4 h-4 mr-2" />
                            <span>
                                {status === "active" ? "Support Now!" : 
                                 status === "pending" ? "Support" :
                                 status === "completed" ? "Campaign Ended" :
                                 status === "rejected" ? "Not Accepting Donations" : "Support"}
                            </span>
                        </Button>
                    </div>

                    {/* Campaign Stats */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                            <CalendarClock
                                size={14}
                                className="text-green-700 dark:text-green-400"
                            />
                            <span>{daysLeft} days left</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Users size={14} className="text-green-700 dark:text-green-400" />
                            <span>{backers} supporters</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Target size={14} className="text-green-700 dark:text-green-400" />
                            <span>{timeAgo}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation Dialog */}
            <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Support {title}</DialogTitle>
                        <DialogDescription>
                            Enter your donation amount below. Every contribution helps!
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center gap-4">
                            <Input
                                id="amount"
                                type="number"
                                value={donationAmount}
                                onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)}
                                className="col-span-3"
                                min="1"
                            />
                            <IndianRupee className="h-5 w-5" />
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Current progress: {progress}% (₹{raisedAmount} of ₹{goalAmount})
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            onClick={handleDonationSubmit}
                            disabled={isLoading}
                            className="bg-green-700 hover:bg-green-800"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                "Donate Now"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CampaignCard;