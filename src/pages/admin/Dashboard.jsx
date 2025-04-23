import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  Users,
  IndianRupee,
  Clock,
  ArrowRightCircle,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalCampaigns: 0,
    pendingApprovals: 0,
    totalUsers: 0,
    totalDonations: 0,
  });
  const [recentCampaigns, setRecentCampaigns] = useState([]);
  const [fundraisingData, setFundraisingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
  
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
  
        const data = await response.json();
        console.log("API Response:", data); // Keep this for debugging
        
        // Updated data handling based on API response structure
        if (data.data) {
          // If data comes in a nested 'data' property
          setStats({
            totalCampaigns: data.data.totalCampaigns || 0,
            pendingApprovals: data.data.pendingApprovals || 0,
            totalUsers: data.data.totalUsers || 0,
            totalDonations: data.data.totalDonations || 0,
          });
          
          setRecentCampaigns(data.data.recentCampaigns || []);
          setFundraisingData(data.data.fundraisingData || []);
        } else {
          // If data is at the root level
          setStats({
            totalCampaigns: data.totalCampaigns || 0,
            pendingApprovals: data.pendingApprovals || 0,
            totalUsers: data.totalUsers || 0,
            totalDonations: data.totalDonations || 0,
          });
          
          setRecentCampaigns(data.recentCampaigns || []);
          setFundraisingData(data.fundraisingData || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: error.message || 'Failed to load dashboard data',
          duration: 4000,
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchDashboardData();
  }, []);
  
  

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-[#95D5B2]/20 text-[#2D6A4F] border-[#95D5B2]"
          >
            Active
          </Badge>
        );
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-[#EF476F]/20 text-[#EF476F] border-[#EF476F]"
          >
            Pending
          </Badge>
        );
      case "completed":
        return (
          <Badge
            variant="outline"
            className="bg-[#2D6A4F]/20 text-[#2D6A4F] border-[#2D6A4F]"
          >
            Completed
          </Badge>
        );
      case "rejected":
        return (
          <Badge
            variant="outline"
            className="bg-[#EF476F]/20 text-[#EF476F] border-[#EF476F]"
          >
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="bg-soft-white min-h-screen">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 bg-warm-beige p-4 sm:p-6 rounded-lg">
          <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2 text-charcoal">
            Admin Dashboard
          </h1>
          <p className="text-sm sm:text-base text-charcoal/80">
            Monitor and manage platform activity and performance.
          </p>
        </div>

        {/* Stats Cards - Responsive Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Campaigns */}
          <Card className="border-[#95D5B2]">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="h-10 sm:h-12 w-10 sm:w-12 bg-mint-green/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <TrendingUp size={20} className="text-[#2D6A4F]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-[#1B1B1E]/80">
                    Total Campaigns
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-[#1B1B1E]">
                    {stats.totalCampaigns}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="border-[#95D5B2]">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="h-10 sm:h-12 w-10 sm:w-12 bg-[#EF476F]/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <Clock size={20} className="text-[#EF476F]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-[#1B1B1E]/80">
                    Pending Approvals
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-[#1B1B1E]">
                    {stats.pendingApprovals}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card className="border-[#95D5B2]">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="h-10 sm:h-12 w-10 sm:w-12 bg-[#52B788]/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <Users size={20} className="text-[#52B788]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-[#1B1B1E]/80">
                    Total Users
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-[#1B1B1E]">
                    {stats.totalUsers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Donations */}
          <Card className="border-[#95D5B2]">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center">
                <div className="h-10 sm:h-12 w-10 sm:w-12 bg-[#40916C]/20 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                  <IndianRupee size={20} className="text-[#40916C]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-[#1B1B1E]/80">
                    Total Donations
                  </p>
                  <p className="text-lg sm:text-2xl font-bold text-[#1B1B1E]">
                    Rs.{stats.totalDonations.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chart and Pending Approvals - Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Chart */}
          <Card className="border-[#95D5B2]">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl text-[#1B1B1E]">
                Fundraising Overview
              </CardTitle>
              <CardDescription className="text-sm text-[#1B1B1E]/80">
                Monthly donation totals for the current year
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              {isLoading ? (
                <div className="h-60 sm:h-80 bg-[#FAF3DD] animate-pulse rounded-md"></div>
              ) : fundraisingData.length > 0 ? (
                <div className="h-60 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={fundraisingData}
                      margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 0,
                      }}
                    >
                      <defs>
                        <linearGradient
                          id="colorDonations"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#52B788"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="#52B788"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis
                        dataKey="month"
                        stroke="#1B1B1E"
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis
                        stroke="#1B1B1E"
                        tickFormatter={(value) =>
                          `Rs.${value.toLocaleString()}`
                        }
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#F9F9F9",
                          borderColor: "#95D5B2",
                          color: "#1B1B1E",
                          fontSize: 14,
                        }}
                        formatter={(value) => [
                          `Rs.${value.toLocaleString()}`,
                          "Donations",
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey="donations"
                        stroke="#52B788"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorDonations)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-60 sm:h-80 flex items-center justify-center text-[#1B1B1E]/80">
                  No fundraising data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card className="border-[#95D5B2]">
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6 space-y-0">
              <CardTitle className="text-lg sm:text-xl text-[#1B1B1E]">
                Pending Approvals
              </CardTitle>
              <Link to="/admin/approvals">
                <Button
                  variant="ghost"
                  className="h-8 w-8 p-0 text-[#2D6A4F] hover:bg-[#95D5B2]/20"
                >
                  <ArrowRightCircle size={18} />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-2 sm:p-4">
              {isLoading ? (
                <div className="space-y-2 sm:space-y-3">
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="h-10 sm:h-12 bg-[#FAF3DD] animate-pulse rounded-md"
                    ></div>
                  ))}
                </div>
              ) : (
                <div>
                  {recentCampaigns && recentCampaigns.filter((campaign) => campaign.status === "pending").length > 0 ? (
                    <div className="space-y-2 sm:space-y-3">
                      {recentCampaigns
                        .filter((campaign) => campaign.status === "pending")
                        .map((campaign) => (
                          <div
                            key={campaign._id}
                            className="flex items-center justify-between border-b border-[#95D5B2]/30 pb-2 sm:pb-3 last:border-0 last:pb-0"
                          >
                            <div className="max-w-[70%]">
                              <p className="text-sm sm:text-base font-medium text-[#1B1B1E] truncate">
                                {campaign.title}
                              </p>
                              <p className="text-xs text-[#1B1B1E]/80 truncate">
                                by {campaign.creator?.name || campaign.creator || "Unknown"} •{" "}
                                {format(new Date(campaign.createdAt), "MMM d, yyyy")}
                              </p>
                            </div>
                            <Link to={`/admin/campaigns/${campaign._id}`}>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#EF476F] text-[#EF476F] hover:bg-[#EF476F]/10 h-8"
                              >
                                <Eye size={14} className="mr-1" />
                                <span className="hidden xs:inline">View</span>
                              </Button>
                            </Link>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 sm:py-10">
                      <p className="text-sm sm:text-base text-[#1B1B1E]/80 mb-3 sm:mb-4">
                        No pending approvals at this time.
                      </p>
                      <Link to="/admin/approvals">
                        <Button
                          variant="outline"
                          className="border-[#52B788] text-[#52B788] hover:bg-[#52B788]/10 text-sm sm:text-base"
                        >
                          View All Campaigns
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns Table */}
        <Card className="border-[#95D5B2]">
          <CardHeader className="bg-[#FAF3DD] rounded-t-lg p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl text-[#1B1B1E]">
              Recent Campaigns
            </CardTitle>
            <CardDescription className="text-sm text-[#1B1B1E]/80">
              Overview of the most recent campaigns on the platform
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white rounded-b-lg p-2 sm:p-4">
            <Tabs defaultValue="all">
              <TabsList className="mb-4 sm:mb-6 overflow-x-auto">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-[#52B788] data-[state=active]:text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="data-[state=active]:bg-[#52B788] data-[state=active]:text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="pending"
                  className="data-[state=active]:bg-[#52B788] data-[state=active]:text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm"
                >
                  Pending
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 sm:h-10 bg-[#FAF3DD] rounded mb-3 sm:mb-4"></div>
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="h-12 sm:h-16 bg-[#FAF3DD] rounded mb-2 sm:mb-3"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-[#95D5B2]/30 overflow-x-auto">
                    <Table className="min-w-[600px]">
                      <TableHeader className="bg-[#FAF3DD]">
                        <TableRow>
                          <TableHead className="text-left text-[#1B1B1E] text-xs sm:text-sm">
                            Campaign
                          </TableHead>
                          <TableHead className="text-left text-[#1B1B1E] text-xs sm:text-sm hidden sm:table-cell">
                            Creator
                          </TableHead>
                          <TableHead className="text-left text-[#1B1B1E] text-xs sm:text-sm">
                            Status
                          </TableHead>
                          <TableHead className="text-left text-[#1B1B1E] text-xs sm:text-sm hidden xs:table-cell">
                            Created
                          </TableHead>
                          <TableHead className="text-left text-[#1B1B1E] text-xs sm:text-sm">
                            Funded
                          </TableHead>
                          <TableHead className="text-left text-[#1B1B1E] text-xs sm:text-sm">
                            View
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentCampaigns && recentCampaigns.length > 0 ? (
                          recentCampaigns.map((campaign) => (
                            <TableRow
                              key={campaign._id}
                              className="hover:bg-[#95D5B2]/10"
                            >
                              <TableCell className="font-medium text-[#1B1B1E] text-xs sm:text-sm max-w-[150px] truncate">
                                {campaign.title}
                              </TableCell>
                              <TableCell className="text-[#1B1B1E] text-xs sm:text-sm hidden sm:table-cell">
                                {campaign.creator?.name || campaign.creator || "Unknown"}
                              </TableCell>
                              <TableCell className="text-center">
                                {getStatusBadge(campaign.status)}
                              </TableCell>
                              <TableCell className="text-[#1B1B1E] text-xs sm:text-sm hidden xs:table-cell">
                                {format(
                                  new Date(campaign.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </TableCell>
                              <TableCell className="text-left">
                                <div className="w-full bg-[#FAF3DD] rounded-full h-2 sm:h-2.5">
                                  <div
                                    className="bg-[#40916C] h-2 sm:h-2.5 rounded-full"
                                    style={{
                                      width: `${Math.min(
                                        100,
                                        Math.round(
                                          (campaign.raisedAmount /
                                            campaign.goalAmount) *
                                            100
                                        )
                                      )}%`,
                                    }}
                                  ></div>
                                </div>
                                <span className="text-[#1B1B1E] text-xs sm:text-sm">
                                  {Math.round(
                                    (campaign.raisedAmount / campaign.goalAmount) *
                                      100
                                  )}
                                  %
                                </span>
                              </TableCell>
                              <TableCell className="text-left">
                                <Link to={`/campaign/${campaign._id}`}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-[#52B788] hover:bg-[#52B788]/10 h-8"
                                  >
                                    <Eye size={14} className="mr-1" />
                                    <span className="hidden sm:inline">View</span>
                                  </Button>
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-[#1B1B1E]/80">
                              No campaigns found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="active">
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 sm:h-10 bg-[#FAF3DD] rounded mb-3 sm:mb-4"></div>
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="h-12 sm:h-16 bg-[#FAF3DD] rounded mb-2 sm:mb-3"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-[#95D5B2]/30 overflow-x-auto">
                    <Table className="min-w-[600px]">
                      <TableHeader className="bg-[#FAF3DD]">
                        <TableRow>
                          <TableHead className="text-[#1B1B1E] text-xs sm:text-sm">
                            Campaign
                          </TableHead>
                          <TableHead className="text-[#1B1B1E] text-xs sm:text-sm hidden sm:table-cell">
                            Creator
                          </TableHead>
                          <TableHead className="text-[#1B1B1E] text-xs sm:text-sm">
                            Status
                          </TableHead>
                          <TableHead className="text-[#1B1B1E] text-xs sm:text-sm hidden xs:table-cell">
                            Created
                          </TableHead>
                          <TableHead className="text-right text-[#1B1B1E] text-xs sm:text-sm">
                            Funded
                          </TableHead>
                          <TableHead className="text-right text-[#1B1B1E] text-xs sm:text-sm">
                            View
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentCampaigns && recentCampaigns.filter(c => c.status === "active").length > 0 ? (
                          recentCampaigns
                            .filter((campaign) => campaign.status === "active")
                            .map((campaign) => (
                              <TableRow
                                key={campaign._id}
                                className="hover:bg-[#95D5B2]/10"
                              >
                                <TableCell className="font-medium text-[#1B1B1E] text-xs sm:text-sm max-w-[150px] truncate">
                                  {campaign.title}
                                </TableCell>
                                <TableCell className="text-[#1B1B1E] text-xs sm:text-sm hidden sm:table-cell">
                                  {campaign.creator?.name || campaign.creator || "Unknown"}
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(campaign.status)}
                                </TableCell>
                                <TableCell className="text-[#1B1B1E] text-xs sm:text-sm hidden xs:table-cell">
                                  {format(
                                    new Date(campaign.createdAt),
                                    "MMM d, yyyy"
                                  )}
                                </TableCell>
                                <TableCell className="text-right">
                                  <div className="w-full bg-[#FAF3DD] rounded-full h-2 sm:h-2.5">
                                    <div
                                      className="bg-[#40916C] h-2 sm:h-2.5 rounded-full"
                                      style={{
                                        width: `${Math.min(
                                          100,
                                          Math.round(
                                            (campaign.raisedAmount /
                                              campaign.goalAmount) *
                                              100
                                          )
                                        )}%`,
                                      }}
                                    ></div>
                                  </div>
                                  <span className="text-[#1B1B1E] text-xs sm:text-sm">
                                    {Math.round(
                                      (campaign.raisedAmount /
                                        campaign.goalAmount) *
                                        100
                                    )}
                                    %
                                  </span>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Link to={`/campaign/${campaign._id}`}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-[#52B788] hover:bg-[#52B788]/10 h-8"
                                    >
                                      <Eye size={14} className="mr-1" />
                                      <span className="hidden sm:inline">View</span>
                                    </Button>
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-[#1B1B1E]/80">
                              No active campaigns found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="pending">
                {isLoading ? (
                  <div className="animate-pulse">
                    <div className="h-8 sm:h-10 bg-[#FAF3DD] rounded mb-3 sm:mb-4"></div>
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="h-12 sm:h-16 bg-[#FAF3DD] rounded mb-2 sm:mb-3"
                      ></div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-[#95D5B2]/30 overflow-x-auto">
                    <Table className="min-w-[600px]">
                      <TableHeader className="bg-[#FAF3DD]">
                        <TableRow>
                          <TableHead className="text-[#1B1B1E] text-xs sm:text-sm">
                            Campaign
                          </TableHead>
                          <TableHead className="text-[#1B1B1E] text-xs sm:text-sm hidden sm:table-cell">
                            Creator
                          </TableHead>
                          <TableHead className="text-[#1B1B1E] text-xs sm:text-sm">
                            Status
                          </TableHead>
                          <TableHead className="text-[#1B1B1E] text-xs sm:text-sm hidden xs:table-cell">
                            Created
                          </TableHead>
                          <TableHead className="text-right text-[#1B1B1E] text-xs sm:text-sm">
                            Goal
                          </TableHead>
                          <TableHead className="text-right text-[#1B1B1E] text-xs sm:text-sm">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentCampaigns && recentCampaigns.filter(c => c.status === "pending").length > 0 ? (
                          recentCampaigns
                            .filter((campaign) => campaign.status === "pending")
                            .map((campaign) => (
                              <TableRow
                                key={campaign._id}
                                className="hover:bg-[#95D5B2]/10"
                              >
                                <TableCell className="font-medium text-[#1B1B1E] text-xs sm:text-sm max-w-[150px] truncate">
                                  {campaign.title}
                                </TableCell>
                                <TableCell className="text-[#1B1B1E] text-xs sm:text-sm hidden sm:table-cell">
                                  {campaign.creator?.name || campaign.creator || "Unknown"}
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(campaign.status)}
                                </TableCell>
                                <TableCell className="text-[#1B1B1E] text-xs sm:text-sm hidden xs:table-cell">
                                  {format(
                                    new Date(campaign.createdAt),
                                    "MMM d, yyyy"
                                  )}
                                </TableCell>
                                <TableCell className="text-right text-[#1B1B1E] text-xs sm:text-sm">
                                  Rs.{campaign.goalAmount?.toLocaleString() || "0"}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Link to={`/admin/approvals/${campaign._id}`}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-[#EF476F] text-[#EF476F] hover:bg-[#EF476F]/10 h-8"
                                    >
                                      <span className="text-xs sm:text-sm">Review</span>
                                    </Button>
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-[#1B1B1E]/80">
                              No pending campaigns found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;