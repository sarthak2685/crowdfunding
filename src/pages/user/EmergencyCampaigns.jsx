import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useEffect, useState } from "react";

const EmergencyCampaigns = () => {
    // Sample emergency campaigns data
    const emergencyCampaigns = [
        {
            _id: "em1",
            title: "Flood Relief in Assam",
            description:
                "Urgent support needed for families affected by recent floods in Assam. Help provide food, shelter and medical aid.",
            category: "Disaster Relief",
            goalAmount: 500000,
            raisedAmount: 275000,
            imageUrl:
                "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec",
            daysLeft: 5,
            backers: 128,
            createdAt: new Date().toISOString(),
        },
        {
            _id: "em2",
            title: "Medical Emergency for Ramesh",
            description:
                "Help Ramesh get life-saving heart surgery. The family has exhausted all their savings and needs urgent support.",
            category: "Medical Emergency",
            goalAmount: 300000,
            raisedAmount: 125000,
            imageUrl:
                "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
            daysLeft: 3,
            backers: 85,
            createdAt: new Date().toISOString(),
        },
        {
            _id: "em3",
            title: "Earthquake Relief in Nepal",
            description:
                "Emergency aid for victims of the recent earthquake. Funds will go towards shelter, food and medical supplies.",
            category: "Disaster Relief",
            goalAmount: 750000,
            raisedAmount: 320000,
            imageUrl:
                "https://images.unsplash.com/photo-1540962351504-03099e0a754b",
            daysLeft: 7,
            backers: 210,
            createdAt: new Date().toISOString(),
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isPaused) {
                setCurrentIndex(
                    (prevIndex) => (prevIndex + 1) % emergencyCampaigns.length
                );
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [isPaused, emergencyCampaigns.length]);

    const getVisibleCampaigns = () => {
        const campaigns = [];
        for (let i = 0; i < Math.min(3, emergencyCampaigns.length); i++) {
            const index = (currentIndex + i) % emergencyCampaigns.length;
            campaigns.push(emergencyCampaigns[index]);
        }
        return campaigns;
    };

    return (
        <section className="py-16 bg-rose-50/30">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12 animate-fade-in">
                    <h2 className="text-3xl font-bold mb-4 text-charcoal flex items-center justify-center gap-2">
                        <AlertTriangle className="h-8 w-8 text-rose-600" />
                        Emergency Fundraisers
                    </h2>
                    <p className="text-charcoal max-w-2xl mx-auto">
                        These urgent campaigns need immediate support. Your
                        contribution can make a life-saving difference.
                    </p>
                </div>

                <div
                    className="relative"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {getVisibleCampaigns().map((campaign) => (
                            <Card
                                key={campaign._id}
                                className="border-mint-green hover:shadow-lg transition-shadow h-full relative"
                            >
                                <div className="absolute top-3 left-3 bg-rose-600 text-white px-2 py-1 rounded-full text-xs font-medium z-10">
                                    EMERGENCY
                                </div>
                                <div className="h-48 w-full overflow-hidden rounded-t-lg">
                                    <img
                                        src={campaign.imageUrl}
                                        alt={campaign.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-lg font-bold text-charcoal">
                                            {campaign.title}
                                        </h3>
                                        <span className="text-xs bg-mint-green/20 text-forest-green px-2 py-1 rounded">
                                            {campaign.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-charcoal mb-4 line-clamp-2">
                                        {campaign.description}
                                    </p>
                                    <div className="mb-4">
                                        <div className="h-2 bg-mint-green/20 rounded-full overflow-hidden mb-2">
                                            <div
                                                className="h-full bg-rose-600"
                                                style={{
                                                    width: `${
                                                        (campaign.raisedAmount /
                                                            campaign.goalAmount) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-sm text-charcoal">
                                            <span>
                                                ₹
                                                {campaign.raisedAmount.toLocaleString()}{" "}
                                                raised
                                            </span>
                                            <span>
                                                Goal: ₹
                                                {campaign.goalAmount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-rose-600 font-medium">
                                                Only {campaign.daysLeft} days
                                                left
                                            </span>
                                            <span className="text-xs text-charcoal">
                                                {campaign.backers} supporters
                                            </span>
                                        </div>
                                        <Link to={`/campaigns/${campaign._id}`}>
                                            <Button
                                                size="sm"
                                                className="bg-rose-600 hover:bg-rose-700 text-white"
                                            >
                                                Donate Now
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="flex justify-center mt-6 gap-2">
                        {emergencyCampaigns.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full ${
                                    currentIndex === index
                                        ? "bg-rose-600"
                                        : "bg-rose-300"
                                }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                <div
                    className="text-center mt-12 animate-fade-in"
                    style={{ animationDelay: "0.4s" }}
                >
                    <Link to="/dashboard/create-campaign">
                        <Button
                            size="lg"
                            className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-3 rounded-full"
                        >
                            Start an Emergency Campaign
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default EmergencyCampaigns;
