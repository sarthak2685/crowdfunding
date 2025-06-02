import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";

const EmergencyCampaigns = () => {
  const [emergencyCampaigns, setEmergencyCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

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
          (campaign) => campaign.isEmergency && campaign.status === "active"
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

  useEffect(() => {
    if (emergencyCampaigns.length <= 1) return;

    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prevIndex) => 
          (prevIndex + 1) % emergencyCampaigns.length
        );
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, emergencyCampaigns.length]);

  const getVisibleCampaigns = () => {
    if (emergencyCampaigns.length <= 3) return emergencyCampaigns;
    
    const campaigns = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % emergencyCampaigns.length;
      campaigns.push(emergencyCampaigns[index]);
    }
    return campaigns;
  };

  const calculateDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

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
                <CardContent className="flex-1 p-6 flex flex-col">
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
                  
                  <div className="mt-auto">
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
                    
                    <div className="flex justify-between items-center text-sm">
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
                    
                    <Link 
                      to={`/campaigns/${campaign._id || campaign.id}`}
                      className="mt-4 block"
                    >
                      <Button className="w-full bg-rose-600 hover:bg-rose-700">
                        Donate Now
                      </Button>
                    </Link>
                  </div>
                </CardContent>
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
            <Button className="bg-rose-600 hover:bg-rose-700">
              Start Emergency Campaign
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default EmergencyCampaigns;