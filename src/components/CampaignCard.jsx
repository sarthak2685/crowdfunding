import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CalendarClock, Target, Users, IndianRupee, Heart, Loader2, X, ChevronDown, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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

  const [donationAmount, setDonationAmount] = useState(500);
  const [isLoading, setIsLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
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

  const presetAmounts = [200, 500, 1000, 2000, 5000];

  useEffect(() => {
    const loadScript = async () => {
      const loaded = await loadRazorpayScript();
      setRazorpayLoaded(loaded);
    };
    loadScript();
  }, []);

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
    setShowPaymentModal(true);
    setPaymentSuccess(false);
  };

  const handlePaymentSubmit = async () => {
    if (donationAmount <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid donation amount.", variant: "destructive" });
      return;
    }

    setIsLoading(true);

    try {
      if (!razorpayLoaded) {
        const loaded = await loadRazorpayScript();
        if (!loaded) throw new Error("Failed to load payment processor");
        setRazorpayLoaded(true);
      }

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiUrl}/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ 
          campaignId: _id, 
          amount: donationAmount, 
          currency: "INR" 
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.razorpayOrderId) {
        throw new Error(data.message || "Failed to initiate payment");
      }

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Crowdfunding Platform",
        description: `Donation to ${title}`,
        image: "/logo.png",
        order_id: data.razorpayOrderId,
        handler: function (response) {
          setPaymentSuccess(true);
          setTimeout(() => {
            setShowPaymentModal(false);
            toast({ 
              title: "Payment Successful", 
              description: `Thank you for donating ₹${donationAmount}.` 
            });
            if (window.location.pathname.includes("/dashboard")) {
              window.location.reload();
            }
          }, 2000);
        },
        prefill: {
          name: currentUser?.name || "",
          email: currentUser?.email || "",
          contact: currentUser?.phone || ""
        },
        notes: {
          campaignId: _id,
          donorId: currentUser?._id,
        },
        theme: {
          color: "#15803d"
        },
        modal: {
          ondismiss: () => {
            toast({ title: "Payment Cancelled", description: "You can try again anytime." });
            setIsLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({ 
        title: "Payment Failed", 
        description: error.message || "Something went wrong.", 
        variant: "destructive" 
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
            onError={(e) => { e.target.onerror = null; e.target.src = "/placeholder.svg"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute top-0 left-0 m-3">
            <Badge className={cn("font-medium text-white px-3 py-1 rounded-full shadow-sm", category === "Animal Welfare" ? "bg-teal-700 hover:bg-teal-800" : "bg-green-700 hover:bg-green-800")}>
              {category}{category === "Animal Welfare" && <span className="ml-1">🐾</span>}
            </Badge>
          </div>
        </div>

        <div className="p-5 relative">
          {status && (
            <div className={`absolute top-5 right-5 ${statusConfig[status]?.color} text-white px-3 py-1 rounded-md shadow-sm flex items-center`}>
              <span className="mr-1 text-xs">{statusConfig[status]?.icon}</span>
              <span className="text-xs font-semibold">{statusConfig[status]?.text}</span>
            </div>
          )}

          <h3 className="font-bold text-lg mb-2 line-clamp-1 text-gray-900 dark:text-white pr-16">
            <Link to={`/campaign/${_id}`} className="hover:text-green-700 dark:hover:text-green-400 transition-colors">
              {title}
            </Link>
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
                {status === "active"
                  ? "Support Now!"
                  : status === "pending"
                    ? "Support"
                    : status === "completed"
                      ? "Campaign Ended"
                      : status === "rejected"
                        ? "Not Accepting Donations"
                        : "Support"}
              </span>
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

      {/* Animated Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6">
                {paymentSuccess ? (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-center py-8"
                  >
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                      <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Thank You!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">
                      Your donation of ₹{donationAmount} has been successfully processed.
                    </p>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mb-6">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        A receipt has been sent to your email address.
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowPaymentModal(false)}
                      className="bg-green-700 hover:bg-green-800 w-full"
                    >
                      Close
                    </Button>
                  </motion.div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">Support {title}</h3>
                      <button
                        onClick={() => setShowPaymentModal(false)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                        disabled={isLoading}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div className="mb-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Your contribution will help make a difference. Enter your donation amount:
                      </p>

                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {presetAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant={donationAmount === amount ? "default" : "outline"}
                            onClick={() => setDonationAmount(amount)}
                            className={cn(
                              "flex items-center justify-center",
                              donationAmount === amount ? "bg-green-700 text-white" : ""
                            )}
                          >
                            ₹{amount}
                          </Button>
                        ))}
                        <Button
                          variant={!presetAmounts.includes(donationAmount) ? "default" : "outline"}
                          onClick={() => setDonationAmount("")}
                          className={cn(
                            "flex items-center justify-center col-span-3",
                            !presetAmounts.includes(donationAmount) ? "bg-green-700 text-white" : ""
                          )}
                        >
                          Custom Amount
                          <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <Input
                          id="amount"
                          type="number"
                          value={donationAmount}
                          onChange={(e) => setDonationAmount(parseInt(e.target.value) || "")}
                          min="1"
                          className="flex-1 text-lg font-medium"
                          placeholder="Enter amount"
                        />
                        <IndianRupee className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </div>

                      <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-4">
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-600 dark:text-gray-300">Campaign Progress:</span>
                          <span className="font-medium">{progress}%</span>
                        </div>
                        <Progress
                          value={progress}
                          className="h-2 bg-gray-200 dark:bg-gray-600"
                          indicatorClassName="bg-green-700 dark:bg-green-600"
                        />
                        <div className="flex justify-between text-xs mt-2 text-gray-500 dark:text-gray-400">
                          <span>₹{raisedAmount.toLocaleString()} raised</span>
                          <span>₹{goalAmount.toLocaleString()} goal</span>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          Your donation will be securely processed via Razorpay. All transactions are encrypted.
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        variant="outline"
                        onClick={() => setShowPaymentModal(false)}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handlePaymentSubmit}
                        disabled={isLoading || !donationAmount || donationAmount <= 0}
                        className="bg-green-700 hover:bg-green-800"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Proceed to Payment"
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CampaignCard;