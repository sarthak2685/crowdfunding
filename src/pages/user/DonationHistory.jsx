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
                // This would normally be a fetch to your API
                // const response = await fetch('http://localhost:5000/api/donations', {
                //   headers: {
                //     Authorization: `Bearer ${localStorage.getItem('token')}`
                //   }
                // });
                // const data = await response.json();

                // For now, let's use dummy data
                setTimeout(() => {
                    const dummyDonations = [
                        {
                            _id: "1",
                            campaignId: "1",
                            campaignTitle: "Clean Water Initiative",
                            amount: 250,
                            date: new Date("2024-01-15").toISOString(),
                            status: "completed",
                            receipt: "REC-12345",
                        },
                        {
                            _id: "2",
                            campaignId: "3",
                            campaignTitle: "Community Health Clinic Expansion",
                            amount: 100,
                            date: new Date("2024-02-05").toISOString(),
                            status: "completed",
                            receipt: "REC-12346",
                        },
                        {
                            _id: "3",
                            campaignId: "5",
                            campaignTitle: "Urban Garden Project",
                            amount: 75,
                            date: new Date("2024-02-20").toISOString(),
                            status: "completed",
                            receipt: "REC-12347",
                        },
                        {
                            _id: "4",
                            campaignId: "2",
                            campaignTitle:
                                "Educational Scholarships for Underserved Youth",
                            amount: 150,
                            date: new Date("2024-03-10").toISOString(),
                            status: "completed",
                            receipt: "REC-12348",
                        },
                        {
                            _id: "5",
                            campaignId: "6",
                            campaignTitle: "Emergency Medical Relief Fund",
                            amount: 200,
                            date: new Date("2024-03-15").toISOString(),
                            status: "completed",
                            receipt: "REC-12349",
                        },
                    ];

                    setDonations(dummyDonations);

                    // Calculate total donated
                    const total = dummyDonations.reduce(
                        (sum, donation) => sum + donation.amount,
                        0
                    );
                    setTotalDonated(total);

                    setIsLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Error fetching donations:", error);
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
        <div className="bg-soft-white min-h-screen p-6">
            <div className="mb-6 bg-warm-beige p-4 rounded-lg">
                <h1 className="text-2xl font-bold text-charcoal mb-2">
                    Donation History
                </h1>
                <p className="text-charcoal/80">
                    A record of all your contributions to campaigns.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Card className="border border-mint-green">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="h-12 w-12 bg-deep-emerald/10 rounded-full flex items-center justify-center mr-4">
                                <Heart
                                    size={24}
                                    className="text-deep-emerald"
                                />
                            </div>
                            <div>
                                <p className="text-sm text-charcoal/70">
                                    Total Donations
                                </p>
                                <p className="text-2xl font-bold text-charcoal">
                                    Rs.{totalDonated}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className=" border border-mint-green">
                    <CardContent className="p-6">
                        <div className="flex items-center">
                            <div className="h-12 w-12 bg-deep-emerald/10 rounded-full flex items-center justify-center mr-4">
                                <FileText
                                    size={24}
                                    className="text-deep-emerald"
                                />
                            </div>
                            <div>
                                <p className="text-sm text-charcoal/70">
                                    Total Campaigns Supported
                                </p>
                                <p className="text-2xl font-bold text-charcoal">
                                    {donations.length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-soft-white border border-mint-green">
                <CardHeader>
                    <CardTitle className="text-charcoal">
                        Your Donations
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
                        <div className="relative w-full md:w-auto md:min-w-[300px]">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by campaign or receipt..."
                                className="pl-10 bg-white border border-mint-green text-charcoal"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        <Button
                            variant="outline"
                            className="w-full md:w-auto flex flex-wrap rounded-full border-deep-emerald text-deep-emerald bg-deep-emerald/10 hover:bg-lime-green/10 "
                        >
                            <Calendar className="mr-2 h-4 w-4" /> Download Tax
                            Statement
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
                        <div className="rounded-md border border-mint-green bg-white">
                            <Table>
                                <TableHeader className="bg-warm-beige/40 ">
                                    <TableRow>
                                        <TableHead className="text-charcoal font-bold">
                                            Receipt
                                        </TableHead>
                                        <TableHead className="text-charcoal font-bold">
                                            Campaign
                                        </TableHead>
                                        <TableHead className="text-charcoal font-bold">
                                            Date
                                        </TableHead>
                                        <TableHead className="text-left text-charcoal font-bold">
                                            Amount
                                        </TableHead>
                                        <TableHead className="text-center text-charcoal font-bold">
                                            View
                                        </TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredDonations.map((donation) => (
                                        <TableRow key={donation._id}>
                                            <TableCell className="font-medium text-charcoal">
                                                {donation.receipt}
                                            </TableCell>
                                            <TableCell className="text-charcoal">
                                                {donation.campaignTitle}
                                            </TableCell>
                                            <TableCell className="text-charcoal">
                                                {format(
                                                    new Date(donation.date),
                                                    "MMM d, yyyy"
                                                )}
                                            </TableCell>
                                            <TableCell className="text-left font-medium text-charcoal">
                                                Rs.{donation.amount}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Link
                                                    to={`/campaign/${donation.campaignId}`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="flex flex-wrap text-deep-emerald hover:bg-lime-green hover:text-black rounded-full"
                                                    >
                                                        <ExternalLink
                                                            size={16}
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
                    ) : (
                        <div className="text-center py-10">
                            <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart size={24} className="text-gray-400" />
                            </div>
                            <h3 className="text-xl font-medium text-charcoal mb-2">
                                No donations found
                            </h3>
                            <p className="text-gray-500 mb-6">
                                {searchQuery
                                    ? "No donations matched your search criteria."
                                    : "You haven't made any donations yet."}
                            </p>
                            {searchQuery ? (
                                <Button
                                    variant="outline"
                                    onClick={() => setSearchQuery("")}
                                    className="text-deep-emerald hover:bg-lime-green hover:text-black"
                                >
                                    Clear Search
                                </Button>
                            ) : (
                                <Link to="/">
                                    <Button className="bg-deep-emerald hover:bg-lime-green text-white hover:text-black">
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
