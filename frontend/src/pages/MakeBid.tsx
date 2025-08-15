
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Clock, 
  Users, 
  DollarSign, 
  Eye, 
  Heart, 
  Share2, 
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Timer,
  TrendingUp,
  Shield,
  Star
} from "lucide-react";
import LiveBidding from "@/components/LiveBidding";
import { formatRupees } from "@/lib/currency";
import { useSocket } from "@/contexts/SocketContext";
import { useAuth } from "@/contexts/AuthContext";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import PaymentModal from "@/components/PaymentModal";

// Mock auction data - in a real app, this would come from an API
const auctionData = {
  "1": {
    id: "1",
    title: "Vintage Rolex Submariner 1680 - Rare Red Sub",
    description: "A highly sought-after vintage Rolex Submariner 1680 with the rare 'Red Sub' dial. This timepiece features a black dial with red 'Submariner' text, a black bezel, and has been professionally serviced. Includes original box and papers. Excellent condition with minimal wear.",
    currentBid: 1000000,
    bids: 18,
    timeRemaining: "2h 15m",
    startingPrice: 800000,
    incrementAmount: 10000,
    imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800&h=600",
    category: "Watches",
    seller: "Luxury Watch Emporium",
    condition: "Excellent",
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    location: "Mumbai, India",
    shipping: "Free shipping within India",
    returnPolicy: "7-day return policy",
    authenticity: "100% Authentic",
    expertVerified: true,
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800&h=600"
    ],
    specifications: {
      brand: "Rolex",
      model: "Submariner 1680",
      year: "1970s",
      movement: "Automatic",
      case: "Stainless Steel",
      dial: "Black with Red Text",
      bezel: "Black",
      bracelet: "Stainless Steel Oyster",
      waterResistance: "200m"
    }
  },
  "2": {
    id: "2",
    title: "Rare First Edition Book Collection - Complete Set",
    description: "A complete collection of rare first edition novels from renowned authors of the 20th century. All books are in very good condition with minimal wear. Includes signed copies and limited editions.",
    currentBid: 400000,
    bids: 9,
    timeRemaining: "4h 30m",
    startingPrice: 300000,
    incrementAmount: 5000,
    imageUrl: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=800&h=600",
    category: "Books",
    seller: "Antique Books Ltd.",
    condition: "Very Good",
    endTime: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(),
    location: "Delhi, India",
    shipping: "Free shipping within India",
    returnPolicy: "14-day return policy",
    authenticity: "Expert Verified",
    expertVerified: true,
    images: [
      "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800&h=600"
    ]
  },
  "3": {
    id: "3",
    title: "Original Oil Painting by Emma Roberts - Contemporary Art",
    description: "An original contemporary oil painting by emerging artist Emma Roberts. The piece measures 24″ x 36″ and comes in a handcrafted frame. This is a unique piece with vibrant colors and modern composition.",
    currentBid: 600000,
    bids: 12,
    timeRemaining: "1d 8h",
    startingPrice: 400000,
    incrementAmount: 20000,
    imageUrl: "https://images.unsplash.com/photo-1579783928621-7a13d66a62b1?auto=format&fit=crop&q=80&w=800&h=600",
    category: "Art",
    seller: "Modern Art Gallery",
    condition: "New",
    endTime: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(),
    location: "Bangalore, India",
    shipping: "Free shipping within India",
    returnPolicy: "30-day return policy",
    authenticity: "Artist Verified",
    expertVerified: true,
    images: [
      "https://images.unsplash.com/photo-1579783928621-7a13d66a62b1?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1579783928621-7a13d66a62b1?auto=format&fit=crop&q=80&w=800&h=600",
      "https://images.unsplash.com/photo-1579783928621-7a13d66a62b1?auto=format&fit=crop&q=80&w=800&h=600"
    ]
  },
};

// Form schema
const bidFormSchema = z.object({
  bidAmount: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0, 
    { message: "Bid amount must be a positive number." }
  ),
});

