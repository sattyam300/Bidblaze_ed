
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AuctionItem {
  id: string;
  title: string;
  currentBid: string;
  endsIn: string;
  image: string;
}

interface RecommendedTabProps {
  recommendedAuctions: AuctionItem[];
}

const RecommendedTab = ({ recommendedAuctions }: RecommendedTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recommended Auctions</CardTitle>
        <CardDescription>Based on your bidding history and interests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {recommendedAuctions.map((auction) => (
            <div key={auction.id} className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow">
              <div className="relative h-48">
                <img
                  src={auction.image}
                  alt={auction.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2">
                  <Badge className="bg-primary/80 hover:bg-primary text-white">{auction.endsIn}</Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium">{auction.title}</h3>
                <div className="flex justify-between items-center mt-2">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Current bid</p>
                    <p className="font-semibold">{auction.currentBid}</p>
                  </div>
                  <Button size="sm">Place Bid</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendedTab;
