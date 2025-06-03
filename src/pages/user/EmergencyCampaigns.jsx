import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Heart, Clock, X, CreditCard, Wallet, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";


const EmergencyCampaigns = () => {
  // Campaign data state
  const [emergencyCampaigns, setEmergencyCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Payment modal state
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [donationAmount, setDonationAmount] = useState(500);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [isProcessing, setIsProcessing] = useState(false);
  const [donorDetails, setDonorDetails] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const { currentUser } = useAuth();
    const navigate = useNavigate();


  // Fetch emergency campaigns
  useEffect(() => {
    const fetchEmergencyCampaigns = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/campaigns?isEmergency=true&status=active`
        );
        const data = await response.json();

        if (response.ok) {
          const filteredCampaigns = data.data.filter(
            campaign => campaign.isEmergency && campaign.status === "active"
          );
          setEmergencyCampaigns(filteredCampaigns);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: data.message || "Failed to fetch emergency campaigns",
          });
        }
      } catch (error) {
        console.error("Error fetching emergency campaigns:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch emergency campaigns",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmergencyCampaigns();
  }, []);

  // Auto-rotate campaigns
  useEffect(() => {
    if (emergencyCampaigns.length <= 1) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex(prevIndex => 
          (prevIndex + 1) % emergencyCampaigns.length
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, emergencyCampaigns.length]);

  // Get currently visible campaigns
  const getVisibleCampaigns = () => {
    if (emergencyCampaigns.length <= 3) return emergencyCampaigns;
    
    const campaigns = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % emergencyCampaigns.length;
      campaigns.push(emergencyCampaigns[index]);
    }
    return campaigns;
  };

  // Calculate days left in campaign
  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Handle donate button click
 
  const handleDonateClick = (campaign) => {
    if (!currentUser) {
      toast({ title: "Login Required", description: "Please login to donate.", variant: "destructive" });
      navigate(`/login`, { state: { from: `/campaign  ` } });
      return;
    }
    
  setSelectedCampaign(campaign);
    setIsPaymentModalOpen(true);
  };
  // Handle payment submission
  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    // Validate donor details
    if (!donorDetails.name || !donorDetails.email || !donorDetails.phone) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please fill in all your details before donating",
      });
      return;
    }

    if (donationAmount < 10) {
      toast({
        variant: "destructive",
        title: "Invalid Amount",
        description: "Minimum donation amount is ₹10",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call to payment gateway
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Donation Successful!",
        description: `Thank you for donating ₹${donationAmount} to ${selectedCampaign.title}`,
      });
      
      // Reset form
      setIsPaymentModalOpen(false);
      setDonationAmount(500);
      setDonorDetails({
        name: "",
        email: "",
        phone: ""
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDonorDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-rose-50/30">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-600"></div>
          </div>
          <p className="mt-4 text-gray-600">Loading emergency campaigns...</p>
        </div>
      </section>
    );
  }

  // Empty state
  if (emergencyCampaigns.length === 0) {
    return (
      <section className="py-16 bg-rose-50/30">
        <div className="container mx-auto px-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertTriangle className="h-12 w-12 text-rose-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            No Active Emergency Campaigns
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            There are currently no emergency campaigns needing support.
            Check back later or start your own emergency fundraiser.
          </p>
          <Link to="/dashboard/create-campaign">
            <Button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3">
              Create Emergency Campaign
            </Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-rose-50/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-rose-100 rounded-full p-3 mb-4">
            <AlertTriangle className="h-8 w-8 text-rose-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Emergency Fundraisers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            These urgent campaigns need immediate support. Your contribution
            can make a life-saving difference right now.
          </p>
        </div>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getVisibleCampaigns().map((campaign) => (
              <Card 
                key={campaign._id || campaign.id}
                className="h-full flex flex-col transition-all hover:shadow-lg hover:-translate-y-1"
              >
                {/* Clickable area for campaign details */}
                <Link 
                  to={`/campaigns/${campaign._id || campaign.id}`}
                  className="block flex-1"
                >
                  <div className="relative">
                    <div className="absolute top-3 left-3 z-10">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-rose-600 text-xs font-medium text-white">
                        EMERGENCY
                      </span>
                    </div>
                    <img
                      src={campaign.imageUrl || "/placeholder.svg"}
                      alt={campaign.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                  </div>
                  <CardContent className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {campaign.title}
                      </h3>
                      {campaign.category && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 ml-2">
                          {campaign.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {campaign.description}
                    </p>
                  </CardContent>
                </Link>
                
                {/* Non-clickable footer with Donate button */}
                <div className="p-6 pt-0">
                  <div className="mb-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Raised: ₹{campaign.raisedAmount?.toLocaleString() || 0}</span>
                      <span>Goal: ₹{campaign.goalAmount.toLocaleString()}</span>
                    </div>
                    <Progress
                      value={(campaign.raisedAmount / campaign.goalAmount) * 100}
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-rose-600"
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm mb-4">
                    <div className="flex items-center text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {calculateDaysLeft(campaign.endDate)} days left
                      </span>
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Heart className="h-4 w-4 mr-1 text-rose-600 fill-rose-600" />
                      <span>{campaign.backersCount || 0} supporters</span>
                    </div>
                  </div>
                  <div className="mt-4 mb-3">
            <Button
              onClick={() => handleDonateClick(campaign)}
              className={cn(
                "w-full px-4 py-2 text-white rounded-full flex items-center justify-center bg-rose-600 hover:bg-rose-700 font-bold"
              )}
            >
              <Heart className="w-4 h-4 mr-2" />
              <span>
                {status === "active"
                  ? "Support Now!"
                  : status === "pending"
                    ? "Support Now!"
                    : status === "completed"
                      ? "Campaign Ended"
                      : status === "rejected"
                        ? "Not Accepting Donations"
                        : "Support Now!"}
              </span>
            </Button>
          </div>
                  {/* <Button 
                    onClick={() => handleDonateClick(campaign)}
                    className="w-full text-white bg-rose-600 hover:bg-rose-700"
                  >
                    Support Now!
                  </Button> */}
                </div>
              </Card>
            ))}
          </div>

          {emergencyCampaigns.length > 3 && (
            <div className="flex justify-center mt-8 gap-2">
              {emergencyCampaigns.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    currentIndex === index ? "bg-rose-600" : "bg-rose-300"
                  }`}
                  aria-label={`View campaign ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-12">
          <Link to="/campaigns">
            <Button variant="outline" className="mr-4">
              View All Campaigns
            </Button>
          </Link>
          <Link to="/dashboard/create-campaign">
            <Button className=" text-white bg-rose-600 hover:bg-rose-700">
              Start Emergency Campaign
            </Button>
          </Link>
        </div>
      </div>

      {/* Payment Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg font-bold">Donate to {selectedCampaign?.title}</h3>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={isProcessing}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handlePaymentSubmit} className="p-6">
              {/* Donor Information */}
              {/* <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">YOUR INFORMATION</h4>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={donorDetails.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={donorDetails.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={donorDetails.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
              </div> */}
              
              {/* Donation Amount */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">DONATION AMOUNT</h4>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[100, 500, 1000, 2000].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setDonationAmount(amount)}
                      className={`py-2 rounded-md border transition-colors ${
                        donationAmount === amount 
                          ? 'bg-rose-100 border-rose-500 text-rose-700' 
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="10"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                  placeholder="Enter custom amount"
                />
              </div>
              
              {/* Payment Method */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">PAYMENT METHOD</h4>
                <div className="space-y-3">
                  <div 
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      paymentMethod === "upi" ? "border-rose-500 bg-rose-50" : "border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    <Wallet className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="flex-1">UPI Payment</span>
                    <div className={`h-4 w-4 rounded-full border ${
                      paymentMethod === "upi" ? "bg-rose-500 border-rose-500" : "border-gray-400"
                    }`}></div>
                  </div>
                  
                  <div 
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      paymentMethod === "card" ? "border-rose-500 bg-rose-50" : "border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <CreditCard className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="flex-1">Credit/Debit Card</span>
                    <div className={`h-4 w-4 rounded-full border ${
                      paymentMethod === "card" ? "bg-rose-500 border-rose-500" : "border-gray-400"
                    }`}></div>
                  </div>
                  
                  <div 
                    className={`flex items-center p-3 border rounded-md cursor-pointer ${
                      paymentMethod === "netbanking" ? "border-rose-500 bg-rose-50" : "border-gray-300"
                    }`}
                    onClick={() => setPaymentMethod("netbanking")}
                  >
                    <Banknote className="h-5 w-5 text-gray-600 mr-3" />
                    <span className="flex-1">Net Banking</span>
                    <div className={`h-4 w-4 rounded-full border ${
                      paymentMethod === "netbanking" ? "bg-rose-500 border-rose-500" : "border-gray-400"
                    }`}></div>
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-rose-600 hover:bg-rose-700"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  `Donate ₹${donationAmount}`
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default EmergencyCampaigns;