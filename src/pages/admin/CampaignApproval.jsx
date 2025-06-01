import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    Search,
    Filter,
    CheckCircle2,
    XCircle,
    Eye,
    AlertTriangle,
    Clock,
    Loader2,
      Target,
       Tags,
         CalendarClock,
  CalendarDays,
  User
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const CampaignApproval = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCampaign, setSelectedCampaign] = useState(null);
    const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    const [isEmergency, setIsEmergency] = useState(false);

    useEffect(() => {
        const fetchCampaigns = async () => {
          try {
            setIsLoading(true);
      
            const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/campaigns`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
      
            const data = await response.json();
      
            if (response.ok && data) {
              setCampaigns(data.data);
            } else {
              console.error('Failed to fetch campaigns:', data?.message);
            }
          } catch (error) {
            console.error('Error fetching campaigns:', error);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchCampaigns();
      }, []);
      

    const filteredCampaigns = campaigns.filter(
        (campaign) =>
            campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status) => {
        switch (status) {
            case "active":
                return (
                    <Badge variant="outline" className="bg-[#95D5B2]/20 px-2 text-[#2D6A4F] border-[#95D5B2]">
                        Active
                    </Badge>
                );
            case "pending":
                return (
                    <Badge variant="outline" className="bg-[#EF476F]/20 px-2 text-[#EF476F] border-[#EF476F]">
                        Pending
                    </Badge>
                );
            case "rejected":
                return (
                    <Badge variant="outline" className="bg-[#EF476F]/20 px-2 text-[#EF476F] border-[#EF476F]">
                        Rejected
                    </Badge>
                );
            default:
                return <Badge variant="outline">Unknown</Badge>;
        }
    };

    const handleViewCampaign = (campaign) => {
        setSelectedCampaign(campaign);
        setIsViewDialogOpen(true);
    };

// const handleApproveCampaign = (campaign) => {
//   console.log("Campaign Clicked", campaign);
//   setSelectedCampaign(campaign);
//   setIsEmergency(campaign?.isEmergency || false); // Default to false if not set
//   setIsApproveDialogOpen(true);
// };


    const handleRejectCampaign = (campaign) => {
        setSelectedCampaign(campaign);
        setRejectionReason("");
        setIsRejectDialogOpen(true);
    };

   const handleApproveCampaign = (campaign) => {
        setSelectedCampaign(campaign);
        setIsEmergency(campaign.isEmergency || false); // Initialize emergency status
        setIsApproveDialogOpen(true);
    };

    const confirmApproval = async () => {
        try {
            setIsProcessing(true);
            
            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/admin/campaigns/${selectedCampaign._id}/approve`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ isEmergency: true }), // Send emergency status
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to approve campaign');
            }

            // Update local state with emergency status
            setCampaigns((prevCampaigns) =>
                prevCampaigns.map((campaign) =>
                    campaign._id === selectedCampaign._id
                        ? { ...campaign, status: 'active', isEmergency }
                        : campaign
                )
            );

            setIsApproveDialogOpen(false);
            setSelectedCampaign(null);
            setIsEmergency(false);

            toast({
                title: 'Campaign approved',
                description: `The campaign has been approved and marked as ${isEmergency ? 'EMERGENCY' : 'regular'}.`,
                duration: 3000,
            });
        } catch (error) {
            console.error('Error approving campaign:', error);
            toast({
                variant: 'destructive',
                title: 'Approval failed',
                description: error.message || 'There was an error approving the campaign.',
                duration: 5000,
            });
        } finally {
            setIsProcessing(false);
        }
    };
      

      const confirmRejection = async () => {
        if (!rejectionReason.trim()) {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Please provide a reason for rejection.',
            duration: 3000,
          });
          return;
        }
      
        try {
          setIsProcessing(true);
      
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/admin/campaigns/${selectedCampaign._id}/reject`,
            {
              method: 'PUT',
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ reason: rejectionReason }),
            }
          );
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to reject campaign');
          }
      
          // Update campaigns state
          setCampaigns((prevCampaigns) =>
            prevCampaigns.map((campaign) =>
              campaign._id === selectedCampaign._id
                ? { ...campaign, status: 'rejected', rejectionReason }
                : campaign
            )
          );
      
          setIsRejectDialogOpen(false);
          setSelectedCampaign(null);
          setRejectionReason('');
      
          toast({
            title: 'Campaign rejected',
            description: 'The campaign has been rejected and the creator has been notified.',
            duration: 3000,
          });
        } catch (error) {
          console.error('Error rejecting campaign:', error);
          toast({
            variant: 'destructive',
            title: 'Rejection failed',
            description: error.message || 'There was an error rejecting the campaign.',
            duration: 5000,
          });
        } finally {
          setIsProcessing(false);
        }
      };
      

const renderCampaignCards = (campaignsToRender) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
      {campaignsToRender.map((campaign) => (
        <Card key={campaign._id} className="overflow-hidden">
          <div className="h-40 sm:h-48 overflow-hidden">
            <img
              src={(campaign.imageUrl && campaign.imageUrl[0]) || "/placeholder.svg"}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
          </div>

          <CardContent className="p-4 sm:p-6">
            <div className="flex justify-between items-start mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
                  {campaign.title}
                </h3>
                {campaign.isEmergency && (
                  <Badge className="px-2 py-1 text-xs bg-red-600 text-white flex items-center gap-1 rounded-full">
                    <AlertTriangle size={12} className="text-white" />
                    Emergency
                  </Badge>
                )}
              </div>
              {getStatusBadge(campaign.status)}
            </div>

            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
              {campaign.description}
            </p>

            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4 text-xs sm:text-sm">
              <div className="bg-gray-100 px-2 py-1 rounded-md">
                <span className="font-medium">Goal:</span> Rs.
                {campaign.goalAmount.toLocaleString()}
              </div>
              <div className="bg-gray-100 px-2 py-1 rounded-md">
                <span className="font-medium">Category:</span>{" "}
                {campaign.category}
              </div>
              <div className="bg-gray-100 px-2 py-1 rounded-md">
                <span className="font-medium">Duration:</span>{" "}
                {campaign.duration} days
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              <div className="mb-1 sm:mb-0">
                <span className="font-medium">By:</span>{" "}
                {campaign.creator.name}
              </div>
              <div>
                <span className="font-medium">Submitted:</span>{" "}
                {format(new Date(campaign.createdAt), "MMM d, yyyy")}
              </div>
            </div>

            {campaign.status === "rejected" && (
              <div className="bg-red-50 border border-red-100 rounded-md p-2 sm:p-3 mb-3 sm:mb-4">
                <p className="text-red-700 text-xs sm:text-sm font-medium mb-1">
                  Rejection Reason:
                </p>
                <p className="text-red-600 text-xs sm:text-sm">
                  {campaign.rejectionReason}
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
              <Button
                variant="outline"
                size="sm"
                className="flex flex-wrap rounded-full px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm"
                onClick={() => handleViewCampaign(campaign)}
              >
                <Eye size={14} className="mr-1" /> View
              </Button>

              {campaign.status === "pending" && (
                <>
                  <Button
                    variant="default"
                    size="sm"
                    className="flex flex-wrap rounded-full px-3 sm:px-4 py-1 sm:py-2 bg-forest-green/20 hover:bg-forest-green font-semibold text-forest-green hover:text-white text-xs sm:text-sm"
                    onClick={() => handleApproveCampaign(campaign)}
                  >
                    <CheckCircle2 size={14} className="mr-1" /> Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex flex-wrap rounded-full px-3 sm:px-4 py-1 sm:py-2 text-coral-red bg-coral-red/10 hover:bg-coral-red hover:text-white text-xs sm:text-sm"
                    onClick={() => handleRejectCampaign(campaign)}
                  >
                    <XCircle size={14} className="mr-1" /> Reject
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

    return (
        <div className="px-2 sm:px-4 lg:px-6 py-4">
            <div className="mb-4 sm:mb-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Campaign Management</h1>
                <p className="text-gray-600 text-sm sm:text-base">
                    Review, approve or reject campaign submissions.
                </p>
            </div>

            <Card className="mb-6 sm:mb-8">
                <CardContent className="p-4 sm:p-6">
                    <div className="flex flex-col md:flex-row gap-3 sm:gap-4 items-start md:items-center">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search campaigns..."
                                className="pl-9 sm:pl-10 text-sm sm:text-base"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="md:w-auto w-full md:ml-2">
                            <Filter size={16} className="mr-1 sm:mr-2" />
                            <span className="hidden sm:inline">Filter</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Tabs defaultValue="all">
                <TabsList className="mb-4 sm:mb-6 gap-1 overflow-x-auto">
                    <TabsTrigger
                        value="all"
                        className="data-[state=active]:bg-[#52B788] data-[state=active]:text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm"
                    >
                        All Campaigns
                    </TabsTrigger>
                    <TabsTrigger
                        value="pending"
                        className="data-[state=active]:bg-[#52B788] data-[state=active]:text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm"
                    >
                        Pending
                    </TabsTrigger>
                    <TabsTrigger
                        value="active"
                        className="data-[state=active]:bg-[#52B788] data-[state=active]:text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm"
                    >
                        Active
                    </TabsTrigger>
                    <TabsTrigger
                        value="rejected"
                        className="data-[state=active]:bg-[#52B788] data-[state=active]:text-white px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm"
                    >
                        Rejected
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {[...Array(4)].map((_, index) => (
                                <Card key={index} className="overflow-hidden animate-pulse">
                                    <div className="h-40 sm:h-48 bg-gray-200"></div>
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
                                        <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2 w-full"></div>
                                        <div className="h-3 sm:h-4 bg-gray-200 rounded mb-3 sm:mb-4 w-5/6"></div>
                                        <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4">
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4">
                                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3 mb-1 sm:mb-0"></div>
                                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3"></div>
                                        </div>
                                        <div className="flex gap-1 sm:gap-2">
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : filteredCampaigns.length > 0 ? (
                        renderCampaignCards(filteredCampaigns)
                    ) : (
                        <div className="text-center py-8 sm:py-12">
                            <AlertTriangle className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 mx-auto mb-3 sm:mb-4" />
                            <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-1 sm:mb-2">
                                No campaigns found
                            </h3>
                            <p className="text-gray-500 text-sm sm:text-base mb-4 sm:mb-6">
                                {searchQuery
                                    ? "No campaigns matched your search criteria."
                                    : "There are currently no campaigns in the system."}
                            </p>
                            {searchQuery && (
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchQuery("")}
                                    className="text-xs sm:text-sm"
                                >
                                    Clear Search
                                </Button>
                            )}
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="pending">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {[...Array(2)].map((_, index) => (
                                <Card key={index} className="overflow-hidden animate-pulse">
                                    <div className="h-40 sm:h-48 bg-gray-200"></div>
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
                                        <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2 w-full"></div>
                                        <div className="h-3 sm:h-4 bg-gray-200 rounded mb-3 sm:mb-4 w-5/6"></div>
                                        <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4">
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4">
                                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3 mb-1 sm:mb-0"></div>
                                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3"></div>
                                        </div>
                                        <div className="flex gap-1 sm:gap-2">
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredCampaigns.filter((c) => c.status === "pending").length > 0 ? (
                                renderCampaignCards(filteredCampaigns.filter((c) => c.status === "pending"))
                            ) : (
                                <div className="text-center py-8 sm:py-12">
                                    <Clock className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 mx-auto mb-3 sm:mb-4" />
                                    <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-1 sm:mb-2">
                                        No pending campaigns
                                    </h3>
                                    <p className="text-gray-500 text-sm sm:text-base">
                                        {searchQuery
                                            ? "No pending campaigns matched your search criteria."
                                            : "There are currently no campaigns pending review."}
                                    </p>
                                    {searchQuery && (
                                        <Button
                                            variant="outline"
                                            className="mt-4 sm:mt-6 text-xs sm:text-sm"
                                            onClick={() => setSearchQuery("")}
                                        >
                                            Clear Search
                                        </Button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </TabsContent>

                <TabsContent value="active">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {[...Array(2)].map((_, index) => (
                                <Card key={index} className="overflow-hidden animate-pulse">
                                    <div className="h-40 sm:h-48 bg-gray-200"></div>
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
                                        <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2 w-full"></div>
                                        <div className="h-3 sm:h-4 bg-gray-200 rounded mb-3 sm:mb-4 w-5/6"></div>
                                        <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4">
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4">
                                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3 mb-1 sm:mb-0"></div>
                                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3"></div>
                                        </div>
                                        <div className="flex gap-1 sm:gap-2">
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredCampaigns.filter((c) => c.status === "active").length > 0 ? (
                                renderCampaignCards(filteredCampaigns.filter((c) => c.status === "active"))
                            ) : (
                                <div className="text-center py-8 sm:py-12">
                                    <CheckCircle2 className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                                    <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-1 sm:mb-2">
                                        No active campaigns
                                    </h3>
                                    <p className="text-gray-500 text-sm sm:text-base">
                                        {searchQuery
                                            ? "No active campaigns matched your search criteria."
                                            : "There are currently no active campaigns."}
                                    </p>
                                    {searchQuery && (
                                        <Button
                                            variant="outline"
                                            className="mt-4 sm:mt-6 text-xs sm:text-sm"
                                            onClick={() => setSearchQuery("")}
                                        >
                                            Clear Search
                                        </Button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </TabsContent>

                <TabsContent value="rejected">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                            {[...Array(1)].map((_, index) => (
                                <Card key={index} className="overflow-hidden animate-pulse">
                                    <div className="h-40 sm:h-48 bg-gray-200"></div>
                                    <CardContent className="p-4 sm:p-6">
                                        <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
                                        <div className="h-3 sm:h-4 bg-gray-200 rounded mb-2 w-full"></div>
                                        <div className="h-3 sm:h-4 bg-gray-200 rounded mb-3 sm:mb-4 w-5/6"></div>
                                        <div className="flex gap-1 sm:gap-2 mb-3 sm:mb-4">
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                        <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4">
                                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3 mb-1 sm:mb-0"></div>
                                            <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3"></div>
                                        </div>
                                        <div className="h-16 sm:h-20 bg-red-100 rounded mb-3 sm:mb-4"></div>
                                        <div className="flex gap-1 sm:gap-2">
                                            <div className="h-6 sm:h-8 bg-gray-200 rounded w-1/4"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <>
                            {filteredCampaigns.filter((c) => c.status === "rejected").length > 0 ? (
                                renderCampaignCards(filteredCampaigns.filter((c) => c.status === "rejected"))
                            ) : (
                                <div className="text-center py-8 sm:py-12">
                                    <XCircle className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
                                    <h3 className="text-lg sm:text-xl font-medium text-gray-700 mb-1 sm:mb-2">
                                        No rejected campaigns
                                    </h3>
                                    <p className="text-gray-500 text-sm sm:text-base">
                                        {searchQuery
                                            ? "No rejected campaigns matched your search criteria."
                                            : "There are currently no rejected campaigns."}
                                    </p>
                                    {searchQuery && (
                                        <Button
                                            variant="outline"
                                            className="mt-4 sm:mt-6 text-xs sm:text-sm"
                                            onClick={() => setSearchQuery("")}
                                        >
                                            Clear Search
                                        </Button>
                                    )}
                                </div>
                            )}
                        </>
                    )}
                </TabsContent>
            </Tabs>

            {/* Campaign Details Dialog */}
            {selectedCampaign && isViewDialogOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
    <div className="bg-white rounded-lg max-w-3xl w-full p-5 relative overflow-y-auto max-h-[90vh]">
      <button
        onClick={() => setIsViewDialogOpen(false)}
        className="absolute top-3 right-3 text-gray-500 hover:text-black"
      >
        ✕
      </button>

      <h2 className="text-xl font-semibold mb-1">{selectedCampaign.title}</h2>
      <p className="text-sm text-gray-500 mb-4">
        Submitted by {selectedCampaign.creator.name} on {new Date(selectedCampaign.createdAt).toLocaleDateString()}
      </p>

      <img
        src={selectedCampaign.imageUrl}
        alt={selectedCampaign.title}
        className="w-full h-56 object-cover rounded mb-4"
      />

      <p className="text-sm mb-4 text-gray-700"><strong>Description:</strong> {selectedCampaign.description}</p>
      <p className="text-sm mb-4 text-gray-700"><strong>Story:</strong> {selectedCampaign.story}</p>

      {selectedCampaign.videos?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-1">Videos</h3>
          {selectedCampaign.videos.map((video, idx) => (
            <video key={idx} controls className="w-full rounded mb-2">
              <source src={video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ))}
        </div>
      )}

      {selectedCampaign.verificationDocuments?.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-1">Documents</h3>
          {selectedCampaign.verificationDocuments.map((doc, idx) => (
            <a
              key={idx}
              href={doc}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 hover:underline text-sm mb-1"
            >
              Document {idx + 1}
            </a>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-sm mb-4">
        <span className="bg-gray-100 px-3 py-1 rounded">
          Goal: ${selectedCampaign.goalAmount}
        </span>
        <span className="bg-gray-100 px-3 py-1 rounded">
          Category: {selectedCampaign.category}
        </span>
        <span className="bg-gray-100 px-3 py-1 rounded">
          Duration: {selectedCampaign.duration} days
        </span>
      </div>

      {selectedCampaign.status === "rejected" && (
        <div className="text-red-600 mb-4 text-sm">
          Rejection Reason: {selectedCampaign.rejectionReason}
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        {selectedCampaign.status === "pending" ? (
          <>
            <button
              onClick={() => {
                setIsViewDialogOpen(false);
                handleRejectCampaign(selectedCampaign);
              }}
              className="px-4 py-2 border border-red-500 text-red-500 rounded hover:bg-red-50 text-sm"
            >
              Reject
            </button>
            <button
              onClick={() => {
                setIsViewDialogOpen(false);
                handleApproveCampaign(selectedCampaign);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Approve
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsViewDialogOpen(false)}
            className="px-4 py-2 bg-gray-200 text-sm rounded hover:bg-gray-300"
          >
            Close
          </button>
        )}
      </div>
    </div>
  </div>
)}



            {/* Approve Campaign Dialog */}
    {isApproveDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-4 sm:p-6">
                <h2 className="text-lg font-semibold mb-2">Approve Campaign</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to approve this campaign? Once approved, it will be visible to all users.
                </p>

                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                    <h3 className="font-semibold text-green-800 text-sm">
                        {selectedCampaign?.title}
                    </h3>
                    <p className="text-green-700 text-xs">by {selectedCampaign?.creator?.name}</p>
                </div>

                {/* Emergency Toggle Section */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
                    <input
                        type="checkbox"
                        id="emergencyToggle"
                        checked={isEmergency}
                        onChange={(e) => setIsEmergency(e.target.checked)}
                        className="h-5 w-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                    />
                    <div>
                        <label htmlFor="emergencyToggle" className="block text-sm font-medium text-gray-700">
                            Emergency Campaign
                        </label>
                        <p className="text-xs text-gray-500">
                            Enabling this will prioritize this campaign in emergency listings
                        </p>
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => {
                            setIsApproveDialogOpen(false);
                            setIsEmergency(false);
                        }}
                        className="text-sm px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={confirmApproval}
                        disabled={isProcessing}
                        className="text-sm px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                    >
                        {isProcessing && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isProcessing ? 'Processing...' : 'Confirm Approval'}
                    </button>
                </div>
            </div>
        </div>
    )}



          {/* Reject Campaign Dialog */}
          {isRejectDialogOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white rounded-lg shadow-lg max-w-xl w-full p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-2">Reject Campaign</h2>
      <p className="text-sm text-gray-600 mb-4">
        Please provide a reason for rejection. This will be shared with the campaign creator.
      </p>

      <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
        <h3 className="font-semibold text-red-800 text-sm">
          {selectedCampaign?.title}
        </h3>
        <p className="text-red-700 text-xs">by {selectedCampaign?.creator?.name}</p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Rejection Reason</label>
        <textarea
          rows={4}
          value={rejectionReason}
          onChange={(e) => setRejectionReason(e.target.value)}
          placeholder="Please explain why this campaign cannot be approved..."
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsRejectDialogOpen(false)}
          className="text-sm px-3 py-1 border rounded text-gray-700 hover:bg-gray-100"
          disabled={isProcessing}
        >
          Cancel
        </button>
        <button
          onClick={confirmRejection}
          disabled={isProcessing || !rejectionReason.trim()}
          className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 flex items-center"
        >
          {isProcessing && (
            <svg className="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
          )}
          {isProcessing ? 'Processing...' : (
            <>
              <XCircle size={16} className="mr-1" />
              Confirm Rejection
            </>
          )}
        </button>
      </div>
    </div>
  </div>
)}

        </div>
    );
};

export default CampaignApproval;