const MakeBid = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { socket, isConnected, joinAuction, leaveAuction } = useSocket();
  const [showBidForm, setShowBidForm] = useState(false);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  const [currentAuction, setCurrentAuction] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Scroll to top when page loads
  useScrollToTop();
  
  // In a real app, fetch auction data based on auctionId
  const auction = auctionData[auctionId || "1"];
  
  const form = useForm<z.infer<typeof bidFormSchema>>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      bidAmount: (auction.currentBid + auction.incrementAmount).toString(),
    },
  });

  // Join auction room for real-time updates
  useEffect(() => {
    if (isConnected && auction) {
      joinAuction(auction.id);
      setCurrentAuction(auction);
    }

    return () => {
      if (auction) {
        leaveAuction(auction.id);
      }
    };
  }, [isConnected, auction, joinAuction, leaveAuction]);

  // Listen for real-time bid updates
  useEffect(() => {
    if (!socket) return;

    const handleBidUpdate = (data: any) => {
      if (data.auctionId === auction.id) {
        setCurrentAuction(prev => ({
          ...prev,
          currentBid: data.newBid,
          bids: data.totalBids || prev.bids + 1
        }));
        
        // Update form with new minimum bid
        form.setValue('bidAmount', (data.newBid + auction.incrementAmount).toString());
        
        toast.success(`New bid: ${formatRupees(data.newBid)} by ${data.bidderName}`);
      }
    };

    socket.on('bidUpdate', handleBidUpdate);

    return () => {
      socket.off('bidUpdate', handleBidUpdate);
    };
  }, [socket, auction, form]);

  const handlePreBid = () => {
    if (!isAuthenticated) {
      toast.error("Please login to place a bid");
      navigate('/auth');
      return;
    }
    setShowBidForm(true);
  };
  
  const onSubmit = async (values: z.infer<typeof bidFormSchema>) => {
    if (!isAuthenticated) {
      toast.error("Please login to place a bid");
      navigate('/auth');
      return;
    }

    setIsPlacingBid(true);
    
    try {
      const bidAmount = Number(values.bidAmount);
      
      if (bidAmount <= currentAuction.currentBid) {
        toast.error("Your bid must be higher than the current bid.");
        setIsPlacingBid(false);
        return;
      }

      // In a real app, this would be an API call
      // For now, we'll simulate the API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Update local state immediately for better UX
      setCurrentAuction(prev => ({
        ...prev,
        currentBid: bidAmount,
        bids: prev.bids + 1
      }));

      // Emit Socket.IO event for real-time updates
      if (socket && isConnected) {
        socket.emit('newBid', {
          auctionId: auction.id,
          bidAmount: bidAmount,
          bidderId: user?._id || 'user-id',
          bidderName: user?.full_name || user?.business_name || 'Anonymous'
        });
      }

      // Success!
      toast.success("Bid placed successfully!");
      setShowBidForm(false);
      
      // Show payment modal for winning bid
      if (bidAmount >= auction.currentBid) {
        setShowPaymentModal(true);
      }
      
    } catch (error) {
      toast.error("Failed to place bid. Please try again.");
    } finally {
      setIsPlacingBid(false);
    }
  };

  const calculateTimeProgress = () => {
    const end = new Date(auction.endTime).getTime();
    const now = new Date().getTime();
    const total = end - new Date(auction.endTime).getTime() + (2 * 60 * 60 * 1000); // 2 hours total
    const remaining = end - now;
    return Math.max(0, Math.min(100, ((total - remaining) / total) * 100));
  };

  const getQuickBidAmounts = () => {
    const current = displayAuction.currentBid;
    const increment = auction.incrementAmount;
    return [
      current + increment,
      current + (increment * 2),
      current + (increment * 5),
      current + (increment * 10)
    ];
  };

  if (!auction) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow pt-20 pb-12 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Auction Not Found</CardTitle>
              <CardDescription>The auction you're looking for doesn't exist.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate("/auctions")} className="w-full">
                Browse Auctions
              </Button>
            </CardFooter>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  const displayAuction = currentAuction || auction;
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/auctions")}
              className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Auctions
            </Button>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Main Content - Left Side */}
            <div className="xl:col-span-2 space-y-6">
              {/* Image Gallery */}
              <Card className="overflow-hidden">
                <div className="relative">
                  <img 
                    src={displayAuction.images?.[selectedImage] || displayAuction.imageUrl} 
                    alt={displayAuction.title} 
                    className="w-full object-cover h-[500px]"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                      onClick={() => setLiked(!liked)}
                    >
                      <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="bg-white/80 hover:bg-white/90 backdrop-blur-sm"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>
                  {displayAuction.expertVerified && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Expert Verified
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Navigation */}
                {displayAuction.images && displayAuction.images.length > 1 && (
                  <div className="p-4 border-t">
                    <div className="flex gap-2 overflow-x-auto">
                      {displayAuction.images.map((img: string, index: number) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                            selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                          }`}
                        >
                          <img src={img} alt={`${displayAuction.title} ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* Auction Details Tabs */}
              <Card>
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="description">Description</TabsTrigger>
                    <TabsTrigger value="specifications">Specifications</TabsTrigger>
                    <TabsTrigger value="shipping">Shipping & Returns</TabsTrigger>
                    <TabsTrigger value="seller">Seller Info</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="description" className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Description</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {displayAuction.description}
                    </p>
                  </TabsContent>
                  
                  <TabsContent value="specifications" className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                    {displayAuction.specifications ? (
                      <div className="grid grid-cols-2 gap-4">
                        {Object.entries(displayAuction.specifications).map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </dt>
                            <dd className="text-sm text-gray-900 dark:text-gray-100">{value as string}</dd>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No specifications available</p>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="shipping" className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Shipping & Returns</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Shipping</h4>
                        <p className="text-gray-700 dark:text-gray-300">{displayAuction.shipping}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Return Policy</h4>
                        <p className="text-gray-700 dark:text-gray-300">{displayAuction.returnPolicy}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Location</h4>
                        <p className="text-gray-700 dark:text-gray-300">{displayAuction.location}</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="seller" className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Seller Information</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Seller</h4>
                        <p className="text-gray-700 dark:text-gray-300">{displayAuction.seller}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Authenticity</h4>
                        <p className="text-gray-700 dark:text-gray-300">{displayAuction.authenticity}</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">Condition</h4>
                        <p className="text-gray-700 dark:text-gray-300">{displayAuction.condition}</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            {/* Bidding Sidebar - Right Side */}
            <div className="space-y-6">
              {/* Auction Info Card */}
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="space-y-2">
                    <h1 className="text-xl font-bold leading-tight">{displayAuction.title}</h1>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Star className="h-4 w-4" />
                      <span>Expert Verified</span>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Current Bid */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Bid</p>
                    <p className="text-3xl font-bold text-green-600">
                      {formatRupees(displayAuction.currentBid)}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {displayAuction.bids} bids • Min. increment: {formatRupees(auction.incrementAmount)}
                    </p>
                  </div>

                  {/* Time Remaining */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Time Remaining</span>
                      <span className="font-medium">{displayAuction.timeRemaining}</span>
                    </div>
                    <Progress value={calculateTimeProgress()} className="h-2" />
                  </div>

                  {/* Quick Bid Buttons */}
                  {!showBidForm && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Quick Bid</p>
                      <div className="grid grid-cols-2 gap-2">
                        {getQuickBidAmounts().map((amount, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              form.setValue('bidAmount', amount.toString());
                              handlePreBid();
                            }}
                            disabled={!isAuthenticated}
                          >
                            {formatRupees(amount)}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bid Form */}
                  {showBidForm ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                          control={form.control}
                          name="bidAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Bid Amount (₹)</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-3 text-gray-500">₹</span>
                                  <Input 
                                    className="pl-8" 
                                    type="number"
                                    min={displayAuction.currentBid + auction.incrementAmount}
                                    step={auction.incrementAmount}
                                    {...field} 
                                  />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Minimum bid: {formatRupees(displayAuction.currentBid + auction.incrementAmount)}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex gap-2">
                          <Button 
                            type="submit" 
                            className="flex-1" 
                            disabled={isPlacingBid}
                          >
                            {isPlacingBid ? "Placing Bid..." : "Place Bid"}
                          </Button>
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setShowBidForm(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    </Form>
                  ) : (
                    <Button 
                      onClick={handlePreBid} 
                      className="w-full"
                      size="lg"
                      disabled={!isAuthenticated}
                    >
                      {isAuthenticated ? "Place Bid" : "Login to Bid"}
                    </Button>
                  )}

                  {/* Security Badge */}
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="h-4 w-4" />
                    <span>Secure bidding with buyer protection</span>
                  </div>
                </CardContent>
              </Card>

              {/* Live Bidding Component */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Live Bidding
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <LiveBidding 
                    currentBid={displayAuction.currentBid} 
                    bidCount={displayAuction.bids} 
                    timeRemaining={displayAuction.timeRemaining} 
                    endTime={displayAuction.endTime}
                    auctionId={displayAuction.id}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        auctionId={auction.id}
        amount={displayAuction.currentBid}
        auctionTitle={displayAuction.title}
        onSuccess={() => {
          toast.success("Payment completed! You've won the auction!");
          setShowPaymentModal(false);
        }}
      />
    </div>
  );
};

export default MakeBid;
