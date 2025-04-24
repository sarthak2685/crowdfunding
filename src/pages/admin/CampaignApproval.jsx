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
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
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

    useEffect(() => {
        let isMounted = true;

        const fetchCampaigns = async () => {
            try {
                setIsLoading(true);
                const token = localStorage.getItem("token");
                const apiUrl = import.meta.env.VITE_API_URL;

                const response = await fetch(`${apiUrl}/admin/campaigns`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (isMounted) {
                    setCampaigns(data?.data || []);
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to fetch campaigns",
                });
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        fetchCampaigns();

        return () => {
            isMounted = false;
        };
    }, []);

    const filteredCampaigns = campaigns.filter(
        (campaign) =>
            campaign.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.creator?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            campaign.description?.toLowerCase().includes(searchQuery.toLowerCase())
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

    const handleApproveCampaign = (campaign) => {
        setSelectedCampaign(campaign);
        setIsApproveDialogOpen(true);
    };

    const handleRejectCampaign = (campaign) => {
        setSelectedCampaign(campaign);
        setRejectionReason("");
        setIsRejectDialogOpen(true);
    };

    const confirmApproval = async () => {
        if (!selectedCampaign) return;

        try {
            setIsProcessing(true);
            const token = localStorage.getItem("token");
            const apiUrl = import.meta.env.VITE_API_URL;

            const response = await fetch(
                `${apiUrl}/admin/campaigns/${selectedCampaign._id}/approve`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to approve campaign");
            }

            setCampaigns(prev =>
                prev.map(c =>
                    c._id === selectedCampaign._id ? { ...c, status: "active" } : c
                )
            );

            toast({
                title: "Campaign Approved",
                description: "The campaign has been successfully approved.",
            });
            setIsApproveDialogOpen(false);
            setSelectedCampaign(null);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Approval Failed",
                description: error.message || "There was an error approving the campaign",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const confirmRejection = async () => {
        if (!selectedCampaign || !rejectionReason.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please provide a reason for rejection",
            });
            return;
        }

        try {
            setIsProcessing(true);
            const token = localStorage.getItem("token");
            const apiUrl = import.meta.env.VITE_API_URL;

            const response = await fetch(
                `${apiUrl}/admin/campaigns/${selectedCampaign._id}/reject`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ reason: rejectionReason }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to reject campaign");
            }

            setCampaigns(prev =>
                prev.map(c =>
                    c._id === selectedCampaign._id
                        ? { ...c, status: "rejected", rejectionReason }
                        : c
                )
            );

            toast({
                title: "Campaign Rejected",
                description: "The campaign has been successfully rejected.",
            });
            setIsRejectDialogOpen(false);
            setSelectedCampaign(null);
            setRejectionReason("");
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Rejection Failed",
                description: error.message || "There was an error rejecting the campaign",
            });
        } finally {
            setIsProcessing(false);
        }
    };

    const renderCampaignCards = (campaignsToRender) => {
        if (campaignsToRender.length === 0) {
            return <p className="text-center text-sm text-gray-500">No campaigns found.</p>;
        }

        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
                {campaignsToRender.map((campaign) => (
                    <Card key={campaign._id} className="overflow-hidden">
                        <div className="h-40 sm:h-48 overflow-hidden">
                            <img
                                src={(campaign.imageUrl?.[0]) || "/placeholder.svg"}
                                alt={campaign.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex justify-between items-start mb-3 sm:mb-4">
                                <h3 className="font-semibold text-base sm:text-lg line-clamp-1">
                                    {campaign.title}
                                </h3>
                                {getStatusBadge(campaign.status)}
                            </div>

                            <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">
                                {campaign.description}
                            </p>

                            <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4 text-xs sm:text-sm">
                                <div className="bg-gray-100 px-2 py-1 rounded-md">
                                    <span className="font-medium">Goal:</span> Rs.
                                    {campaign.goalAmount?.toLocaleString()}
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
                                    {campaign.creator?.name}
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
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Campaign Approvals</h1>
                <Input
                    placeholder="Search campaigns..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="max-w-sm"
                />
            </div>
            {isLoading ? (
                <div className="flex justify-center items-center py-12 text-gray-500">
                    <Loader2 className="animate-spin mr-2" /> Loading campaigns...
                </div>
            ) : (
                renderCampaignCards(filteredCampaigns)
            )}

            {/* Approve Dialog */}
            <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Campaign</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to approve this campaign?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsApproveDialogOpen(false)} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button onClick={confirmApproval} disabled={isProcessing}>
                            {isProcessing ? "Approving..." : "Approve"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Campaign</DialogTitle>
                        <DialogDescription>
                            Please provide a reason for rejection
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        placeholder="Enter rejection reason"
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        disabled={isProcessing}
                    />
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)} disabled={isProcessing}>
                            Cancel
                        </Button>
                        <Button onClick={confirmRejection} disabled={isProcessing}>
                            {isProcessing ? "Rejecting..." : "Reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default CampaignApproval;