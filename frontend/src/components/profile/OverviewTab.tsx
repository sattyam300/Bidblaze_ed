
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, Heart } from "lucide-react";

interface OrderItem {
  id: string;
  item: string;
  date: string;
  status: string;
  amount: string;
  image: string;
}

interface BidItem {
  id: string;
  item: string;
  date: string;
  status: string;
  bidAmount: string;
  currentBid: string;
  endsIn: string;
  image: string;
}

interface AuctionItem {
  id: string;
  title: string;
  currentBid: string;
  endsIn: string;
  image: string;
}

interface OverviewTabProps {
  orders: OrderItem[];
  bids: BidItem[];
  recommendedAuctions: AuctionItem[];
  getStatusColor: (status: string) => string;
}

const OverviewTab = ({ orders, bids, recommendedAuctions, getStatusColor }: OverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5 text-primary" />
            Recent Orders
          </CardTitle>
          <CardDescription>Your latest purchases</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.slice(0, 2).map((order) => (
            <div key={order.id} className="flex items-center gap-4 mb-4 last:mb-0">
              <img 
                src={order.image} 
                alt={order.item} 
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{order.item}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{order.id} • {order.date}</p>
              </div>
              <Badge className={getStatusColor(order.status)}>
                {order.status}
              </Badge>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full mt-2">
            View all orders
          </Button>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            Active Bids
          </CardTitle>
          <CardDescription>Your ongoing auction bids</CardDescription>
        </CardHeader>
        <CardContent>
          {bids.slice(0, 2).map((bid) => (
            <div key={bid.id} className="flex items-center gap-4 mb-4 last:mb-0">
              <img 
                src={bid.image} 
                alt={bid.item} 
                className="w-12 h-12 rounded-md object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{bid.item}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your bid: {bid.bidAmount}</p>
              </div>
              <Badge className={getStatusColor(bid.status)}>
                {bid.status}
              </Badge>
            </div>
          ))}
          <Button variant="ghost" size="sm" className="w-full mt-2">
            View all bids
          </Button>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Heart className="mr-2 h-5 w-5 text-primary" />
            Recommended for You
          </CardTitle>
          <CardDescription>Based on your bidding history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recommendedAuctions.slice(0, 2).map((auction) => (
              <div key={auction.id} className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
                <div className="relative h-40">
                  <img
                    src={auction.image}
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-primary/80 hover:bg-primary text-white">{auction.endsIn}</Badge>
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm truncate">{auction.title}</h3>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current bid</p>
                    <p className="font-medium text-sm">{auction.currentBid}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-4">
            View all recommendations
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
