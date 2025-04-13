
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import CampaignCard from '@/components/CampaignCard';
import { 
  Wallet, 
  TrendingUp, 
  PlusCircle, 
  ArrowRightCircle, 
  Heart 
} from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userStats, setUserStats] = useState({
    totalDonated: 0,
    campaignsSupported: 0,
    campaignsCreated: 0
  });
  const [recentDonations, setRecentDonations] = useState([]);
  const [userCampaigns, setUserCampaigns] = useState([]);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // This would normally be a fetch to your API
        // const response = await fetch('http://localhost:5000/api/users/dashboard', {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // const data = await response.json();
        
        // For now, let's use dummy data
        setTimeout(() => {
          const dummyData = {
            stats: {
              totalDonated: 750,
              campaignsSupported: 5,
              campaignsCreated: 2
            },
            recentDonations: [
              {
                _id: '1',
                campaignId: '1',
                campaignTitle: 'Clean Water Initiative',
                amount: 250,
                date: new Date('2024-01-15').toISOString()
              },
              {
                _id: '2',
                campaignId: '3',
                campaignTitle: 'Community Health Clinic Expansion',
                amount: 100,
                date: new Date('2024-02-05').toISOString()
              },
              {
                _id: '3',
                campaignId: '5',
                campaignTitle: 'Urban Garden Project',
                amount: 75,
                date: new Date('2024-02-20').toISOString()
              }
            ],
            userCampaigns: [
              {
                _id: '7',
                title: 'Education for All',
                description: 'Providing educational resources and support to underserved communities.',
                imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
                category: 'Education',
                goalAmount: 20000,
                raisedAmount: 5000,
                daysLeft: 25,
                backers: 42,
                createdAt: new Date('2024-01-05').toISOString(),
                status: 'active'
              },
              {
                _id: '8',
                title: 'Youth Coding Camp',
                description: 'Teaching coding and technology skills to disadvantaged youth.',
                imageUrl: 'https://images.unsplash.com/photo-1498936178812-4b2e558d2937',
                category: 'Technology',
                goalAmount: 15000,
                raisedAmount: 12000,
                daysLeft: 5,
                backers: 78,
                createdAt: new Date('2023-12-10').toISOString(),
                status: 'active'
              }
            ]
          };
          
          setUserStats(dummyData.stats);
          setRecentDonations(dummyData.recentDonations);
          setUserCampaigns(dummyData.userCampaigns);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Your Dashboard</h1>
        <p className="text-gray-600">
          Welcome back, {currentUser?.name}! Here's an overview of your activity.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Wallet size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Donated</p>
                <p className="text-2xl font-bold">${userStats.totalDonated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <Heart size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Campaigns Supported</p>
                <p className="text-2xl font-bold">{userStats.campaignsSupported}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <TrendingUp size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Campaigns Created</p>
                <p className="text-2xl font-bold">{userStats.campaignsCreated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Your Campaigns */}
      <div className="mb-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Campaigns</h2>
          <Link to="/dashboard/create-campaign">
            <Button>
              <PlusCircle size={18} className="mr-2" />
              Create Campaign
            </Button>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, index) => (
              <Card key={index} className="h-[400px] animate-pulse">
                <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                <CardContent className="p-5">
                  <div className="h-6 bg-gray-200 rounded mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6 w-5/6"></div>
                  <div className="h-2 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between mb-6">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : userCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userCampaigns.map(campaign => (
              <CampaignCard key={campaign._id} campaign={campaign} />
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="p-10 text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlusCircle size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No campaigns yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first campaign and start raising funds for your cause.
              </p>
              <Link to="/dashboard/create-campaign">
                <Button>Create Your First Campaign</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Recent Donations */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Recent Donations</h2>
          <Link to="/dashboard/donations" className="text-primary hover:text-primary/80 flex items-center">
            View All <ArrowRightCircle size={16} className="ml-1" />
          </Link>
        </div>
        
        {isLoading ? (
          <Card>
            <CardContent className="p-0">
              <div className="animate-pulse">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="border-b last:border-0 p-4">
                    <div className="flex justify-between mb-2">
                      <div className="h-5 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-5 bg-gray-200 rounded w-1/5"></div>
                    </div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : recentDonations.length > 0 ? (
          <Card>
            <CardContent className="p-0">
              {recentDonations.map((donation, index) => (
                <div 
                  key={donation._id} 
                  className={`p-4 flex justify-between items-center ${
                    index < recentDonations.length - 1 ? 'border-b' : ''
                  }`}
                >
                  <div>
                    <Link 
                      to={`/campaign/${donation.campaignId}`}
                      className="font-medium hover:text-primary transition-colors"
                    >
                      {donation.campaignTitle}
                    </Link>
                    <p className="text-sm text-gray-500">
                      {new Date(donation.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="font-semibold">${donation.amount}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gray-50 border-dashed">
            <CardContent className="p-10 text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart size={32} className="text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">No donations yet</h3>
              <p className="text-gray-600 mb-6">
                Once you support a campaign, your donations will appear here.
              </p>
              <Link to="/">
                <Button>Explore Campaigns</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
