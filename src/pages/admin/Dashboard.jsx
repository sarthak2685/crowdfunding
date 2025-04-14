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
                        totalDonations: 120000,
                    };

                    const dummyRecentCampaigns = [
                        {
                            _id: "1",
                            title: "Clean Water Initiative",
                            creator: "Sarah Johnson",
                            createdAt: new Date("2024-03-15").toISOString(),
                            status: "active",
                            raisedAmount: 32500,
                            goalAmount: 50000,
                        },
                        {
                            _id: "2",
                            title: "Educational Scholarships for Underserved Youth",
                            creator: "Michael Torres",
                            createdAt: new Date("2024-03-12").toISOString(),
                            status: "active",
                            raisedAmount: 45000,
                            goalAmount: 75000,
                        },
                        {
                            _id: "3",
                            title: "Community Health Clinic Expansion",
                            creator: "Robert Chen",
                            createdAt: new Date("2024-03-10").toISOString(),
                            status: "active",
                            raisedAmount: 87500,
                            goalAmount: 100000,
                        },
                        {
                            _id: "4",
                            title: "Tech Innovation Hub",
                            creator: "Jessica Williams",
                            createdAt: new Date("2024-03-05").toISOString(),
                            status: "active",
                            raisedAmount: 60000,
                            goalAmount: 120000,
                        },
                        {
                            _id: "5",
                            title: "Art Education for Children",
                            creator: "David Thompson",
                            createdAt: new Date("2024-03-01").toISOString(),
                            status: "pending",
                            raisedAmount: 0,
                            goalAmount: 25000,
                        },
                    ];

                    const dummyFundraisingData = [
                        { month: "Jan", donations: 6500 },
                        { month: "Feb", donations: 8900 },
                        { month: "Mar", donations: 12000 },
                        { month: "Apr", donations: 9800 },
                        { month: "May", donations: 15500 },
                        { month: "Jun", donations: 18000 },
                        { month: "Jul", donations: 14000 },
                        { month: "Aug", donations: 21000 },
                        { month: "Sep", donations: 26000 },
                        { month: "Oct", donations: 22000 },
                        { month: "Nov", donations: 19000 },
                        { month: "Dec", donations: 28000 },
                    ];

                    setStats(dummyStats);
                    setRecentCampaigns(dummyRecentCampaigns);
                    setFundraisingData(dummyFundraisingData);
                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case "active":
                return "bg-[#52B788]"; // Lime Green
            case "pending":
                return "bg-[#EF476F]"; // Coral Red
            case "completed":
                return "bg-[#2D6A4F]"; // Forest Green
            case "rejected":
                return "bg-[#EF476F]"; // Coral Red
            default:
                return "bg-gray-500";
        }
    };

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
            {/* Header/Navbar would go here with forest green background */}

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8 bg-warm-beige p-6 rounded-lg">
                    <h1 className="text-2xl font-bold mb-2 text-charcoal">
                        Admin Dashboard
                    </h1>
                    <p className="text-charcoal/80">
                        Monitor and manage platform activity and performance.
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <Card className="border-[#95D5B2]">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="h-12 w-12 bg-mint-green/20 rounded-full flex items-center justify-center mr-4">
                                    <TrendingUp
                                        size={24}
                                        className="text-[#2D6A4F]"
                                    />
                                </div>
                                <div>
                                    <p className="text-[#1B1B1E]/80 text-sm">
                                        Total Campaigns
                                    </p>
                                    <p className="text-2xl font-bold text-[#1B1B1E]">
                                        {stats.totalCampaigns}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-[#95D5B2]">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="h-12 w-12 bg-[#EF476F]/20 rounded-full flex items-center justify-center mr-4">
                                    <Clock
                                        size={24}
                                        className="text-[#EF476F]"
                                    />
                                </div>
                                <div>
                                    <p className="text-[#1B1B1E]/80 text-sm">
                                        Pending Approvals
                                    </p>
                                    <p className="text-2xl font-bold text-[#1B1B1E]">
                                        {stats.pendingApprovals}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-[#95D5B2]">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="h-12 w-12 bg-[#52B788]/20 rounded-full flex items-center justify-center mr-4">
                                    <Users
                                        size={24}
                                        className="text-[#52B788]"
                                    />
                                </div>
                                <div>
                                    <p className="text-[#1B1B1E]/80 text-sm">
                                        Total Users
                                    </p>
                                    <p className="text-2xl font-bold text-[#1B1B1E]">
                                        {stats.totalUsers}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-[#95D5B2]">
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="h-12 w-12 bg-[#40916C]/20 rounded-full flex items-center justify-center mr-4">
                                    <IndianRupee
                                        size={24}
                                        className="text-[#40916C]"
                                    />
                                </div>
                                <div>
                                    <p className="text-[#1B1B1E]/80 text-sm">
                                        Total Donations
                                    </p>
                                    <p className="text-2xl font-bold text-[#1B1B1E]">
                                        Rs.
                                        {stats.totalDonations.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Chart */}
                    <Card className="lg:col-span-1 border-[#95D5B2]">
                        <CardHeader>
                            <CardTitle className="text-[#1B1B1E]">
                                Fundraising Overview
                            </CardTitle>
                            <CardDescription className="text-[#1B1B1E]/80">
                                Monthly donation totals for the current year
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="h-80 bg-[#FAF3DD] animate-pulse rounded-md"></div>
                            ) : (
                                <div className="h-80">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <AreaChart
                                            data={fundraisingData}
                                            margin={{
                                                top: 10,
                                                right: 10,
                                                left: 30,
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
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#e5e7eb"
                                            />
                                            <XAxis
                                                dataKey="month"
                                                stroke="#1B1B1E"
                                            />
                                            <YAxis
                                                stroke="#1B1B1E"
                                                tickFormatter={(value) =>
                                                    `Rs.${value.toLocaleString()}`
                                                }
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: "#F9F9F9",
                                                    borderColor: "#95D5B2",
                                                    color: "#1B1B1E",
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
                            )}
                        </CardContent>
                    </Card>

                    {/* Pending Approvals Quick View */}
                    <Card className="lg:col-span-1 border-[#95D5B2]">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-[#1B1B1E]">
                                Pending Approvals
                            </CardTitle>
                            <Link to="/admin/approvals">
                                <Button
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-[#2D6A4F] hover:bg-[#95D5B2]/20"
                                >
                                    <ArrowRightCircle size={20} />
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="space-y-3">
                                    {[...Array(5)].map((_, index) => (
                                        <div
                                            key={index}
                                            className="h-12 bg-[#FAF3DD] animate-pulse rounded-md"
                                        ></div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    {recentCampaigns.filter(
                                        (campaign) =>
                                            campaign.status === "pending"
                                    ).length > 0 ? (
                                        <div className="space-y-3">
                                            {recentCampaigns
                                                .filter(
                                                    (campaign) =>
                                                        campaign.status ===
                                                        "pending"
                                                )
                                                .map((campaign) => (
                                                    <div
                                                        key={campaign._id}
                                                        className="flex items-center justify-between border-b border-[#95D5B2]/30 pb-3 last:border-0 last:pb-0"
                                                    >
                                                        <div>
                                                            <p className="font-medium text-[#1B1B1E]">
                                                                {campaign.title}
                                                            </p>
                                                            <p className="text-sm text-[#1B1B1E]/80">
                                                                by{" "}
                                                                {
                                                                    campaign.creator
                                                                }{" "}
                                                                •{" "}
                                                                {format(
                                                                    new Date(
                                                                        campaign.createdAt
                                                                    ),
                                                                    "MMM d, yyyy"
                                                                )}
                                                            </p>
                                                        </div>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="border-[#EF476F] text-[#EF476F] hover:bg-[#EF476F]/10"
                                                        >
                                                            <Eye
                                                                size={16}
                                                                className="mr-1"
                                                            />
                                                        </Button>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-[#1B1B1E]/80 mb-4">
                                                No pending approvals at this
                                                time.
                                            </p>
                                            <Link to="/admin/approvals">
                                                <Button
                                                    variant="outline"
                                                    className="border-[#52B788] text-[#52B788] hover:bg-[#52B788]/10"
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

                {/* Recent Campaigns */}
                <Card className="border-[#95D5B2]">
                    <CardHeader className="bg-[#FAF3DD] rounded-t-lg">
                        <CardTitle className="text-[#1B1B1E]">
                            Recent Campaigns
                        </CardTitle>
                        <CardDescription className="text-[#1B1B1E]/80">
                            Overview of the most recent campaigns on the
                            platform
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="bg-white rounded-b-lg">
                        <Tabs defaultValue="all">
                            <TabsList className="mb-6 ">
                                <TabsTrigger
                                    value="all"
                                    className="data-[state=active]:bg-[#52B788] data-[state=active]:text-white px-4 py-2 rounded-full"
                                >
                                    All
                                </TabsTrigger>
                                <TabsTrigger
                                    value="active"
                                    className="data-[state=active]:bg-[#52B788] data-[state=active]:text-white px-4 py-2 rounded-full"
                                >
                                    Active
                                </TabsTrigger>
                                <TabsTrigger
                                    value="pending"
                                    className="data-[state=active]:bg-[#52B788] data-[state=active]:text-white px-4 py-2 rounded-full"
                                >
                                    Pending
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="all">
                                {isLoading ? (
                                    <div className="animate-pulse">
                                        <div className="h-10 bg-[#FAF3DD] rounded mb-4"></div>
                                        {[...Array(5)].map((_, index) => (
                                            <div
                                                key={index}
                                                className="h-16 bg-[#FAF3DD] rounded mb-2"
                                            ></div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-md border border-[#95D5B2]/30">
                                        <Table>
                                            <TableHeader className="bg-[#FAF3DD]">
                                                <TableRow>
                                                    <TableHead className="text-left text-[#1B1B1E]">
                                                        Campaign
                                                    </TableHead>
                                                    <TableHead className="text-left text-[#1B1B1E]">
                                                        Creator
                                                    </TableHead>
                                                    <TableHead className="text-left text-[#1B1B1E]">
                                                        Status
                                                    </TableHead>
                                                    <TableHead className="text-left text-[#1B1B1E]">
                                                        Created
                                                    </TableHead>
                                                    <TableHead className="text-left text-[#1B1B1E]">
                                                        Funded
                                                    </TableHead>
                                                    <TableHead className="text-left text-[#1B1B1E]">
                                                        View
                                                    </TableHead>
                                                    <TableHead></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {recentCampaigns.map(
                                                    (campaign) => (
                                                        <TableRow
                                                            key={campaign._id}
                                                            className="hover:bg-[#95D5B2]/10"
                                                        >
                                                            <TableCell className="font-medium text-[#1B1B1E]">
                                                                {campaign.title}
                                                            </TableCell>
                                                            <TableCell className="text-[#1B1B1E]">
                                                                {
                                                                    campaign.creator
                                                                }
                                                            </TableCell>
                                                            <TableCell className="text-center">
                                                                {getStatusBadge(
                                                                    campaign.status
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-[#1B1B1E]">
                                                                {format(
                                                                    new Date(
                                                                        campaign.createdAt
                                                                    ),
                                                                    "MMM d, yyyy"
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-left">
                                                                <div className="w-full bg-[#FAF3DD] rounded-full h-2.5">
                                                                    <div
                                                                        className="bg-[#40916C] h-2.5 rounded-full"
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
                                                                <span className="text-[#1B1B1E]">
                                                                    {Math.round(
                                                                        (campaign.raisedAmount /
                                                                            campaign.goalAmount) *
                                                                            100
                                                                    )}
                                                                    %
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-left">
                                                                <Link
                                                                    to={`/campaign/${campaign._id}`}
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-[#52B788] hover:bg-[#52B788]/10"
                                                                    >
                                                                        <Eye
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="mr-1"
                                                                        />
                                                                    </Button>
                                                                </Link>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="active">
                                {isLoading ? (
                                    <div className="animate-pulse">
                                        <div className="h-10 bg-[#FAF3DD] rounded mb-4"></div>
                                        {[...Array(5)].map((_, index) => (
                                            <div
                                                key={index}
                                                className="h-16 bg-[#FAF3DD] rounded mb-2"
                                            ></div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-md border border-[#95D5B2]/30">
                                        <Table>
                                            <TableHeader className="bg-[#FAF3DD]">
                                                <TableRow>
                                                    <TableHead className="text-[#1B1B1E]">
                                                        Campaign
                                                    </TableHead>
                                                    <TableHead className="text-[#1B1B1E]">
                                                        Creator
                                                    </TableHead>
                                                    <TableHead className="text-[#1B1B1E]">
                                                        Status
                                                    </TableHead>
                                                    <TableHead className="text-[#1B1B1E]">
                                                        Created
                                                    </TableHead>
                                                    <TableHead className="text-right text-[#1B1B1E]">
                                                        Funded
                                                    </TableHead>
                                                    <TableHead></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {recentCampaigns
                                                    .filter(
                                                        (campaign) =>
                                                            campaign.status ===
                                                            "active"
                                                    )
                                                    .map((campaign) => (
                                                        <TableRow
                                                            key={campaign._id}
                                                            className="hover:bg-[#95D5B2]/10"
                                                        >
                                                            <TableCell className="font-medium text-[#1B1B1E]">
                                                                {campaign.title}
                                                            </TableCell>
                                                            <TableCell className="text-[#1B1B1E]">
                                                                {
                                                                    campaign.creator
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(
                                                                    campaign.status
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-[#1B1B1E]">
                                                                {format(
                                                                    new Date(
                                                                        campaign.createdAt
                                                                    ),
                                                                    "MMM d, yyyy"
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="w-full bg-[#FAF3DD] rounded-full h-2.5">
                                                                    <div
                                                                        className="bg-[#40916C] h-2.5 rounded-full"
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
                                                                <span className="text-[#1B1B1E]">
                                                                    {Math.round(
                                                                        (campaign.raisedAmount /
                                                                            campaign.goalAmount) *
                                                                            100
                                                                    )}
                                                                    %
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Link
                                                                    to={`/campaign/${campaign._id}`}
                                                                >
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        className="text-[#52B788] hover:bg-[#52B788]/10"
                                                                    >
                                                                        <Eye
                                                                            size={
                                                                                16
                                                                            }
                                                                            className="mr-1"
                                                                        />{" "}
                                                                        View
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
                                        <div className="h-10 bg-[#FAF3DD] rounded mb-4"></div>
                                        {[...Array(5)].map((_, index) => (
                                            <div
                                                key={index}
                                                className="h-16 bg-[#FAF3DD] rounded mb-2"
                                            ></div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="rounded-md border border-[#95D5B2]/30">
                                        <Table>
                                            <TableHeader className="bg-[#FAF3DD]">
                                                <TableRow>
                                                    <TableHead className="text-[#1B1B1E]">
                                                        Campaign
                                                    </TableHead>
                                                    <TableHead className="text-[#1B1B1E]">
                                                        Creator
                                                    </TableHead>
                                                    <TableHead className="text-[#1B1B1E]">
                                                        Status
                                                    </TableHead>
                                                    <TableHead className="text-[#1B1B1E]">
                                                        Created
                                                    </TableHead>
                                                    <TableHead className="text-right text-[#1B1B1E]">
                                                        Goal
                                                    </TableHead>
                                                    <TableHead></TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {recentCampaigns
                                                    .filter(
                                                        (campaign) =>
                                                            campaign.status ===
                                                            "pending"
                                                    )
                                                    .map((campaign) => (
                                                        <TableRow
                                                            key={campaign._id}
                                                            className="hover:bg-[#95D5B2]/10"
                                                        >
                                                            <TableCell className="font-medium text-[#1B1B1E]">
                                                                {campaign.title}
                                                            </TableCell>
                                                            <TableCell className="text-[#1B1B1E]">
                                                                {
                                                                    campaign.creator
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(
                                                                    campaign.status
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-[#1B1B1E]">
                                                                {format(
                                                                    new Date(
                                                                        campaign.createdAt
                                                                    ),
                                                                    "MMM d, yyyy"
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-right text-[#1B1B1E]">
                                                                $
                                                                {campaign.goalAmount.toLocaleString()}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Link
                                                                    to={`/admin/approvals`}
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="border-[#EF476F] text-[#EF476F] hover:bg-[#EF476F]/10"
                                                                    >
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
        </div>
    );
};

export default AdminDashboard;
