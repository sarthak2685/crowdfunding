
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  AlertTriangle,
  Clock,
  Loader2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const CampaignApproval = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        // This would normally be a fetch to your API
        // const response = await fetch('http://localhost:5000/api/admin/campaigns', {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // const data = await response.json();
        
        // For now, let's use dummy data
        setTimeout(() => {
          const dummyCampaigns = [
            {
              _id: '1',
              title: 'Clean Water Initiative',
              description: 'Providing clean drinking water to communities in need through sustainable water filtration systems.',
              creator: {
                name: 'Sarah Johnson',
                email: 'sarah@example.com'
              },
              category: 'Environment',
              goalAmount: 50000,
              duration: 30,
              createdAt: new Date('2024-03-15').toISOString(),
              status: 'active',
              imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'
            },
            {
              _id: '2',
              title: 'Educational Scholarships for Underserved Youth',
              description: 'Funding scholarships for talented students from low-income families to pursue higher education.',
              creator: {
                name: 'Michael Torres',
                email: 'michael@example.com'
              },
              category: 'Education',
              goalAmount: 75000,
              duration: 45,
              createdAt: new Date('2024-03-12').toISOString(),
              status: 'pending',
              imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b'
            },
            {
              _id: '3',
              title: 'Community Health Clinic Expansion',
              description: 'Expanding our local health clinic to serve more patients with improved facilities and equipment.',
              creator: {
                name: 'Robert Chen',
                email: 'robert@example.com'
              },
              category: 'Medical',
              goalAmount: 100000,
              duration: 60,
              createdAt: new Date('2024-03-10').toISOString(),
              status: 'active',
              imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81'
            },
            {
              _id: '4',
              title: 'Tech Innovation Hub',
              description: 'Creating a space for young innovators to develop solutions to local problems using technology.',
              creator: {
                name: 'Jessica Williams',
                email: 'jessica@example.com'
              },
              category: 'Technology',
              goalAmount: 120000,
              duration: 90,
              createdAt: new Date('2024-03-05').toISOString(),
              status: 'pending',
              imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c'
            },
            {
              _id: '5',
              title: 'Art Education for Children',
              description: 'Providing art supplies and education to underprivileged children to foster creativity and self-expression.',
              creator: {
                name: 'David Thompson',
                email: 'david@example.com'
              },
              category: 'Arts',
              goalAmount: 25000,
              duration: 30,
              createdAt: new Date('2024-03-01').toISOString(),
              status: 'rejected',
              rejectionReason: 'Insufficient details about the implementation plan and budget allocation.',
              imageUrl: 'https://images.unsplash.com/photo-1495121553079-4c61bcce1894'
            },
            {
              _id: '6',
              title: 'Wildlife Conservation Project',
              description: 'Protecting endangered species through habitat preservation and anti-poaching initiatives.',
              creator: {
                name: 'Emily Rodriguez',
                email: 'emily@example.com'
              },
              category: 'Environment',
              goalAmount: 85000,
              duration: 60,
              createdAt: new Date('2024-02-28').toISOString(),
              status: 'pending',
              imageUrl: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac'
            }
          ];
          
          setCampaigns(dummyCampaigns);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setIsLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);
  
  const filteredCampaigns = campaigns.filter(campaign => 
    campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
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
    setRejectionReason('');
    setIsRejectDialogOpen(true);
  };
  
  const confirmApproval = async () => {
    try {
      setIsProcessing(true);
      
      // This would normally be a fetch to your API
      // const response = await fetch(`http://localhost:5000/api/admin/campaigns/${selectedCampaign._id}/approve`, {
      //   method: 'PUT',
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to approve campaign');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update campaigns state
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => 
          campaign._id === selectedCampaign._id 
            ? { ...campaign, status: 'active' } 
            : campaign
        )
      );
      
      setIsApproveDialogOpen(false);
      setSelectedCampaign(null);
      
      toast({
        title: 'Campaign approved',
        description: 'The campaign has been approved and is now live.',
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
      
      // This would normally be a fetch to your API
      // const response = await fetch(`http://localhost:5000/api/admin/campaigns/${selectedCampaign._id}/reject`, {
      //   method: 'PUT',
      //   headers: {
      //     Authorization: `Bearer ${localStorage.getItem('token')}`,
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ reason: rejectionReason })
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to reject campaign');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update campaigns state
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(campaign => 
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {campaignsToRender.map(campaign => (
          <Card key={campaign._id} className="overflow-hidden">
            <div className="h-48 overflow-hidden">
              <img 
                src={campaign.imageUrl || '/placeholder.svg'} 
                alt={campaign.title} 
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg line-clamp-1">{campaign.title}</h3>
                {getStatusBadge(campaign.status)}
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {campaign.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4 text-sm">
                <div className="bg-gray-100 px-2 py-1 rounded-md">
                  <span className="font-medium">Goal:</span> ${campaign.goalAmount.toLocaleString()}
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded-md">
                  <span className="font-medium">Category:</span> {campaign.category}
                </div>
                <div className="bg-gray-100 px-2 py-1 rounded-md">
                  <span className="font-medium">Duration:</span> {campaign.duration} days
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                <div>
                  <span className="font-medium">By:</span> {campaign.creator.name}
                </div>
                <div>
                  <span className="font-medium">Submitted:</span> {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                </div>
              </div>
              
              {campaign.status === 'rejected' && (
                <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-4">
                  <p className="text-red-700 text-sm font-medium mb-1">Rejection Reason:</p>
                  <p className="text-red-600 text-sm">{campaign.rejectionReason}</p>
                </div>
              )}
              
              <div className="flex flex-wrap gap-3 mt-4">
                <Button variant="outline" size="sm" onClick={() => handleViewCampaign(campaign)}>
                  <Eye size={16} className="mr-1" /> View Details
                </Button>
                
                {campaign.status === 'pending' && (
                  <>
                    <Button 
                      variant="default" 
                      size="sm" 
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => handleApproveCampaign(campaign)}
                    >
                      <CheckCircle2 size={16} className="mr-1" /> Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleRejectCampaign(campaign)}
                    >
                      <XCircle size={16} className="mr-1" /> Reject
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Campaign Management</h1>
        <p className="text-gray-600">
          Review, approve or reject campaign submissions.
        </p>
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input 
                type="text" 
                placeholder="Search campaigns..." 
                className="pl-10" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="md:w-auto w-full">
              <Filter size={16} className="mr-2" /> Filters
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="pending">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Campaigns</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCampaigns.length > 0 ? (
            renderCampaignCards(filteredCampaigns)
          ) : (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No campaigns found</h3>
              <p className="text-gray-500 mb-6">
                {searchQuery 
                  ? "No campaigns matched your search criteria." 
                  : "There are currently no campaigns in the system."}
              </p>
              {searchQuery && (
                <Button variant="outline" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              )}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="pending">
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {filteredCampaigns.filter(c => c.status === 'pending').length > 0 ? (
                renderCampaignCards(filteredCampaigns.filter(c => c.status === 'pending'))
              ) : (
                <div className="text-center py-12">
                  <Clock className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No pending campaigns
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? "No pending campaigns matched your search criteria." 
                      : "There are currently no campaigns pending review."}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" className="mt-6" onClick={() => setSearchQuery('')}>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(2)].map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {filteredCampaigns.filter(c => c.status === 'active').length > 0 ? (
                renderCampaignCards(filteredCampaigns.filter(c => c.status === 'active'))
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No active campaigns
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? "No active campaigns matched your search criteria." 
                      : "There are currently no active campaigns."}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" className="mt-6" onClick={() => setSearchQuery('')}>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {[...Array(1)].map((_, index) => (
                <Card key={index} className="overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
                    <div className="flex gap-2 mb-4">
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="flex justify-between mb-4">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                    <div className="h-20 bg-red-100 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {filteredCampaigns.filter(c => c.status === 'rejected').length > 0 ? (
                renderCampaignCards(filteredCampaigns.filter(c => c.status === 'rejected'))
              ) : (
                <div className="text-center py-12">
                  <XCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-700 mb-2">
                    No rejected campaigns
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? "No rejected campaigns matched your search criteria." 
                      : "There are currently no rejected campaigns."}
                  </p>
                  {searchQuery && (
                    <Button variant="outline" className="mt-6" onClick={() => setSearchQuery('')}>
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
      {selectedCampaign && (
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedCampaign.title}</DialogTitle>
              <DialogDescription>
                Submitted by {selectedCampaign.creator.name} on {format(new Date(selectedCampaign.createdAt), 'MMMM d, yyyy')}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 gap-4">
              <img 
                src={selectedCampaign.imageUrl || '/placeholder.svg'} 
                alt={selectedCampaign.title} 
                className="w-full h-56 object-cover rounded-md"
              />
              
              <div>
                <h3 className="font-semibold mb-2">Campaign Details</h3>
                <p className="text-gray-700">{selectedCampaign.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="font-semibold mb-2">Creator Information</h3>
                  <p className="text-gray-700 mb-1">{selectedCampaign.creator.name}</p>
                  <p className="text-gray-500 text-sm">{selectedCampaign.creator.email}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Campaign Status</h3>
                  <div>{getStatusBadge(selectedCampaign.status)}</div>
                  {selectedCampaign.status === 'rejected' && (
                    <div className="mt-2 text-red-600 text-sm">
                      {selectedCampaign.rejectionReason}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Campaign Specs</h3>
                <div className="flex flex-wrap gap-3">
                  <div className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                    <span className="font-medium">Goal:</span> ${selectedCampaign.goalAmount.toLocaleString()}
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                    <span className="font-medium">Category:</span> {selectedCampaign.category}
                  </div>
                  <div className="bg-gray-100 px-3 py-1 rounded-md text-sm">
                    <span className="font-medium">Duration:</span> {selectedCampaign.duration} days
                  </div>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              {selectedCampaign.status === 'pending' && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleRejectCampaign(selectedCampaign);
                    }}
                    className="sm:mr-2"
                  >
                    <XCircle size={16} className="mr-1" /> Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleApproveCampaign(selectedCampaign);
                    }}
                  >
                    <CheckCircle2 size={16} className="mr-1" /> Approve
                  </Button>
                </>
              )}
              {selectedCampaign.status !== 'pending' && (
                <Button onClick={() => setIsViewDialogOpen(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Approve Campaign Dialog */}
      {selectedCampaign && (
        <Dialog open={isApproveDialogOpen} onOpenChange={setIsApproveDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Approve Campaign</DialogTitle>
              <DialogDescription>
                Are you sure you want to approve this campaign? Once approved, it will be visible to all users.
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-4">
              <h3 className="font-semibold mb-1 text-green-800">{selectedCampaign.title}</h3>
              <p className="text-green-700 text-sm">by {selectedCampaign.creator.name}</p>
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsApproveDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmApproval}
                disabled={isProcessing}
                className="bg-green-600 hover:bg-green-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} className="mr-1" /> 
                    Confirm Approval
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Reject Campaign Dialog */}
      {selectedCampaign && (
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Campaign</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejection. This will be shared with the campaign creator.
              </DialogDescription>
            </DialogHeader>
            
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <h3 className="font-semibold mb-1 text-red-800">{selectedCampaign.title}</h3>
              <p className="text-red-700 text-sm">by {selectedCampaign.creator.name}</p>
            </div>
            
            <div className="space-y-2">
              <label className="font-medium text-sm">Rejection Reason</label>
              <Textarea
                placeholder="Please explain why this campaign cannot be approved..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
              />
            </div>
            
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={confirmRejection}
                disabled={isProcessing || !rejectionReason.trim()}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle size={16} className="mr-1" /> 
                    Confirm Rejection
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CampaignApproval;
