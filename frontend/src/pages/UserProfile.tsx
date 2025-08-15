
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Edit } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserProfileCard from "@/components/UserProfileCard";
import AuctionParticipationTable from "@/components/AuctionParticipationTable";
import UserProfileSkeleton from "@/components/UserProfileSkeleton";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const mockAuctionParticipations = [
  {
    id: "1",
    auctionTitle: "Vintage Rolex Submariner",
    dateParticipated: "2024-01-15",
    amountPaid: 350000,
    refundStatus: 'refunded' as const,
    auctionStatus: 'lost' as const,
  },
  {
    id: "2",
    auctionTitle: "Antique Persian Rug",
    dateParticipated: "2024-01-20",
    amountPaid: 250000,
    refundStatus: 'pending' as const,
    auctionStatus: 'ongoing' as const,
  },
  {
    id: "3",
    auctionTitle: "Modern Art Sculpture",
    dateParticipated: "2024-01-10",
    amountPaid: 500000,
    refundStatus: 'pending' as const,
    auctionStatus: 'won' as const,
  },
  {
    id: "4",
    auctionTitle: "Classic Car Collection",
    dateParticipated: "2024-01-05",
    amountPaid: 800000,
    refundStatus: 'refunded' as const,
    auctionStatus: 'lost' as const,
  },
];

const UserProfile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [auctionParticipations, setAuctionParticipations] = useState(mockAuctionParticipations);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  // Create user info from auth context
  const userInfo = user ? {
    name: user.full_name || 'User',
    email: user.email,
    avatar: user.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    kycStatus: 'verified' as const,
    isVerified: true,
  } : null;

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully");
    navigate('/');
  };

  const handleEditProfile = () => {
    navigate('/profile-edit');
  };

  if (loading || !userInfo) {
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
