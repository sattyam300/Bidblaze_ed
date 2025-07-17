
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Import the components we created
import ProfileSidebar from "@/components/profile/ProfileSidebar";
import OverviewTab from "@/components/profile/OverviewTab";
import OrdersTab from "@/components/profile/OrdersTab";
import BidsTab from "@/components/profile/BidsTab";
import RecommendedTab from "@/components/profile/RecommendedTab";

// Mock data for demonstration purposes
const userInfo = {
  name: "John Doe",
  email: "john.doe@example.com",
  accountType: "User",
  memberSince: "January 2023",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
};

const myOrders = [
  { 
    id: "ORD-7829", 
    item: "Vintage Rolex Watch", 
    date: "2023-06-15", 
    status: "Delivered", 
    amount: "$4,250.00",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=300&h=200"
  },
  { 
    id: "ORD-6543", 
    item: "Art Deco Painting", 
    date: "2023-05-22", 
    status: "Shipped", 
    amount: "$1,850.00",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=300&h=200"
  },
  { 
    id: "ORD-5421", 
    item: "Antique Desk Lamp", 
    date: "2023-04-10", 
    status: "Delivered", 
    amount: "$320.00",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=300&h=200"
  }
];

const myBids = [
  { 
    id: "BID-8932", 
    item: "Rare Comic Book Collection", 
    date: "2023-06-10", 
    status: "Winning", 
    bidAmount: "$1,250.00",
    currentBid: "$1,250.00",
    endsIn: "2 days",
    image: "https://images.unsplash.com/photo-1544982503-9f984c14501a?auto=format&fit=crop&q=80&w=300&h=200"
  },
  { 
    id: "BID-7651", 
    item: "Japanese Porcelain Set", 
    date: "2023-06-05", 
    status: "Outbid", 
    bidAmount: "$450.00",
    currentBid: "$520.00",
    endsIn: "6 hours",
    image: "https://images.unsplash.com/photo-1626806787461-102c1a7f1c0b?auto=format&fit=crop&q=80&w=300&h=200"
  },
  { 
    id: "BID-6472", 
    item: "Handcrafted Leather Bag", 
    date: "2023-05-30", 
    status: "Won", 
    bidAmount: "$380.00",
    currentBid: "$380.00",
    endsIn: "Ended",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80&w=300&h=200"
  }
];

const recommendedAuctions = [
  {
    id: "AUC-9821",
    title: "Mid-Century Modern Chair",
    currentBid: "$320",
    endsIn: "1 day",
    image: "https://images.unsplash.com/photo-1561677978-583a8c7a4b43?auto=format&fit=crop&q=80&w=300&h=200"
  },
  {
    id: "AUC-8754",
    title: "Vintage Camera Collection",
    currentBid: "$750",
    endsIn: "3 days",
    image: "https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&q=80&w=300&h=200"
  },
  {
    id: "AUC-7653",
    title: "Handmade Pottery Set",
    currentBid: "$180",
    endsIn: "8 hours",
    image: "https://images.unsplash.com/photo-1565193298357-ada3abf71a43?auto=format&fit=crop&q=80&w=300&h=200"
  },
  {
    id: "AUC-6452",
    title: "Limited Edition Prints",
    currentBid: "$420",
    endsIn: "2 days",
    image: "https://images.unsplash.com/photo-1579541637431-4e3cd6f6c9e3?auto=format&fit=crop&q=80&w=300&h=200"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Shipped":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
    case "Winning":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "Outbid":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "Won":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const Profile = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Simulate logout process
    toast.success("You've been successfully logged out");
    
    // Navigate to home page after logout
    setTimeout(() => {
      navigate("/");
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar 
                userInfo={userInfo} 
                activeTab={activeTab} 
                setActiveTab={setActiveTab} 
                onLogout={() => setLogoutDialogOpen(true)}
              />
            </div>
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="orders">My Orders</TabsTrigger>
                  <TabsTrigger value="bids">My Bids</TabsTrigger>
                  <TabsTrigger value="recommended">Recommended</TabsTrigger>
                </TabsList>
                
                {/* Overview Tab */}
                <TabsContent value="overview">
                  <OverviewTab 
                    orders={myOrders}
                    bids={myBids}
                    recommendedAuctions={recommendedAuctions}
                    getStatusColor={getStatusColor}
                  />
                </TabsContent>
                
                {/* Orders Tab */}
                <TabsContent value="orders">
                  <OrdersTab 
                    orders={myOrders}
                    getStatusColor={getStatusColor}
                  />
                </TabsContent>
                
                {/* Bids Tab */}
                <TabsContent value="bids">
                  <BidsTab 
                    bids={myBids}
                    getStatusColor={getStatusColor}
                  />
                </TabsContent>
                
                {/* Recommended Tab */}
                <TabsContent value="recommended">
                  <RecommendedTab 
                    recommendedAuctions={recommendedAuctions}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Logout Confirmation Dialog */}
      <AlertDialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to sign out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out of your BidBlaze account on this device.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} className="bg-red-500 hover:bg-red-600">
              Sign Out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
