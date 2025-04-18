import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, ExternalLink, Calendar, Heart, FileText } from "lucide-react";
import { format } from "date-fns";

const DonationHistory = () => {
    const [donations, setDonations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [totalDonated, setTotalDonated] = useState(0);

    useEffect(() => {
        const fetchDonations = async () => {
          try {
            setIsLoading(true);
      
            const response = await fetch(`${import.meta.env.VITE_API_URL}/donations`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
      
            const data = await response.json();
        
      
            if (response.ok && data) {
              setDonations(data.data);
      
              // Calculate total donated
              const total = data.reduce((sum, donation) => sum + donation.amount, 0);
              setTotalDonated(total);
            } else {
              console.error("Failed to fetch donations:", data?.message);
            }
      
          } catch (error) {
            console.error("Error fetching donations:", error);
          } finally {
            setIsLoading(false);
          }
        };
      
        fetchDonations();
      }, []);
      

    const filteredDonations = donations.filter(
        (donation) =>
            donation.campaignTitle
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            donation.receipt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-soft-white min-h-screen p-4 sm:p-6">
            <div className="mb-6 bg-warm-beige p-4 rounded-lg">
                <h1 className="text-xl sm:text-2xl font-bold text-charcoal mb-2">
                    Donation History
                </h1>
                <p className="text-sm sm:text-base text-charcoal/80">
                    A record of all your contributions to campaigns.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Card className="border border-mint-green">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="h-10 sm:h-12 w-10 sm:w-12 bg-deep-emerald/10 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                <Heart
                                    size={20}
                                    className="text-deep-emerald"
                                />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-charcoal/70">
                                    Total Donations
                                </p>
                                <p className="text-xl sm:text-2xl font-bold text-charcoal">
                                    Rs.{totalDonated}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border border-mint-green">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center">
                            <div className="h-10 sm:h-12 w-10 sm:w-12 bg-deep-emerald/10 rounded-full flex items-center justify-center mr-3 sm:mr-4">
                                <FileText
                                    size={20}
                                    className="text-deep-emerald"
                                />
                            </div>
                            <div>
                                <p className="text-xs sm:text-sm text-charcoal/70">
                                    Total Campaigns Supported
                                </p>
                                <p className="text-xl sm:text-2xl font-bold text-charcoal">
                                    {donations.length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-soft-white border border-mint-green">
                <CardHeader>
                    <CardTitle className="text-lg sm:text-xl text-charcoal">
                        Your Donations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-3 sm:gap-4 mb-4 sm:mb-6 items-stretch sm:items-center justify-between">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by campaign or receipt..."
                                className="pl-10 bg-white border border-mint-green text-charcoal text-sm sm:text-base"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Button
                            variant="outline"
                            className="w-full sm:w-auto flex items-center justify-center rounded-full border-deep-emerald text-deep-emerald bg-deep-emerald/10 hover:bg-lime-green/10 text-sm sm:text-base"
                        >
                            <Calendar className="mr-2 h-4 w-4" /> 
                            <span className="hidden sm:inline">Download Tax Statement</span>
                            <span className="sm:hidden">Tax Statement</span>
                        </Button>
                    </div>

                    {isLoading ? (
                        <div className="animate-pulse">
                            <div className="h-10 bg-gray-200 rounded mb-4"></div>
                            {[...Array(5)].map((_, index) => (
                                <div
                                    key={index}
                                    className="h-16 bg-gray-100 rounded mb-2"
                                ></div>
                            ))}
                        </div>
                    ) : filteredDonations.length > 0 ? (
                        <div className="rounded-md border border-mint-green bg-white overflow-x-auto">
                            <Table className="min-w-[600px] sm:min-w-full">
                                <TableHeader className="bg-warm-beige/40">
                                    <TableRow>
                                        <TableHead className="text-xs sm:text-sm text-charcoal font-bold">
                                            Receipt
                                        </TableHead>
                                        <TableHead className="text-xs sm:text-sm text-charcoal font-bold">
                                            Campaign
                                        </TableHead>
                                        <TableHead className="text-xs sm:text-sm text-charcoal font-bold">
                                            Date
                                        </TableHead>
                                        <TableHead className="text-left text-xs sm:text-sm text-charcoal font-bold">
                                            Amount
                                        </TableHead>
                                        <TableHead className="text-center text-xs sm:text-sm text-charcoal font-bold">
                                            View
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDonations.map((donation) => (
                                        <TableRow key={donation._id}>
                                            <TableCell className="font-medium text-xs sm:text-sm text-charcoal">
                                                {donation.receipt}
                                            </TableCell>
                                            <TableCell className="text-xs sm:text-sm text-charcoal">
                                                <span className="line-clamp-1">
                                                    {donation.campaignTitle}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-xs sm:text-sm text-charcoal">
                                                {format(
                                                    new Date(donation.date),
                                                    "MMM d, yyyy"
                                                )}
                                            </TableCell>
                                            <TableCell className="text-left font-medium text-xs sm:text-sm text-charcoal">
                                                Rs.{donation.amount}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link
                                                    to={`/campaign/${donation.campaignId}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="flex items-center text-deep-emerald hover:bg-lime-green hover:text-black rounded-full text-xs sm:text-sm"
                                                    >
                                                        <ExternalLink
                                                            size={14}
                                                            className="mr-1 sm:mr-2"
                                                        />
                                                        <span className="hidden sm:inline">View</span>
                                                    </Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-6 sm:py-10">
                            <div className="h-14 sm:h-16 w-14 sm:w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                                <Heart size={20} className="text-gray-400" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-medium text-charcoal mb-1 sm:mb-2">
                                No donations found
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6">
                                {searchQuery
                                    ? "No donations matched your search criteria."
                                    : "You haven't made any donations yet."}
                            </p>
                            {searchQuery ? (
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchQuery("")}
                                    className="text-xs sm:text-sm text-deep-emerald hover:bg-lime-green hover:text-black"
                                >
                                    Clear Search
                                </Button>
                            ) : (
                                <Link to="/">
                                    <Button className="bg-deep-emerald hover:bg-lime-green text-white hover:text-black text-xs sm:text-sm">
                                        Browse Campaigns
                                    </Button>
                                </Link>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default DonationHistory;