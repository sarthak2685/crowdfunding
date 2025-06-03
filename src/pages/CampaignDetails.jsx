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
    Image as ImageIcon,
    FileText,
    Video,
    X,
    ChevronLeft,
    ChevronRight,
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

// Cache for profile images to prevent repeated requests
const profileImageCache = new Map();
const DEFAULT_PROFILE_IMAGE = "/default-profile.png";

const MediaViewer = ({ media, onClose, currentIndex, setCurrentIndex, mediaCount, isImage }) => {
    const handlePrevious = (e) => {
        e.stopPropagation();
        setCurrentIndex(prev => prev > 0 ? prev - 1 : prev);
    };
    
    const handleNext = (e) => {
        e.stopPropagation();
        setCurrentIndex(prev => prev < mediaCount - 1 ? prev + 1 : prev);
    };
    
    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <button 
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full"
                onClick={onClose}
            >
                <X className="w-6 h-6 text-white" />
            </button>
            
            <div className="max-w-4xl max-h-[90vh] w-full relative">
                {isImage ? (
                    <img 
                        src={media} 
                        alt="Campaign media" 
                        className="max-w-full max-h-[80vh] mx-auto object-contain"
                    />
                ) : (
                    <div className="bg-white rounded-lg p-4 max-w-full max-h-[80vh] overflow-auto">
                        <div className="text-center mb-4">
                            {media.endsWith('.mp4') || media.endsWith('.webm') || media.endsWith('.mov') ? (
                                <>
                                    <Video className="w-12 h-12 mx-auto text-forest-green mb-2" />
                                    <h3 className="text-lg font-medium text-charcoal">Video Player</h3>
                                </>
                            ) : (
                                <>
                                    <FileText className="w-12 h-12 mx-auto text-forest-green mb-2" />
                                    <h3 className="text-lg font-medium text-charcoal">Document Viewer</h3>
                                </>
                            )}
                            <p className="text-gray-500 mt-2">This media type doesn't support slideshow</p>
                        </div>
                        {media.endsWith('.mp4') || media.endsWith('.webm') || media.endsWith('.mov') ? (
                            <video 
                                src={media} 
                                controls 
                                className="w-full max-h-[70vh]"
                                autoPlay
                            />
                        ) : (
                            <iframe 
                                src={media} 
                                className="w-full h-[70vh]" 
                                title="Document Viewer"
                            />
                        )}
                    </div>
                )}

                {/* Navigation Arrows - Only show for images */}
                {isImage && mediaCount > 1 && (
                    <>
                        <button
                            onClick={handlePrevious}
                            disabled={currentIndex === 0}
                            className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <ChevronLeft className="w-8 h-8 text-white" />
                        </button>
                        <button
                            onClick={handleNext}
                            disabled={currentIndex === mediaCount - 1}
                            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/30 ${currentIndex === mediaCount - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <ChevronRight className="w-8 h-8 text-white" />
                        </button>
                    </>
                )}

                {/* Indicator Dots - Only show for images */}
                {isImage && mediaCount > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {Array.from({ length: mediaCount }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all ${currentIndex === index ? 'bg-white w-6' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const MediaGallery = ({ mainImage, additionalImages, videos, documents }) => {
    const [viewerOpen, setViewerOpen] = useState(false);
    const [currentMedia, setCurrentMedia] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [autoSlide, setAutoSlide] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    
    // Separate arrays for different media types
    const allImages = [mainImage, ...additionalImages].filter(Boolean);
    const allVideos = videos.filter(Boolean);
    const allDocs = documents.filter(Boolean);
    const allItems = [...allImages, ...allVideos, ...allDocs];

    // Auto slide functionality (5 seconds) - only for images
    useEffect(() => {
        if (!autoSlide || !viewerOpen || allImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
        }, 5000); // 5 seconds

        return () => clearInterval(interval);
    }, [autoSlide, viewerOpen, allImages.length]);

    // Auto slide for main image display (5 seconds)
    useEffect(() => {
        if (allImages.length <= 1) return;

        const interval = setInterval(() => {
            setCurrentSlideIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
        }, 5000);

        return () => clearInterval(interval);
    }, [allImages.length]);

    const openMedia = (media, index) => {
        setCurrentMedia(media);
        setCurrentIndex(index);
        setViewerOpen(true);
        // Only enable auto-slide if it's an image
        setAutoSlide(allImages.includes(media));
    };

    // Check if current media is an image
    const isCurrentMediaImage = allImages.includes(currentMedia);
    // Get the image-only index for slideshow navigation
    const currentImageIndex = isCurrentMediaImage ? allImages.indexOf(currentMedia) : 0;

    return (
        <div className="mb-6 relative">
            {/* Main Image with Slide Controls */}
            <div className="relative w-full h-[500px] mb-4 rounded-lg overflow-hidden">
                {allImages[currentSlideIndex] && (
                    <>
                        <img 
                            src={allImages[currentSlideIndex]} 
                            alt="Campaign main image" 
                            className="w-full h-full object-contain cursor-pointer"
                            onClick={() => openMedia(allImages[currentSlideIndex], allItems.indexOf(allImages[currentSlideIndex]))}
                        />
                        {/* Navigation Arrows for Main Image - Only show if there are multiple images */}
                        {allImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newIndex = currentSlideIndex > 0 ? currentSlideIndex - 1 : allImages.length - 1;
                                        setCurrentSlideIndex(newIndex);
                                    }}
                                    className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white"
                                >
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const newIndex = currentSlideIndex < allImages.length - 1 ? currentSlideIndex + 1 : 0;
                                        setCurrentSlideIndex(newIndex);
                                    }}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white"
                                >
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </>
                        )}
                    </>
                )}
                
                {/* Indicator Dots for Main Image - Only show if there are multiple images */}
                {allImages.length > 1 && (
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        {allImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentSlideIndex(index);
                                }}
                                className={`w-2 h-2 rounded-full transition-all ${currentSlideIndex === index ? 'bg-white w-4' : 'bg-white/50'}`}
                            />
                        ))}
                    </div>
                )}
            </div>
            
            {/* Thumbnails Grid */}
            {allItems.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                    {allItems.map((media, index) => {
                        if (media === allImages[currentSlideIndex]) return null; // Skip currently displayed main image
                        
                        const isVideo = allVideos.includes(media);
                        const isDocument = allDocs.includes(media);
                        
                        return (
                            <div 
                                key={index}
                                className="h-28 rounded-md overflow-hidden cursor-pointer relative group"
                                onClick={() => openMedia(media, index)}
                            >
                                {isVideo ? (
                                    <div className="h-full bg-gray-100 flex items-center justify-center">
                                        <Video className="w-8 h-8 text-forest-green" />
                                    </div>
                                ) : isDocument ? (
                                    <div className="h-full bg-gray-100 flex items-center justify-center">
                                        <FileText className="w-8 h-8 text-forest-green" />
                                    </div>
                                ) : (
                                    <>
                                        <img 
                                            src={media} 
                                            alt={`Media ${index}`} 
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
            
            {/* Media Viewer Modal */}
            {viewerOpen && (
                <MediaViewer 
                    media={currentMedia}
                    onClose={() => {
                        setViewerOpen(false);
                        setAutoSlide(false);
                    }}
                    currentIndex={isCurrentMediaImage ? currentImageIndex : 0}
                    setCurrentIndex={setCurrentIndex}
                    mediaCount={isCurrentMediaImage ? allImages.length : 1}
                    isImage={isCurrentMediaImage}
                />
            )}
        </div>
    );
};

// Helper function to get profile image, using cache when possible
const getProfileImage = (profilePic) => {
    if (!profilePic) return DEFAULT_PROFILE_IMAGE;
    
    if (profileImageCache.has(profilePic)) {
        return profileImageCache.get(profilePic);
    }
    
    const fullUrl = `${import.meta.env.VITE_IMG_URL}${profilePic}`;
    profileImageCache.set(profilePic, fullUrl);
    return fullUrl;
};

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
    const [commentText, setCommentText] = useState("");

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/campaigns/${id}`
                );
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to fetch campaign");
                }

                setCampaign(data.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching campaign:", error);
                setIsLoading(false);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description:
                        "Failed to load campaign details. Please try again.",
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

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/donations`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({
                        campaignId: id,
                        amount: parseFloat(donationAmount),
                    }),
                }
            );

            if (!response.ok) throw new Error("Payment failed");
            setPaymentSuccess(true);

            // Update campaign data after successful donation
            setCampaign((prev) => ({
                ...prev,
                raisedAmount: prev.raisedAmount + parseFloat(donationAmount),
                backers: prev.backers + 1,
            }));

            // Reset after 3 seconds
            setTimeout(() => {
                setIsDonationDialogOpen(false);
                setPaymentSuccess(false);
                setIsDonating(false);

                toast({
                    title: "Thank you for your donation!",
                    description: `You have successfully donated ₹${donationAmount} to this campaign.`,
                    duration: 5000,
                });
            }, 3000);
        } catch (error) {
            console.error("Donation error:", error);
            setIsDonating(false);
            toast({
                variant: "destructive",
                title: "Donation failed",
                description:
                    error.message ||
                    "There was an error processing your donation. Please try again.",
                duration: 5000,
            });
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        
        try {
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/campaigns/${id}/comments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        content: commentText,
                    }),
                }
            );
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Failed to post comment");
            }
            
            // Add the new comment to the campaign
            setCampaign(prev => ({
                ...prev,
                comments: [
                    ...prev.comments,
                    {
                        _id: Date.now().toString(), // Temporary ID until page refresh
                        content: commentText,
                        date: new Date().toISOString(),
                        user: {
                            _id: currentUser.id,
                            name: currentUser.name,
                            profilePic: currentUser.profilePic,
                        },
                    },
                ],
            }));
            
            setCommentText("");
            
            toast({
                title: "Comment posted",
                description: "Your comment has been posted successfully.",
                duration: 3000,
            });
        } catch (error) {
            console.error("Error posting comment:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to post comment. Please try again.",
                duration: 5000,
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
                        <MediaGallery 
                            mainImage={campaign.imageUrl}
                            additionalImages={campaign.additionalImages || []}
                            videos={campaign.videos || []}
                            documents={campaign.verificationDocuments || []}
                        />

                        <h1 className="text-3xl font-bold mb-4 text-charcoal">
                            {campaign.title}
                        </h1>

                        <p className="text-gray-700 mb-6">
                            {campaign.description}
                        </p>

                        <div className="flex items-center mb-8">
                            {/* <img
                                src={getProfileImage(campaign.creator.profilePic)}
                                alt={campaign.creator.name}
                                className="w-10 h-10 rounded-full mr-3 object-cover"
                            /> */}
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
                                        __html: campaign.longDescription || campaign.story || campaign.description,
                                    }}
                                ></div>
                                
                                {campaign.videos && campaign.videos.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold mb-4 text-forest-green">Campaign Video</h3>
                                        <div className="relative pt-[56.25%] rounded-lg overflow-hidden">
                                            <video 
                                                src={campaign.videos[0]} 
                                                controls
                                                className="absolute top-0 left-0 w-full h-full object-cover"
                                                poster={campaign.imageUrl}
                                            />
                                        </div>
                                    </div>
                                )}
                                
                                {campaign.verificationDocuments && campaign.verificationDocuments.length > 0 && (
                                    <div className="mt-8">
                                        <h3 className="text-xl font-semibold mb-4 text-forest-green">Verification Documents</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {campaign.verificationDocuments.map((doc, index) => (
                                                <a 
                                                    key={index}
                                                    href={doc}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center p-4 border border-mint-green rounded-lg hover:bg-mint-green/10 transition-colors"
                                                >
                                                    <FileText className="h-8 w-8 text-forest-green mr-3" />
                                                    <div>
                                                        <p className="font-medium text-forest-green">Document {index + 1}</p>
                                                        <p className="text-sm text-gray-500">Click to view</p>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="updates" className="space-y-6">
                                {campaign.updates.length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-mint-green rounded-lg">
                                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-medium mb-2 text-charcoal">No Updates Yet</h3>
                                        <p className="text-gray-600">
                                            The campaign creator hasn't posted any updates yet.
                                        </p>
                                    </div>
                                ) : (
                                    campaign.updates.map((update) => (
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
                                    ))
                                )}
                            </TabsContent>

                            <TabsContent value="comments" className="space-y-6">
                                {campaign.comments.length === 0 ? (
                                    <div className="text-center py-12 border border-dashed border-mint-green rounded-lg mb-8">
                                        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-xl font-medium mb-2 text-charcoal">No Comments Yet</h3>
                                        <p className="text-gray-600">
                                            Be the first to leave a comment on this campaign.
                                        </p>
                                    </div>
                                ) : (
                                    campaign.comments.map((comment) => (
                                        <div
                                            key={comment._id}
                                            className="border-b border-mint-green pb-6 last:border-0"
                                        >
                                            <div className="flex items-start gap-4">
                                                <img
                                                    src={getProfileImage(comment.user.profilePic)}
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
                                    ))
                                )}

                                {currentUser ? (
                                    <div className="mt-8 pt-6 border-t border-mint-green">
                                        <h3 className="font-semibold mb-4 text-charcoal">
                                            Leave a comment
                                        </h3>
                                        <form onSubmit={handleCommentSubmit}>
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
                                                        value={commentText}
                                                        onChange={(e) => setCommentText(e.target.value)}
                                                        required
                                                    />
                                                    <Button 
                                                        type="submit"
                                                        className="bg-forest-green hover:bg-lime-green text-white px-4 py-2 rounded-full"
                                                        disabled={!commentText.trim()}
                                                    >
                                                        Post Comment
                                                    </Button>
                                                </div>
                                            </div>
                                        </form>
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
                                    <Link to="/">
                                    <Button
                                        className="flex flex-wrap w-full mb-4 bg-forest-green hover:bg-lime-green text-white px-4 py-2 rounded-full"
                                        onClick={handleDonateClick}
                                    >
                                        {/* <Heart className="mr-2 h-5 w-5" /> */}
                                        Home Page
                                    </Button>
                                    </Link>

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
                                                    new Date(campaign.endDate),
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