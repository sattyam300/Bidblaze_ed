
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Clock, Heart, ExternalLink, Activity, Users, DollarSign } from "lucide-react";

interface AuctionCardProps {
  id: string;
  title: string;
  currentBid: number;
  bids: number;
  timeRemaining: string;
  imageUrl: string;
  isExternal?: boolean;
  externalUrl?: string;
  category: string;
}

const AuctionCard = ({
  id,
  title,
  currentBid,
  bids,
  timeRemaining,
  imageUrl,
  isExternal = false,
  externalUrl = "",
  category,
}: AuctionCardProps) => {
  const [liked, setLiked] = useState(false);
  
  return (
    <div className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover-card group">
      {/* Card Header - Image */}
      <div className="h-48 relative overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105" 
        />
        
        {isExternal && (
          <div className="absolute top-3 left-3 px-2 py-1 bg-orange-100/80 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400 rounded-md backdrop-blur-sm text-xs font-medium">
            External
          </div>
        )}
        
        <div className="absolute top-3 right-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-md hover:bg-white/50 dark:hover:bg-gray-900/50 text-gray-700 dark:text-gray-200 rounded-full"
            onClick={() => setLiked(!liked)}
          >
            <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
        
        <div className="absolute bottom-3 left-3 px-2 py-1 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md rounded-md text-xs font-medium">
          {category}
        </div>
        
        <div className="absolute bottom-3 right-3 px-2 py-1 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md rounded-md text-xs font-medium flex items-center">
          <Clock className="h-3 w-3 mr-1" />
          {timeRemaining}
        </div>
      </div>
      
      {/* Card Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{title}</h3>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Current Bid</p>
            <p className="text-lg font-bold text-primary">${currentBid.toLocaleString()}</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Bids</p>
              <div className="flex items-center">
                <Users className="h-3 w-3 mr-1 text-gray-500 dark:text-gray-400" />
                <p className="font-medium">{bids}</p>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Activity</p>
              <div className="flex items-center">
                <Activity className="h-3 w-3 mr-1 text-green-500" />
                <p className="font-medium text-green-500">High</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Card Actions */}
        <div className="flex gap-2">
          {isExternal ? (
            <Button className="w-full rounded-lg" onClick={() => window.open(externalUrl, "_blank")}>
              Visit Site
              <ExternalLink className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <>
              <Button 
                variant="outline" 
                className="w-1/2 rounded-lg"
                as={Link}
                to={`/bid/${id}`}
              >
                <DollarSign className="h-4 w-4 mr-1" />
                Bid Now
              </Button>
              <Button className="w-1/2 rounded-lg" as={Link} to={`/bid/${id}`}>
                View Details
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;
