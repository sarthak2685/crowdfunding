import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarClock, Target, Users, IndianRupee, Heart } from "lucide-react";
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

    const firstImage =
        Array.isArray(imageUrl) && imageUrl.length > 0 ? imageUrl[0] : null;

    const fullImageUrl = firstImage
        ? firstImage.startsWith("http")
            ? firstImage
            : `${
                  import.meta.env.VITE_IMG_URL || "http://localhost:5000"
              }${firstImage}`
        : "/placeholder.svg";

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

            // Close dialog and potentially refresh data
            setShowDonateDialog(false);

            // In a real app, you might want to update the UI or trigger a data refresh
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
            <div className="campaign-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100">
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
                        <Badge className="font-medium bg-forest-green hover:bg-lime-green text-white px-3 py-1 rounded-full">
                            {category}
                        </Badge>
                    </div>
                </div>

                <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">
                        <Link
                            to={`/campaign/${_id}`}
                            className="hover:text-forest-green transition-colors"
                        >
                            {title}
                        </Link>
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 mb-3">
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-semibold text-forest-green">
                                ₹{raisedAmount.toLocaleString()}
                            </span>
                            <span className="text-gray-500">
                                {progress}% of ₹{goalAmount.toLocaleString()}
                            </span>
                        </div>
                        <Progress
                            value={progress}
                            className="h-2 bg-gray-100"
                            indicatorClassName="bg-forest-green"
                        />
                    </div>

                    {/* Donate Button */}
                    <div className="mt-4 mb-3">
                        <Button
                            onClick={handleDonateClick}
                            className="w-full bg-forest-green hover:bg-lime-green text-white px-4 py-2 rounded-full flex items-center"
                        >
                            <Heart className="w-4 h-4 mr-2" />
                            <span>Support</span>
                        </Button>
                    </div>

                    {/* Campaign Stats */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                            <CalendarClock
                                size={14}
                                className="text-forest-green"
                            />
                            <span>{daysLeft} days left</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Users size={14} className="text-forest-green" />
                            <span>{backers} supporters</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Target size={14} className="text-forest-green" />
                            <span>{timeAgo}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation Dialog */}
            <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-forest-green">
                            Support {title}
                        </DialogTitle>
                        <DialogDescription>
                            Your contribution will help make this campaign
                            successful.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4 space-y-4">
                        <div className="flex items-center space-x-2">
                            <IndianRupee className="text-gray-500" />
                            <Input
                                type="number"
                                value={donationAmount}
                                onChange={(e) =>
                                    setDonationAmount(Number(e.target.value))
                                }
                                min="1"
                                step="1"
                                placeholder="Amount"
                                className="text-lg font-medium"
                            />
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {[50, 100, 200, 500].map((amount) => (
                                <Button
                                    key={amount}
                                    variant="outline"
                                    className={cn(
                                        "rounded-full",
                                        donationAmount === amount &&
                                            "bg-forest-green text-white"
                                    )}
                                    onClick={() => setDonationAmount(amount)}
                                >
                                    ₹{amount}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDonateDialog(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDonationSubmit}
                            disabled={isLoading}
                            className="bg-forest-green hover:bg-lime-green"
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
