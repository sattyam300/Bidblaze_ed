
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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

interface BidsTabProps {
  bids: BidItem[];
  getStatusColor: (status: string) => string;
}

const BidsTab = ({ bids, getStatusColor }: BidsTabProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Bids</CardTitle>
        <CardDescription>Track your active and past bids</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Item</TableHead>
              <TableHead>Bid ID</TableHead>
              <TableHead>Your Bid</TableHead>
              <TableHead>Current Bid</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Ends In</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bids.map((bid) => (
              <TableRow key={bid.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={bid.image}
                      alt={bid.item}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <span className="font-medium">{bid.item}</span>
                  </div>
                </TableCell>
                <TableCell>{bid.id}</TableCell>
                <TableCell>{bid.bidAmount}</TableCell>
                <TableCell>{bid.currentBid}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(bid.status)}>
                    {bid.status}
                  </Badge>
                </TableCell>
                <TableCell>{bid.endsIn}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default BidsTab;
