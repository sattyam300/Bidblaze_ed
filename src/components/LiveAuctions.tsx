
import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuctionCard from "./AuctionCard";
import { ArrowRight, ChevronLeft, ChevronRight, Filter, ListFilter, SlidersHorizontal } from "lucide-react";

// Sample auction data
const SAMPLE_AUCTIONS = [
  {
    id: "1",
    title: "Vintage Rolex Submariner 1680",
    currentBid: 12500,
    bids: 18,
    timeRemaining: "2h 15m",
    imageUrl: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=600&h=400",
    category: "Watches",
    isExternal: false
  },
  {
    id: "2",
    title: "Rare First Edition Book Collection",
    currentBid: 4800,
    bids: 9,
    timeRemaining: "4h 30m",
    imageUrl: "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?auto=format&fit=crop&q=80&w=600&h=400",
    category: "Books",
    isExternal: true,
    externalUrl: "#"
  },
  {
    id: "3",
    title: "Original Oil Painting by Emma Roberts",
    currentBid: 7300,
    bids: 12,
    timeRemaining: "1d 8h",
    imageUrl: "https://images.unsplash.com/photo-1579783928621-7a13d66a62b1?auto=format&fit=crop&q=80&w=600&h=400",
    category: "Art",
    isExternal: false
  },
  {
    id: "4",
    title: "Antique Mahogany Writing Desk",
    currentBid: 3200,
    bids: 7,
    timeRemaining: "6h 45m",
    imageUrl: "https://images.unsplash.com/photo-1540809799-7d3a5e0115c4?auto=format&fit=crop&q=80&w=600&h=400",
    category: "Furniture",
    isExternal: false
  },
  {
    id: "5",
    title: "Signed NBA Basketball Memorabilia",
    currentBid: 960,
    bids: 14,
    timeRemaining: "3h 10m",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=600&h=400",
    category: "Sports",
    isExternal: true,
    externalUrl: "#"
  },
  {
    id: "6",
    title: "1967 Ford Mustang GT Fastback",
    currentBid: 75000,
    bids: 23,
    timeRemaining: "2d 10h",
    imageUrl: "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&q=80&w=600&h=400",
    category: "Cars",
    isExternal: false
  }
];

// Categories
const CATEGORIES = ["All", "Watches", "Art", "Furniture", "Electronics", "Books", "Cars", "Sports"];

const LiveAuctions = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  
  const filteredAuctions = activeCategory === "All" 
    ? SAMPLE_AUCTIONS 
    : SAMPLE_AUCTIONS.filter(auction => auction.category === activeCategory);
  
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">Live Auctions</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Discover and bid on amazing items from around the world
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-4">
            <Button variant="outline" size="sm" className="rounded-lg">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="rounded-lg">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Sort
            </Button>
            <Button size="sm" className="rounded-lg">
              View All
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      
        {/* Category Filters */}
        <div className="relative mb-8">
          <div className="absolute left-0 top-0 bottom-0 flex items-center">
            <Button variant="ghost" size="icon" className="rounded-full shadow-sm bg-white dark:bg-gray-800">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 px-12 overflow-x-auto py-2 no-scrollbar">
            {CATEGORIES.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                className="rounded-full whitespace-nowrap"
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
          
          <div className="absolute right-0 top-0 bottom-0 flex items-center">
            <Button variant="ghost" size="icon" className="rounded-full shadow-sm bg-white dark:bg-gray-800">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Grid of auction cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAuctions.map((auction) => (
            <AuctionCard key={auction.id} {...auction} />
          ))}
        </div>
        
        {/* Load more button */}
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" className="rounded-full">
            Load More Auctions
          </Button>
        </div>
      </div>
    </section>
  );
};

export default LiveAuctions;
