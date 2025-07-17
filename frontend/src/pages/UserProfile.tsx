
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Edit } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserProfileCard from "@/components/UserProfileCard";
import AuctionParticipationTable from "@/components/AuctionParticipationTable";
import UserProfileSkeleton from "@/components/UserProfileSkeleton";
import { toast } from "sonner";

// Mock data for demonstration
const mockUserInfo = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  kycStatus: 'verified' as const,
  isVerified: true,
};

const mockAuctionParticipations = [
  {
    id: "1",
    auctionTitle: "Vintage Rolex Submariner",
    dateParticipated: "2024-01-15",
    amountPaid: 50000,
    refundStatus: 'refunded' as const,
    auctionStatus: 'lost' as const,
  },
  {
    id: "2",
    auctionTitle: "Antique Persian Rug",
    dateParticipated: "2024-01-20",
    amountPaid: 30000,
    refundStatus: 'pending' as const,
    auctionStatus: 'ongoing' as const,
  },
  {
    id: "3",
    auctionTitle: "Modern Art Sculpture",
    dateParticipated: "2024-01-10",
    amountPaid: 75000,
    refundStatus: 'pending' as const,
    auctionStatus: 'won' as const,
  },
  {
    id: "4",
    auctionTitle: "Classic Car Collection",
    dateParticipated: "2024-01-05",
    amountPaid: 120000,
    refundStatus: 'refunded' as const,
    auctionStatus: 'lost' as const,
  },
];

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(mockUserInfo);
  const [auctionParticipations, setAuctionParticipations] = useState(mockAuctionParticipations);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    toast.success("Logged out successfully");
    // Add logout logic here
  };

  const handleEditProfile = () => {
    toast.info("Edit profile functionality coming soon");
    // Add edit profile logic here
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 pb-12">
          <div className="container mx-auto px-4 max-w-6xl">
            <UserProfileSkeleton />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="space-y-6">
            {/* Page Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">User Profile</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your account and view your auction history
              </p>
            </div>

            {/* User Profile Card */}
            <UserProfileCard userInfo={userInfo} />

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center flex-wrap">
              <Button onClick={handleEditProfile} variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button onClick={handleLogout} variant="destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Auction Participation Table */}
            <AuctionParticipationTable participations={auctionParticipations} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserProfile;
