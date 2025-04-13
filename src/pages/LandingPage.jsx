
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CampaignCard from '@/components/CampaignCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  LightbulbIcon, 
  DollarSign, 
  Rocket, 
  Heart, 
  TrendingUp, 
  Users, 
  Landmark 
} from 'lucide-react';

const LandingPage = () => {
  const [featuredCampaigns, setFeaturedCampaigns] = useState([]);
  const [categories, setCategories] = useState(['All', 'Education', 'Medical', 'Environment', 'Community', 'Technology']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true);
        // This would normally be a fetch to your API
        // const response = await fetch('http://localhost:5000/api/campaigns');
        // const data = await response.json();
        
        // For now, let's use dummy data
        setTimeout(() => {
          const dummyCampaigns = [
            {
              _id: '1',
              title: 'Clean Water Initiative',
              description: 'Providing clean drinking water to communities in need through sustainable water filtration systems.',
              imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
              category: 'Environment',
              goalAmount: 50000,
              raisedAmount: 32500,
              daysLeft: 15,
              backers: 128,
              createdAt: new Date('2023-12-15').toISOString(),
            },
            {
              _id: '2',
              title: 'Educational Scholarships for Underserved Youth',
              description: 'Funding scholarships for talented students from low-income families to pursue higher education.',
              imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b',
              category: 'Education',
              goalAmount: 75000,
              raisedAmount: 45000,
              daysLeft: 30,
              backers: 210,
              createdAt: new Date('2023-11-10').toISOString(),
            },
            {
              _id: '3',
              title: 'Community Health Clinic Expansion',
              description: 'Expanding our local health clinic to serve more patients with improved facilities and equipment.',
              imageUrl: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81',
              category: 'Medical',
              goalAmount: 100000,
              raisedAmount: 87500,
              daysLeft: 10,
              backers: 312,
              createdAt: new Date('2023-12-01').toISOString(),
            },
            {
              _id: '4',
              title: 'Tech Innovation Hub',
              description: 'Creating a space for young innovators to develop solutions to local problems using technology.',
              imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
              category: 'Technology',
              goalAmount: 120000,
              raisedAmount: 60000,
              daysLeft: 45,
              backers: 175,
              createdAt: new Date('2023-10-20').toISOString(),
            },
            {
              _id: '5',
              title: 'Urban Garden Project',
              description: 'Transforming vacant lots into productive community gardens to improve food security and community engagement.',
              imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05',
              category: 'Community',
              goalAmount: 30000,
              raisedAmount: 18000,
              daysLeft: 20,
              backers: 95,
              createdAt: new Date('2023-11-25').toISOString(),
            },
            {
              _id: '6',
              title: 'Emergency Medical Relief Fund',
              description: 'Providing urgent medical assistance to families affected by the recent natural disaster.',
              imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
              category: 'Medical',
              goalAmount: 200000,
              raisedAmount: 185000,
              daysLeft: 5,
              backers: 520,
              createdAt: new Date('2023-12-10').toISOString(),
            },
          ];
          
          setFeaturedCampaigns(dummyCampaigns);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        setIsLoading(false);
      }
    };
    
    fetchCampaigns();
  }, []);
  
  // Filter campaigns by category and search query
  const filteredCampaigns = featuredCampaigns.filter(campaign => {
    const matchesCategory = selectedCategory === 'All' || campaign.category === selectedCategory;
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  return (
    <>
      <Header />
      
      {/* Hero Section */}
      <section className="hero-gradient text-white pt-28 pb-20 md:pt-40 md:pb-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Fund Ideas that Change the World
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto">
            Join our community of changemakers and bring meaningful projects to life through collective funding.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto">
                Start a Campaign
              </Button>
            </Link>
            <Link to="/#campaigns">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                Explore Campaigns
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">$1.2M+</div>
              <p className="text-gray-600">Funds Raised</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">250+</div>
              <p className="text-gray-600">Successful Campaigns</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <p className="text-gray-600">Community Members</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Campaigns Section */}
      <section id="campaigns" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore Campaigns</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover meaningful projects that need your support. Every contribution makes a difference.
            </p>
          </div>
          
          {/* Search and Filters */}
          <div className="mb-10">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
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
              <div className="flex-shrink-0">
                <Tabs 
                  defaultValue="All" 
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  className="w-full md:w-auto"
                >
                  <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full md:w-auto">
                    {categories.map(category => (
                      <TabsTrigger 
                        key={category} 
                        value={category}
                        className="text-xs md:text-sm"
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </div>
          
          {/* Campaigns Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
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
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map(campaign => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-xl font-medium text-gray-700 mb-2">No campaigns found</h3>
              <p className="text-gray-500 mb-6">Try changing your search criteria or check back later for new campaigns.</p>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're starting a campaign or supporting one, our platform makes it easy to create change.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <LightbulbIcon size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">1. Create a Campaign</h3>
              <p className="text-gray-600">
                Share your idea, set a funding goal, and tell your story to inspire others to contribute.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">2. Gather Support</h3>
              <p className="text-gray-600">
                Spread the word and collect contributions from people who believe in your cause.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Rocket size={28} className="text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">3. Make It Happen</h3>
              <p className="text-gray-600">
                Receive your funds, bring your project to life, and share updates with your supporters.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link to="/register">
              <Button size="lg">Start Your Campaign</Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Fund What Matters</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore different categories of campaigns or contribute to the causes that resonate with you.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Education Category */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-36 bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <Landmark size={48} className="text-white" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">Education</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Support educational initiatives, scholarships, and learning resources.
                </p>
                <Link to="/#campaigns" className="text-primary hover:text-primary/80 text-sm font-medium">
                  Explore Education Campaigns →
                </Link>
              </div>
            </div>
            
            {/* Medical Category */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-36 bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <Heart size={48} className="text-white" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">Medical</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Fund medical treatments, healthcare projects, and medical research.
                </p>
                <Link to="/#campaigns" className="text-primary hover:text-primary/80 text-sm font-medium">
                  Explore Medical Campaigns →
                </Link>
              </div>
            </div>
            
            {/* Environment Category */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-36 bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                <TrendingUp size={48} className="text-white" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">Environment</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Support conservation efforts, sustainability projects, and eco-initiatives.
                </p>
                <Link to="/#campaigns" className="text-primary hover:text-primary/80 text-sm font-medium">
                  Explore Environment Campaigns →
                </Link>
              </div>
            </div>
            
            {/* Community Category */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-36 bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center">
                <DollarSign size={48} className="text-white" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">Community</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Fund local initiatives, neighborhood improvements, and social causes.
                </p>
                <Link to="/#campaigns" className="text-primary hover:text-primary/80 text-sm font-medium">
                  Explore Community Campaigns →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Make a Difference?
            </h2>
            <p className="text-xl mb-10">
              Join our community of changemakers and start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto">
                  Create Account
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 w-full sm:w-auto">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </>
  );
};

export default LandingPage;
