
import { useState } from "react";
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
import { Clock, DollarSign, Users } from "lucide-react";
import LiveBidding from "@/components/LiveBidding";

// Mock auction data - in a real app, this would come from an API
const auctionData = {
  "1": {
    id: "1",
    title: "Vintage Rolex Submariner 1680",
    description: "A classic timepiece in excellent condition with original box and papers. This vintage Rolex Submariner features a black dial and bezel, and has been professionally serviced.",
    currentBid: 12500,
    bids: 18,
    timeRemaining: "2h 15m",
    startingPrice: 10000,
    incrementAmount: 100,
    imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600&h=400",
    category: "Watches",
    seller: "Luxury Watch Emporium",
    condition: "Excellent",
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
  },
  "2": {
    id: "2",
    title: "Rare First Edition Book Collection",
    description: "A collection of rare first edition novels from renowned authors of the 20th century. All books are in very good condition with minimal wear.",
    currentBid: 4800,
    bids: 9,
    timeRemaining: "4h 30m",
    startingPrice: 3500,
    incrementAmount: 50,
    imageUrl: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=600&h=400",
    category: "Books",
    seller: "Antique Books Ltd.",
    condition: "Very Good",
    endTime: new Date(Date.now() + 4.5 * 60 * 60 * 1000).toISOString(), // 4.5 hours from now
  },
  "3": {
    id: "3",
    title: "Original Oil Painting by Emma Roberts",
    description: "An original contemporary oil painting by emerging artist Emma Roberts. The piece measures 24″ x 36″ and comes in a handcrafted frame.",
    currentBid: 7300,
    bids: 12,
    timeRemaining: "1d 8h",
    startingPrice: 5000,
    incrementAmount: 200,
    imageUrl: "https://images.unsplash.com/photo-1579783928621-7a13d66a62b1?auto=format&fit=crop&q=80&w=600&h=400",
    category: "Art",
    seller: "Modern Art Gallery",
    condition: "New",
    endTime: new Date(Date.now() + 32 * 60 * 60 * 1000).toISOString(), // 1 day 8 hours from now
  },
};

// Form schema
const bidFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  budget: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Budget must be a positive number.",
  }),
  bidAmount: z.string().refine(
    (val) => !isNaN(Number(val)) && Number(val) > 0, 
    { message: "Bid amount must be a positive number." }
  ),
});

const MakeBid = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [showBidForm, setShowBidForm] = useState(false);
  const [isPlacingBid, setIsPlacingBid] = useState(false);
  
  // In a real app, fetch auction data based on auctionId
  const auction = auctionData[auctionId || "1"];
  
  const form = useForm<z.infer<typeof bidFormSchema>>({
    resolver: zodResolver(bidFormSchema),
    defaultValues: {
      name: "",
      budget: "",
      bidAmount: (auction.currentBid + auction.incrementAmount).toString(),
    },
  });
  
  const handlePreBid = () => {
    setShowBidForm(true);
  };
  
  const onSubmit = (values: z.infer<typeof bidFormSchema>) => {
    setIsPlacingBid(true);
    
    // Simulate API call with setTimeout
    setTimeout(() => {
      console.log("Bid placed:", values);
      
      // Check if bid amount is valid
      const bidAmount = Number(values.bidAmount);
      const budget = Number(values.budget);
      
      if (bidAmount <= auction.currentBid) {
        toast.error("Your bid must be higher than the current bid.");
        setIsPlacingBid(false);
        return;
      }
      
      if (bidAmount > budget) {
        toast.error("Your bid exceeds your budget.");
        setIsPlacingBid(false);
        return;
      }
      
      // Success!
      toast.success("Bid placed successfully!");
      
      // Redirect to profile page after successful bid
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
      
    }, 1000);
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
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Auction Details */}
            <div>
              <div className="mb-6">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/auctions")}
                  className="mb-4"
                >
                  ← Back to Auctions
                </Button>
                <h1 className="text-3xl font-bold mb-2">{auction.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {auction.timeRemaining}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {auction.bids} bids
                  </Badge>
                  <Badge className="bg-primary">{auction.category}</Badge>
                </div>
              </div>
              
              <div className="rounded-lg overflow-hidden mb-6">
                <img 
                  src={auction.imageUrl} 
                  alt={auction.title} 
                  className="w-full object-cover h-[400px]"
                />
              </div>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Auction Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                    <p className="mt-1">{auction.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Seller</h3>
                      <p className="mt-1">{auction.seller}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Condition</h3>
                      <p className="mt-1">{auction.condition}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Starting Price</h3>
                      <p className="mt-1">${auction.startingPrice.toLocaleString()}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Bid Increment</h3>
                      <p className="mt-1">${auction.incrementAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Bidding Section */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Current Bid</CardTitle>
                  <CardDescription>Live bidding for {auction.title}</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Live bidding component */}
                  <LiveBidding 
                    currentBid={auction.currentBid} 
                    bidCount={auction.bids} 
                    timeRemaining={auction.timeRemaining} 
                    endTime={auction.endTime}
                  />
                  
                  {showBidForm ? (
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter your full name" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="budget"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Your Budget</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                  <Input className="pl-10" placeholder="Enter your maximum budget" {...field} />
                                </div>
                              </FormControl>
                              <FormDescription>
                                This is the maximum amount you're willing to spend.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="bidAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bid Amount</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                                  <Input className="pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormDescription>
                                Minimum bid: ${(auction.currentBid + auction.incrementAmount).toLocaleString()}
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <Button type="submit" className="w-full" disabled={isPlacingBid}>
                          {isPlacingBid ? "Placing Bid..." : "Place Bid"}
                        </Button>
                      </form>
                    </Form>
                  ) : (
                    <Button onClick={handlePreBid} className="w-full mt-6">
                      Make a Bid
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MakeBid;
