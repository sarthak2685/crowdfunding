
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  ArrowRightCircle, 
  Eye 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    pendingApprovals: 0,
    totalUsers: 0,
    totalDonations: 0
  });
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [fundraisingData, setFundraisingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // This would normally be a fetch to your API
        // const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        //   headers: {
        //     Authorization: `Bearer ${localStorage.getItem('token')}`
        //   }
        // });
        // const data = await response.json();
        
        // For now, let's use dummy data
        setTimeout(() => {
          const dummyStats = {
            totalCampaigns: 250,
            pendingApprovals: 12,
            totalUsers: 1250,
            totalDonations: 120000
          };
          
          const dummyRecentCampaigns = [
            {
              _id: '1',
              title: 'Clean Water Initiative',
              creator: 'Sarah Johnson',
              createdAt: new Date('2024-03-15').toISOString(),
              status: 'active',
              raisedAmount: 32500,
              goalAmount: 50000
            },
            {
              _id: '2',
              title: 'Educational Scholarships for Underserved Youth',
              creator: 'Michael Torres',
              createdAt: new Date('2024-03-12').toISOString(),
              status: 'active',
              raisedAmount: 45000,
              goalAmount: 75000
            },
            {
              _id: '3',
              title: 'Community Health Clinic Expansion',
              creator: 'Robert Chen',
              createdAt: new Date('2024-03-10').toISOString(),
              status: 'active',
              raisedAmount: 87500,
              goalAmount: 100000
            },
            {
              _id: '4',
              title: 'Tech Innovation Hub',
              creator: 'Jessica Williams',
              createdAt: new Date('2024-03-05').toISOString(),
              status: 'active',
              raisedAmount: 60000,
              goalAmount: 120000
            },
            {
              _id: '5',
              title: 'Art Education for Children',
              creator: 'David Thompson',
              createdAt: new Date('2024-03-01').toISOString(),
              status: 'pending',
              raisedAmount: 0,
              goalAmount: 25000
            }
          ];
          
          const dummyFundraisingData = [
            { month: 'Jan', donations: 6500 },
            { month: 'Feb', donations: 8900 },
            { month: 'Mar', donations: 12000 },
            { month: 'Apr', donations: 9800 },
            { month: 'May', donations: 15500 },
            { month: 'Jun', donations: 18000 },
            { month: 'Jul', donations: 14000 },
            { month: 'Aug', donations: 21000 },
            { month: 'Sep', donations: 26000 },
            { month: 'Oct', donations: 22000 },
            { month: 'Nov', donations: 19000 },
            { month: 'Dec', donations: 28000 }
          ];
          
          setStats(dummyStats);
          setRecentCampaigns(dummyRecentCampaigns);
          setFundraisingData(dummyFundraisingData);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      case 'rejected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Completed</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Monitor and manage platform activity and performance.
        </p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <TrendingUp size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Campaigns</p>
                <p className="text-2xl font-bold">{stats.totalCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mr-4">
                <Clock size={24} className="text-orange-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Pending Approvals</p>
                <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <Users size={24} className="text-blue-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <DollarSign size={24} className="text-green-500" />
              </div>
              <div>
                <p className="text-gray-500 text-sm">Total Donations</p>
                <p className="text-2xl font-bold">${stats.totalDonations.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Chart */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Fundraising Overview</CardTitle>
            <CardDescription>
              Monthly donation totals for the current year
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-80 bg-gray-100 animate-pulse rounded-md"></div>
            ) : (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={fundraisingData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient id="colorDonations" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6E55FF" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6E55FF" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" />
                    <YAxis tickFormatter={(value) => `$${value.toLocaleString()}`} />
                    <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Donations']} />
                    <Area 
                      type="monotone" 
                      dataKey="donations" 
                      stroke="#6E55FF"
                      strokeWidth={2}  
                      fillOpacity={1} 
                      fill="url(#colorDonations)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Pending Approvals Quick View */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Pending Approvals</CardTitle>
            <Link to="/admin/approvals">
              <Button variant="ghost" className="h-8 w-8 p-0">
                <ArrowRightCircle size={20} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, index) => (
                  <div key={index} className="h-12 bg-gray-100 animate-pulse rounded-md"></div>
                ))}
              </div>
            ) : (
              <div>
                {recentCampaigns.filter(campaign => campaign.status === 'pending').length > 0 ? (
                  <div className="space-y-3">
                    {recentCampaigns
                      .filter(campaign => campaign.status === 'pending')
                      .map(campaign => (
                        <div key={campaign._id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                          <div>
                            <p className="font-medium">{campaign.title}</p>
                            <p className="text-sm text-gray-500">by {campaign.creator} • {format(new Date(campaign.createdAt), 'MMM d, yyyy')}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye size={16} className="mr-1" /> Review
                          </Button>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500 mb-4">No pending approvals at this time.</p>
                    <Link to="/admin/approvals">
                      <Button variant="outline">View All Campaigns</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Campaigns</CardTitle>
          <CardDescription>
            Overview of the most recent campaigns on the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 rounded mb-4"></div>
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-16 bg-gray-100 rounded mb-2"></div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Funded</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentCampaigns.map((campaign) => (
                        <TableRow key={campaign._id}>
                          <TableCell className="font-medium">{campaign.title}</TableCell>
                          <TableCell>{campaign.creator}</TableCell>
                          <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                          <TableCell>{format(new Date(campaign.createdAt), 'MMM d, yyyy')}</TableCell>
                          <TableCell className="text-right">
                            {Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)}%
                          </TableCell>
                          <TableCell className="text-right">
                            <Link to={`/campaign/${campaign._id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye size={16} className="mr-1" /> View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="active">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 rounded mb-4"></div>
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-16 bg-gray-100 rounded mb-2"></div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Funded</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentCampaigns
                        .filter(campaign => campaign.status === 'active')
                        .map((campaign) => (
                          <TableRow key={campaign._id}>
                            <TableCell className="font-medium">{campaign.title}</TableCell>
                            <TableCell>{campaign.creator}</TableCell>
                            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                            <TableCell>{format(new Date(campaign.createdAt), 'MMM d, yyyy')}</TableCell>
                            <TableCell className="text-right">
                              {Math.round((campaign.raisedAmount / campaign.goalAmount) * 100)}%
                            </TableCell>
                            <TableCell className="text-right">
                              <Link to={`/campaign/${campaign._id}`}>
                                <Button variant="ghost" size="sm">
                                  <Eye size={16} className="mr-1" /> View
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="pending">
              {isLoading ? (
                <div className="animate-pulse">
                  <div className="h-10 bg-gray-200 rounded mb-4"></div>
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="h-16 bg-gray-100 rounded mb-2"></div>
                  ))}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Campaign</TableHead>
                        <TableHead>Creator</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Goal</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentCampaigns
                        .filter(campaign => campaign.status === 'pending')
                        .map((campaign) => (
                          <TableRow key={campaign._id}>
                            <TableCell className="font-medium">{campaign.title}</TableCell>
                            <TableCell>{campaign.creator}</TableCell>
                            <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                            <TableCell>{format(new Date(campaign.createdAt), 'MMM d, yyyy')}</TableCell>
                            <TableCell className="text-right">
                              ${campaign.goalAmount.toLocaleString()}
                            </TableCell>
                            <TableCell className="text-right">
                              <Link to={`/admin/approvals`}>
                                <Button variant="outline" size="sm">
                                  Review
                                </Button>
                              </Link>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
