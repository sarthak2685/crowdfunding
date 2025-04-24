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

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dmjgslyja";

const cloudinary = {
    image: `${CLOUDINARY_BASE_URL}/image/upload`,
    video: `${CLOUDINARY_BASE_URL}/video/upload`,
    raw: `${CLOUDINARY_BASE_URL}/raw/upload`,
};

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

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
        cloudinaryData = {},
        status
    } = campaign;

    const [donationAmount, setDonationAmount] = useState(10);
    const [isLoading, setIsLoading] = useState(false);
    const [showDonateDialog, setShowDonateDialog] = useState(false);
    const { toast } = useToast();
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    const progress = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);
    const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

    const fullImageUrl = imageUrl || `${cloudinary.image}/${cloudinaryData.coverImageId}.png`;

    const statusConfig = {
        pending: { text: "Pending", color: "bg-amber-600", icon: "⏳" },
        active: { text: "Active", color: "bg-green-700", icon: "🚀" },
        completed: { text: "Completed", color: "bg-emerald-700", icon: "✅" },
        rejected: { text: "Rejected", color: "bg-red-700", icon: "❌" }
    };

    const handleDonateClick = () => {
        if (!currentUser) {
            toast({ title: "Login Required", description: "Please login to donate.", variant: "destructive" });
            navigate(`/login`, { state: { from: `/campaign/${_id}` } });
            return;
        }
        if (status !== "active") {
            toast({ title: "Campaign Not Active", description: `This campaign is currently ${status}.`, variant: "destructive" });
            return;
        }
        setShowDonateDialog(true);
    };

    const handleDonationSubmit = async () => {
        if (donationAmount <= 0) {
            toast({ title: "Invalid Amount", description: "Please enter a valid donation amount.", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        const res = await loadRazorpayScript();
        if (!res) {
            toast({ title: "Payment Error", description: "Failed to load Razorpay SDK.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        try {
            const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
            const response = await fetch(`${apiUrl}/payments/create-order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ campaignId: _id, amount: donationAmount, currency: "USD" }),
            });

            const data = await response.json();
            if (!response.ok || !data.razorpayOrderId) throw new Error(data.message || "Failed to initiate payment");

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: data.amount,
                currency: "USD",
                name: "Support Campaign",
                description: `Donation to ${title}`,
                image: "/logo.svg",
                order_id: data.razorpayOrderId,
                handler: async function (response) {
                    toast({ title: "Payment Successful", description: `Thank you for donating ₹${donationAmount}.` });
                    setShowDonateDialog(false);
                    if (window.location.pathname.includes("/dashboard")) window.location.reload();
                },
                prefill: {
                    name: currentUser?.name || "",
                    email: currentUser?.email || "",
                },
                notes: {
                    campaignId: _id,
                    donorId: currentUser?._id,
                },
                theme: {
                    color: "#15803d"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            toast({ title: "Payment Failed", description: error.message || "Something went wrong.", variant: "destructive" });
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
                        onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.svg"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-0 left-0 m-3">
                        <Badge className={cn("font-medium text-white px-3 py-1 rounded-full shadow-sm", category === "Animal Welfare" ? "bg-teal-700 hover:bg-teal-800" : "bg-green-700 hover:bg-green-800")}>{category}{category === "Animal Welfare" && <span className="ml-1">🐾</span>}</Badge>
                    </div>
                </div>

                <div className="p-5 relative">
                    {status && <div className={`absolute top-5 right-5 ${statusConfig[status]?.color} text-white px-3 py-1 rounded-md shadow-sm flex items-center`}>
                        <span className="mr-1 text-xs">{statusConfig[status]?.icon}</span>
                        <span className="text-xs font-semibold">{statusConfig[status]?.text}</span>
                    </div>}

                    <h3 className="font-bold text-lg mb-2 line-clamp-1 text-gray-900 dark:text-white pr-16">
                        <Link to={`/campaign/${_id}`} className="hover:text-green-700 dark:hover:text-green-400 transition-colors">{title}</Link>
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">{description}</p>

                    <div className="mt-4 mb-3">
                        <div className="flex justify-between items-center mb-1 text-sm">
                            <span className="font-semibold text-green-700 dark:text-green-400">₹{raisedAmount.toLocaleString()}</span>
                            <span className="text-gray-500 dark:text-gray-400">{progress}% of ₹{goalAmount.toLocaleString()}</span>
                        </div>
                        <Progress value={progress} className="h-2 bg-gray-100 dark:bg-gray-700" indicatorClassName="bg-green-700 dark:bg-green-600" />
                    </div>

                    <div className="mt-4 mb-3">
                        <Button
                            onClick={handleDonateClick}
                            className={cn("w-full px-4 py-2 rounded-full flex items-center justify-center font-bold", status === "active" ? "bg-green-700 hover:bg-green-800 text-white shadow-md" : status === "pending" ? "bg-[#2D6A4F] hover:bg-[#1B4332] text-white cursor-not-allowed" : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300 cursor-not-allowed")}
                            disabled={status !== "active"}
                        >
                            <Heart className="w-4 h-4 mr-2" />
                            <span>{status === "active" ? "Support Now!" : status === "pending" ? "Support" : status === "completed" ? "Campaign Ended" : status === "rejected" ? "Not Accepting Donations" : "Support"}</span>
                        </Button>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                            <CalendarClock size={14} className="text-green-700 dark:text-green-400" />
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

            <Dialog open={showDonateDialog} onOpenChange={setShowDonateDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Support {title}</DialogTitle>
                        <DialogDescription>Enter your donation amount below. Every contribution helps!</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="flex items-center gap-4">
                            <Input id="amount" type="number" value={donationAmount} onChange={(e) => setDonationAmount(parseInt(e.target.value) || 0)} className="col-span-3" min="1" />
                            <IndianRupee className="h-5 w-5" />
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">Current progress: {progress}% (₹{raisedAmount} of ₹{goalAmount})</div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={handleDonationSubmit} disabled={isLoading} className="bg-green-700 hover:bg-green-800">
                            {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Processing...</>) : ("Donate Now")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default CampaignCard;
