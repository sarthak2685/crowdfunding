
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  DollarSign
} from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

const CampaignDetails = () => {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [donationAmount, setDonationAmount] = useState('10');
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false);
  const [isDonating, setIsDonating] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setIsLoading(true);
        // This would normally be a fetch to your API
        // const response = await fetch(`http://localhost:5000/api/campaigns/${id}`);
        // const data = await response.json();
        
        // For now, let's use dummy data
        setTimeout(() => {
          const dummyCampaign = {
            _id: id,
            title: 'Clean Water Initiative',
            description: 'Providing clean drinking water to communities in need through sustainable water filtration systems.',
            longDescription: `
              <p>Access to clean water is a fundamental human right, yet millions around the world still lack this basic necessity. Our project aims to install sustainable water filtration systems in communities facing severe water scarcity and contamination issues.</p>
              
              <p>With your support, we will:</p>
              <ul>
                <li>Install 50 water filtration systems in rural communities</li>
                <li>Train local technicians to maintain the systems</li>
                <li>Conduct water quality testing and monitoring</li>
                <li>Educate communities on water conservation and hygiene practices</li>
              </ul>
              
              <p>Each water filtration system can provide clean drinking water for up to 200 people daily, potentially impacting 10,000 individuals in total. The systems are designed to be durable, with minimal maintenance requirements and a lifespan of up to 10 years.</p>
              
              <p>We've partnered with local organizations and government agencies to ensure the long-term sustainability of this project. Your contribution will directly fund the purchase, installation, and maintenance of these life-saving systems.</p>
              
              <p>Join us in making a tangible difference in the lives of thousands. Every donation, no matter how small, brings us one step closer to our goal of clean water for all.</p>
            `,
            imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
            category: 'Environment',
            goalAmount: 50000,
            raisedAmount: 32500,
            backers: 128,
            daysLeft: 15,
            createdAt: new Date('2023-12-15').toISOString(),
            creator: {
              _id: '123',
              name: 'Sarah Johnson',
              profilePic: 'https://i.pravatar.cc/150?img=32'
            },
            updates: [
              {
                _id: '1',
                date: new Date('2024-01-10').toISOString(),
                title: 'First 10 water filters installed!',
                content: 'We\'re excited to announce that we\'ve successfully installed the first 10 water filtration systems in Greenville community. Over 2,000 people now have access to clean drinking water!'
              },
              {
                _id: '2',
                date: new Date('2024-02-05').toISOString(),
                title: 'Partnership with Local Government',
                content: 'We\'ve secured additional support from the local government, which will help us maintain the systems for the next 5 years. This partnership ensures the long-term sustainability of our project.'
              }
            ],
            comments: [
              {
                _id: '1',
                user: {
                  name: 'Michael Roberts',
                  profilePic: 'https://i.pravatar.cc/150?img=68'
                },
                date: new Date('2024-01-15').toISOString(),
                content: 'This is an amazing initiative! I\'ve seen firsthand how access to clean water can transform communities. Keep up the great work!'
              },
              {
                _id: '2',
                user: {
                  name: 'Elizabeth Chen',
                  profilePic: 'https://i.pravatar.cc/150?img=42'
                },
                date: new Date('2024-01-20').toISOString(),
                content: 'Just donated! I\'m wondering if there are any volunteer opportunities available for this project?'
              },
              {
                _id: '3',
                user: {
                  name: 'David Thompson',
                  profilePic: 'https://i.pravatar.cc/150?img=53'
                },
                date: new Date('2024-02-01').toISOString(),
                content: 'I\'m really impressed by the comprehensive approach you\'re taking - not just installing filters but also providing education and training. This is how sustainable change happens!'
              }
            ]
          };
          
          setCampaign(dummyCampaign);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching campaign:', error);
        setIsLoading(false);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load campaign details. Please try again.',
        });
      }
    };
    
    fetchCampaign();
  }, [id]);
  
  // Calculate progress percentage
  const progress = campaign ? Math.min(Math.round((campaign.raisedAmount / campaign.goalAmount) * 100), 100) : 0;
  
  const handleDonateClick = () => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { from: `/campaign/${id}` } });
      return;
    }
    
    setIsDonationDialogOpen(true);
  };
  
  const handleDonationSubmit = async () => {
    try {
      setIsDonating(true);
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would call your payment API here
      // const response = await fetch('http://localhost:5000/api/donations', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('token')}`
      //   },
      //   body: JSON.stringify({
      //     campaignId: id,
      //     amount: parseFloat(donationAmount)
      //   })
      // });
      
      // if (!response.ok) throw new Error('Payment failed');
      
      setPaymentSuccess(true);
      
      // Update campaign data after successful donation
      setCampaign(prev => ({
        ...prev,
        raisedAmount: prev.raisedAmount + parseFloat(donationAmount),
        backers: prev.backers + 1
      }));
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsDonationDialogOpen(false);
        setPaymentSuccess(false);
        setIsDonating(false);
        
        toast({
          title: 'Thank you for your donation!',
          description: `You have successfully donated $${donationAmount} to this campaign.`,
          duration: 5000,
        });
      }, 3000);
      
    } catch (error) {
      console.error('Donation error:', error);
      setIsDonating(false);
      toast({
        variant: 'destructive',
        title: 'Donation failed',
        description: error.message || 'There was an error processing your donation. Please try again.',
        duration: 5000,
      });
    }
  };
  
  const handleShareClick = () => {
    if (navigator.share) {
      navigator.share({
        title: campaign.title,
        text: campaign.description,
        url: window.location.href,
      })
      .then(() => console.log('Shared successfully'))
      .catch((error) => console.log('Error sharing:', error));
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link copied!',
        description: 'Campaign link copied to clipboard',
        duration: 3000,
      });
    }
  };
  
  if (isLoading) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 pt-28 pb-16">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Campaign Not Found</h1>
            <p className="text-gray-600 mb-8">
              The campaign you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/">
              <Button>Back to Home</Button>
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
      
      <main className="container mx-auto px-4 pt-28 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <img 
              src={campaign.imageUrl || '/placeholder.svg'} 
              alt={campaign.title} 
              className="w-full h-80 object-cover rounded-lg mb-6"
            />
            
            <h1 className="text-3xl font-bold mb-4">{campaign.title}</h1>
            
            <p className="text-gray-700 mb-6">{campaign.description}</p>
            
            <div className="flex items-center mb-8">
              <img 
                src={campaign.creator.profilePic} 
                alt={campaign.creator.name}
                className="w-10 h-10 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="font-medium">Created by</p>
                <p className="text-primary">{campaign.creator.name}</p>
              </div>
            </div>
            
            <Tabs defaultValue="about" className="mb-8">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="updates">Updates ({campaign.updates.length})</TabsTrigger>
                <TabsTrigger value="comments">Comments ({campaign.comments.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-6">
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: campaign.longDescription }}></div>
              </TabsContent>
              
              <TabsContent value="updates" className="space-y-6">
                {campaign.updates.length > 0 ? (
                  campaign.updates.map(update => (
                    <Card key={update._id} className="overflow-hidden">
                      <div className="bg-primary/5 px-6 py-3 border-b">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{update.title}</h3>
                          <span className="text-sm text-gray-500">
                            {format(new Date(update.date), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <p>{update.content}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No updates yet. Check back soon!</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="comments" className="space-y-6">
                {campaign.comments.length > 0 ? (
                  campaign.comments.map(comment => (
                    <div key={comment._id} className="border-b pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <img 
                          src={comment.user.profilePic} 
                          alt={comment.user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">{comment.user.name}</p>
                            <span className="text-sm text-gray-500">
                              {format(new Date(comment.date), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                  </div>
                )}
                
                {currentUser ? (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="font-semibold mb-4">Leave a comment</h3>
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={20} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <Input className="mb-3" placeholder="Write your comment..." />
                        <Button>Post Comment</Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 pt-6 border-t text-center">
                    <p className="text-gray-600 mb-4">Please sign in to leave a comment</p>
                    <Link to="/login" state={{ from: `/campaign/${id}` }}>
                      <Button variant="outline">Sign In</Button>
                    </Link>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28">
              <Card className="mb-6">
                <CardContent className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full progress-bar" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="font-semibold text-2xl">${campaign.raisedAmount.toLocaleString()}</span>
                      <span className="text-gray-500">
                        raised of ${campaign.goalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Campaign Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b">
                    <div className="text-center">
                      <p className="text-2xl font-semibold">{progress}%</p>
                      <p className="text-gray-500 text-sm">Funded</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold">{campaign.backers}</p>
                      <p className="text-gray-500 text-sm">Backers</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-semibold">{campaign.daysLeft}</p>
                      <p className="text-gray-500 text-sm">Days Left</p>
                    </div>
                  </div>
                  
                  {/* Donation Button */}
                  <Button 
                    className="w-full mb-4" 
                    size="lg"
                    onClick={handleDonateClick}
                  >
                    <Heart className="mr-2 h-5 w-5" /> 
                    Back this project
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full" 
                    onClick={handleShareClick}
                  >
                    <Share2 className="mr-2 h-5 w-5" /> 
                    Share
                  </Button>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-lg mb-2">Campaign Details</h3>
                  
                  <div className="flex items-center text-gray-700">
                    <Calendar className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Created on</p>
                      <p className="text-sm">{format(new Date(campaign.createdAt), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Clock className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">End Date</p>
                      <p className="text-sm">{format(new Date(new Date().getTime() + campaign.daysLeft * 24 * 60 * 60 * 1000), 'MMMM d, yyyy')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Target className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Category</p>
                      <p className="text-sm">{campaign.category}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-700">
                    <Users className="h-5 w-5 mr-3 text-gray-400" />
                    <div>
                      <p className="font-medium">Total Backers</p>
                      <p className="text-sm">{campaign.backers} supporters</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      {/* Donation Dialog */}
      <Dialog open={isDonationDialogOpen} onOpenChange={setIsDonationDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Support this campaign</DialogTitle>
            <DialogDescription>
              Enter the amount you would like to donate to help fund this project.
            </DialogDescription>
          </DialogHeader>
          
          {paymentSuccess ? (
            <div className="py-6 text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-4">
                Your donation of ${donationAmount} has been successfully processed.
              </p>
            </div>
          ) : (
            <>
              <div className="relative mt-2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="number"
                  min="1"
                  step="1"
                  className="pl-10"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  disabled={isDonating}
                />
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {['10', '25', '50', '100'].map(amount => (
                  <Button
                    key={amount}
                    type="button"
                    variant={donationAmount === amount ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDonationAmount(amount)}
                    disabled={isDonating}
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
              
              <DialogFooter className="mt-6">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDonationDialogOpen(false)}
                  disabled={isDonating}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleDonationSubmit}
                  disabled={isDonating || parseFloat(donationAmount) <= 0}
                >
                  {isDonating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Processing...
                    </>
                  ) : (
                    'Complete Donation'
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
