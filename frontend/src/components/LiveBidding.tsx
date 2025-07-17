
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Activity } from "lucide-react";

interface LiveBiddingProps {
  currentBid: number;
  bidCount: number;
  timeRemaining: string;
  endTime: string;
}

const LiveBidding = ({ 
  currentBid: initialBid, 
  bidCount: initialBidCount, 
  timeRemaining, 
  endTime 
}: LiveBiddingProps) => {
  const [currentBid, setCurrentBid] = useState(initialBid);
  const [bidCount, setBidCount] = useState(initialBidCount);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  
  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    // Simulate connection delay
    const connectionTimer = setTimeout(() => {
      setIsConnected(true);
      console.log("WebSocket connected!");
    }, 1500);
    
    // Cleanup on unmount
    return () => {
      clearTimeout(connectionTimer);
      console.log("WebSocket disconnected");
    };
  }, []);
  
  // Simulate real-time bid updates
  useEffect(() => {
    if (!isConnected) return;
    
    const bidUpdateInterval = setInterval(() => {
      // Random decision to update bid or not (30% chance)
      if (Math.random() < 0.3) {
        // Random increment between 100-500
        const increment = Math.floor(Math.random() * 5 + 1) * 100;
        setCurrentBid(prev => prev + increment);
        setBidCount(prev => prev + 1);
        console.log(`New bid: $${currentBid + increment}`);
      }
    }, 5000); // Every 5 seconds
    
    return () => clearInterval(bidUpdateInterval);
  }, [isConnected, currentBid]);
  
  // Time countdown effect
  useEffect(() => {
    const end = new Date(endTime).getTime();
    const now = new Date().getTime();
    const totalTime = end - now;
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const remaining = end - now;
      
      if (remaining <= 0) {
        clearInterval(timer);
        setElapsedTime(100);
      } else {
        // Calculate percentage of time elapsed
        setElapsedTime(((totalTime - remaining) / totalTime) * 100);
      }
    }, 1000);
    
    return () => clearInterval(timer);
  }, [endTime]);
  
  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center">
          <span className="text-4xl font-bold text-primary">
            ${currentBid.toLocaleString()}
          </span>
          {isConnected && 
            <Badge className="ml-2 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              Live
            </Badge>
          }
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Current highest bid
        </p>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-orange-500" />
            <span className="text-sm font-medium">Time Remaining</span>
          </div>
          <span className="text-sm font-medium">{timeRemaining}</span>
        </div>
        <Progress value={elapsedTime} className="h-2" />
      </div>
      
      <div className="grid grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1 text-blue-500" />
            <span className="text-sm font-medium">{bidCount}</span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Bids</p>
        </div>
        
        <div className="flex items-center justify-center flex-col">
          <div className="flex items-center">
            <Activity className="h-4 w-4 mr-1 text-green-500" />
            <span className="text-sm font-medium">
              {bidCount > 15 ? "High" : bidCount > 8 ? "Medium" : "Low"}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Activity</p>
        </div>
      </div>
      
      {!isConnected && (
        <div className="text-center animate-pulse">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Connecting to live bidding...
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveBidding;
