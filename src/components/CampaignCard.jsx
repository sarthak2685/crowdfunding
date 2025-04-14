import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    CalendarClock,
    Target,
    Users,
    DollarSign,
    IndianRupee,
} from "lucide-react";
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

    const handleDonateClick = () => {
        if (!currentUser) {
            // Redirect to login if not logged in
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
                import.meta.env.VITE_API_URL || "http://localhost:5000/api";
            const response = await fetch(
                `${apiUrl}/donations/create-payment-intent`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        campaignId: _id,
                        amount: donationAmount,
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to create payment intent");
            }

            const data = await response.json();

            if (data.success) {
                toast({
                    title: "Processing Donation",
                    description:
                        "Your donation is being processed. You will be redirected to complete it.",
                });

                // For now, we'll just close the dialog and show a success message
                // In a real app, you would use the client secret to complete the payment using Stripe Elements
                setShowDonateDialog(false);

                // Simple version without Stripe frontend integration
                // Typically, you'd use the client secret with Stripe.js to complete the payment
                const completePayment = await fetch(`${apiUrl}/donations`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        campaignId: _id,
                        amount: donationAmount,
                    }),
                });

                if (!completePayment.ok) {
                    throw new Error("Failed to process donation");
                }

                const paymentResult = await completePayment.json();

                if (paymentResult.success) {
                    toast({
                        title: "Donation Successful!",
                        description: `You have successfully donated $${donationAmount} to ${title}.`,
                    });

                    // Navigate to donation history or refresh to see the donation reflected
                    setTimeout(() => {
                        if (window.location.pathname.includes("/dashboard")) {
                            window.location.reload();
                        } else {
                            navigate("/dashboard/donations");
                        }
                    }, 2000);
                } else {
                    toast({
                        title: "Donation Failed",
                        description:
                            paymentResult.message ||
                            "There was a problem processing your donation.",
                        variant: "destructive",
                    });
                }
            } else {
                toast({
                    title: "Donation Failed",
                    description:
                        data.message ||
                        "There was a problem processing your donation.",
                    variant: "destructive",
                });
            }
        } catch (error) {
            console.error("Donation error:", error);
            toast({
                title: "Error",
                description:
                    error.message ||
                    "There was a problem connecting to the server.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="campaign-card bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={imageUrl || "/placeholder.svg"}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-0 left-0 m-3">
                        <Badge
                            variant="secondary"
                            className="font-medium text-soft-white px-4 py-2 rounded-full"
                        >
                            {category}
                        </Badge>
                    </div>
                </div>

                <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">
                        <Link
                            to={`/campaign/${_id}`}
                            className="hover:text-primary transition-colors"
                        >
                            {title}
                        </Link>
                    </h3>

                    <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                        {description}
                    </p>

                    {/* Progress Bar */}
                    <div className="mt-4 mb-3">
                        <div className="h-2 w-full bg-mint-green/20 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-forest-green rounded-full progress-bar"
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm">
                            <span className="font-semibold">
                                Rs.{raisedAmount.toLocaleString()}
                            </span>
                            <span className="text-gray-500">
                                {progress}% of Rs.{goalAmount.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Donate Button */}
                    <div className="mt-3 mb-3">
                        <Button
                            onClick={handleDonateClick}
                            className="w-full bg-deep-emerald hover:bg-lime-green  px-4 py-2 rounded-full flex flex-wrap text-soft-white"
                        >
                            <IndianRupee className="w-4 h-4 mr-2" /> Donate Now
                        </Button>
                    </div>

                    {/* Campaign Stats */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t text-sm text-gray-500">
                        <div className="flex items-center text-forest-green space-x-1">
                            <CalendarClock size={16} />
                            <span>{daysLeft} days left</span>
                        </div>
                        <div className="flex items-center text-forest-green  space-x-1">
                            <Users size={16} />
                            <span>{backers} backers</span>
                        </div>
                        <div className="flex items-center text-forest-green space-x-1">
                            <Target size={16} />
                            <span>{timeAgo}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Donation Dialog */}
            <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Donate to {title}</DialogTitle>
                        <DialogDescription>
                            Enter the amount you would like to donate to support
                            this campaign.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-4">
                        <div className="flex items-center space-x-2">
                            <DollarSign className="text-gray-500" />
                            <Input
                                type="number"
                                value={donationAmount}
                                onChange={(e) =>
                                    setDonationAmount(Number(e.target.value))
                                }
                                min="1"
                                step="1"
                                placeholder="Amount"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            onClick={() => setShowDonateDialog(false)}
                            variant="outline"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDonationSubmit}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Donate"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CampaignCard;
