import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { formatRupees } from '@/lib/currency';
import { useSocket } from '@/contexts/SocketContext';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Plus, 
  Upload, 
  Image as ImageIcon, 
  DollarSign, 
  Clock, 
  Users, 
  Settings,
  LogOut,
  Eye,
  Edit,
  Trash2,
  Package,
  TrendingUp,
  Info,
  Tag,
  BarChart,
  Loader2
} from 'lucide-react';

interface Bid {
  _id: string;
  auction_id: string;
  bidder_id: {
    _id: string;
    name: string;
    email: string;
  };
  amount: number;
  is_winning: boolean;
  bid_time: string;
  status: string;
}

interface Auction {
  _id: string;
  title: string;
  description: string;
  category: string;
  starting_price: number;
  current_price: number;
  bid_increment: number;
  condition: string;
  status: string;
  images: Array<{
    url: string;
    public_id: string;
    alt?: string;
  }>;
  start_time: string;
  end_time: string;
  total_bids: number;
  createdAt: string;
  bids?: Bid[];
}

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);
  const [bidDialogOpen, setBidDialogOpen] = useState<boolean>(false);
  const [loadingBids, setLoadingBids] = useState<boolean>(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploadedImages, setUploadedImages] = useState<Array<{url: string, public_id: string}>>([]);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { emitProductUpdate, emitImageUpdate } = useSocket();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    starting_price: '',
    bid_increment: '',
    condition: '',
    start_time: '',
    end_time: ''
  });
  
  // Form validation state
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Check if user is a seller
  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.role !== 'seller') {
      navigate('/');
      return;
    }
    fetchAuctions();
  }, [user, navigate]);

  const fetchAuctions = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:8080/api/users/my-auctions', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setAuctions(data.auctions || []);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
      toast.error('Failed to load auctions');
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch bid details for a specific auction
  const fetchBidDetails = async (auctionId: string) => {
    setLoadingBids(true);
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`http://localhost:8080/api/bids/auction/${auctionId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        
        // Sort bids in ascending order by amount (lowest to highest)
        const sortedBids = [...data.bids].sort((a, b) => a.amount - b.amount);
        
        // Mark the highest bid
        if (sortedBids.length > 0) {
          // Find the highest bid amount
          const highestBidAmount = Math.max(...sortedBids.map(bid => bid.amount));
          
          // Mark bids with the highest amount
          sortedBids.forEach(bid => {
            bid.is_winning = bid.amount === highestBidAmount;
          });
        }
        
        // Find the auction and update it with bid details
        const updatedAuctions = auctions.map(auction => {
          if (auction._id === auctionId) {
            return { ...auction, bids: sortedBids };
          }
          return auction;
        });
        
        setAuctions(updatedAuctions);
        
        // Set the selected auction for the dialog
        const auction = updatedAuctions.find(a => a._id === auctionId);
        if (auction) {
          setSelectedAuction(auction);
          setBidDialogOpen(true);
        }
      }
    } catch (error) {
      console.error('Error fetching bid details:', error);
      toast.error('Failed to load bid details');
    } finally {
      setLoadingBids(false);
    }
  };

  // Function to delete an auction
  const deleteAuction = async (auctionId: string) => {
    // Find the auction to check if it has bids
    const auctionToDelete = auctions.find(auction => auction._id === auctionId);
    
    if (auctionToDelete && auctionToDelete.total_bids > 0) {
      toast.error('Cannot delete auctions with existing bids');
      return;
    }
    
    if (!window.confirm('Are you sure you want to delete this auction? This action cannot be undone.')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('auth-token');
      const response = await fetch(`http://localhost:8080/api/auctions/${auctionId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        // Remove the auction from the state
        setAuctions(auctions.filter(auction => auction._id !== auctionId));
        toast.success('Auction deleted successfully');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete auction');
      }
    } catch (error) {
      console.error('Error deleting auction:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete auction');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Limit to 3 images
    const limitedFiles = files.slice(0, 3);
    
    // If user tries to upload more than 3 images, show a warning
    if (files.length > 3) {
      toast.warning('Maximum 3 images allowed. Only the first 3 images will be used.');
    }
    
    setSelectedFiles(limitedFiles);
    
    // Create preview URLs
    const urls = limitedFiles.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    try {
      setUploading(true);
      
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:8080/api/images/upload-multiple', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload images');
      }

      const data = await response.json();
      const uploadedImgs = data.images.map((img: any) => ({
        url: img.url,
        public_id: img.public_id
      }));
      
      setUploadedImages(uploadedImgs);
      toast.success(`${uploadedImgs.length} images uploaded successfully`);
      
      // Clear the file input
      setSelectedFiles([]);
      
      // Keep the preview URLs to show the uploaded images
      return uploadedImgs;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error for this field when user types
    if (formErrors[id]) {
      setFormErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };
  
  // Handle select changes
  const handleSelectChange = (value: string, id: string) => {
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Clear error for this field when user selects
    if (formErrors[id]) {
      setFormErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.category) errors.category = 'Category is required';
    if (!formData.starting_price) errors.starting_price = 'Starting price is required';
    else if (parseFloat(formData.starting_price) < 100) errors.starting_price = 'Starting price must be at least ₹100';
    if (!formData.bid_increment) errors.bid_increment = 'Bid increment is required';
    else if (parseFloat(formData.bid_increment) < 1) errors.bid_increment = 'Bid increment must be at least ₹1';
    if (!formData.condition) errors.condition = 'Condition is required';
    if (!formData.start_time) errors.start_time = 'Start time is required';
    if (!formData.end_time) errors.end_time = 'End time is required';
    else if (new Date(formData.start_time) >= new Date(formData.end_time)) {
      errors.end_time = 'End time must be after start time';
    }
    
    // Check if images are uploaded
    if (uploadedImages.length === 0) {
      errors.images = 'Please upload at least one image';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleCreateAuction = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      setFormSubmitting(true);
      
      const auctionData = {
        ...formData,
        starting_price: parseFloat(formData.starting_price),
        bid_increment: parseFloat(formData.bid_increment),
        images: uploadedImages
      };
      
      const token = localStorage.getItem('auth-token');
      const response = await fetch('http://localhost:8080/api/auctions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(auctionData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create auction');
      }
      
      const data = await response.json();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        starting_price: '',
        bid_increment: '',
        condition: '',
        start_time: '',
        end_time: ''
      });
      setUploadedImages([]);
      setPreviewUrls([]);
      
      // Emit socket event for product update
      emitProductUpdate(data.auction._id, { action: 'create' });
      
      toast.success('Auction created successfully!');
      
      // Refresh auctions list
      fetchAuctions();
      
      // Switch to auctions tab
      const auctionsTab = document.querySelector('[data-state="inactive"][value="my-auctions"]');
      if (auctionsTab instanceof HTMLElement) {
        auctionsTab.click();
      }
      
    } catch (error) {
      console.error('Error creating auction:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create auction');
    } finally {
      setFormSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ended': return 'bg-gray-100 text-gray-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatPrice = (price: number) => {
    return formatRupees(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-blue-950/10 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-sm"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-blue-950/10 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-blue-200/20 dark:border-blue-700/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Bid</span>
                <span className="text-gray-800 dark:text-gray-200">Blaze</span>
              </h1>
              <span className="text-gray-600 dark:text-gray-400">Seller Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user?.full_name || user?.email?.split('@')[0]}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/30"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800/50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="overflow-hidden border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg">
            <div className="h-1 bg-gradient-to-r from-red-600 to-red-500"></div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Auctions</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{auctions.length}</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  All your listed items
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg">
            <div className="h-1 bg-gradient-to-r from-green-600 to-green-500"></div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Auctions</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {auctions.filter(a => a.status === 'active').length}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  Currently running auctions
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg">
            <div className="h-1 bg-gradient-to-r from-blue-600 to-blue-500"></div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bids</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {auctions.reduce((sum, auction) => sum + auction.total_bids, 0)}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  Bids across all auctions
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-border hover:shadow-md transition-all duration-300 hover:-translate-y-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg">
            <div className="h-1 bg-gradient-to-r from-orange-600 to-orange-500"></div>
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(auctions.reduce((sum, auction) => sum + auction.current_price, 0))}
                  </p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                  <Info className="h-3 w-3 mr-1" />
                  Current value of all auctions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
          <Tabs defaultValue="my-auctions" className="space-y-6">
            <TabsList className="inline-flex h-12 items-center justify-center rounded-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-blue-200/20 dark:border-blue-700/30 w-full">
               <TabsTrigger value="my-auctions" className="flex-1 rounded-md px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm">
                 <Package className="h-4 w-4 mr-2 inline" />
                 My Auctions
               </TabsTrigger>
               <TabsTrigger value="create-auction" className="flex-1 rounded-md px-6 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-sm">
                 <Plus className="h-4 w-4 mr-2 inline" />
                 Create Auction
               </TabsTrigger>
            </TabsList>

          <TabsContent value="my-auctions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Auctions</h2>
              <Button
                onClick={() => {
                  const createAuctionTab = document.querySelector('[data-state="inactive"][value="create-auction"]');
                  if (createAuctionTab instanceof HTMLElement) {
                    createAuctionTab.click();
                  }
                }}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Auction
              </Button>
            </div>

            {auctions.length === 0 ? (
              <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-red-200/20 dark:border-red-700/30">
                <CardContent className="p-8 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No auctions yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start selling by creating your first auction
                  </p>
                  <Button
                    onClick={() => {
                      const createAuctionTab = document.querySelector('[data-state="inactive"][value="create-auction"]');
                      if (createAuctionTab instanceof HTMLElement) {
                        createAuctionTab.click();
                      }
                    }}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Auction
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {auctions.map((auction) => (
                  <Card key={auction._id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-red-200/20 dark:border-red-700/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Colored status indicator at top of card */}
                    <div className={`h-1.5 w-full ${auction.status === 'active' ? 'bg-green-500' : auction.status === 'scheduled' ? 'bg-blue-500' : auction.status === 'ended' ? 'bg-gray-500' : 'bg-yellow-500'}`}></div>
                    
                    <CardHeader className="p-3 sm:p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                            {auction.title}
                          </CardTitle>
                          <CardDescription className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <Badge variant="outline" className="mr-1 text-xs">{auction.category}</Badge>
                          </CardDescription>
                        </div>
                        <Badge className={`${getStatusColor(auction.status)} text-xs whitespace-nowrap`}>
                          {auction.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 pt-0">
                      {auction.images && auction.images.length > 0 && (
                        <div className="mb-3 sm:mb-4">
                          <img
                            src={auction.images[0].url}
                            alt={auction.images[0].alt || auction.title}
                            className="w-full h-24 sm:h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      <Separator className="my-2 sm:my-3" />
                      
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-3 sm:mt-4">
                        <div className="flex items-center">
                           <Tag className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2 text-gray-500" />
                           <div>
                             <div className="flex items-center">
                               <p className="text-xs text-gray-500 dark:text-gray-400">Base Price</p>
                               <TooltipProvider>
                                 <Tooltip>
                                   <TooltipTrigger>
                                     <Info className="h-3 w-3 ml-1 text-gray-400" />
                                   </TooltipTrigger>
                                   <TooltipContent>
                                     <p className="text-xs">The starting price of this auction</p>
                                   </TooltipContent>
                                 </Tooltip>
                               </TooltipProvider>
                             </div>
                             <div className="flex items-center">
                               <p className="font-medium text-xs sm:text-sm">{formatPrice(auction.starting_price)}</p>
                               <Badge variant="outline" className="ml-1 sm:ml-2 text-xs py-0 h-4 sm:h-5">Base</Badge>
                             </div>
                           </div>
                         </div>
                         
                         <div className="flex items-center">
                           <DollarSign className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2 text-green-600" />
                           <div>
                             <div className="flex items-center">
                               <p className="text-xs text-gray-500 dark:text-gray-400">Current Price</p>
                               <TooltipProvider>
                                 <Tooltip>
                                   <TooltipTrigger>
                                     <Info className="h-3 w-3 ml-1 text-gray-400" />
                                   </TooltipTrigger>
                                   <TooltipContent>
                                     <p className="text-xs">The highest bid price</p>
                                   </TooltipContent>
                                 </Tooltip>
                               </TooltipProvider>
                             </div>
                             <div className="flex items-center">
                               <p className="font-bold text-green-600 text-xs sm:text-sm">{formatPrice(auction.current_price)}</p>
                               {auction.current_price > auction.starting_price && (
                                 <Badge className="ml-1 sm:ml-2 text-xs py-0 h-4 sm:h-5 bg-green-500 text-white">Highest</Badge>
                               )}
                             </div>
                           </div>
                         </div>
                        
                        <div className="flex items-center">
                          <BarChart className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Total Bids</p>
                            <p className="font-medium text-xs sm:text-sm">{auction.total_bids}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Clock className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2 text-gray-500" />
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Ends</p>
                            <p className="font-medium text-xs sm:text-sm">{formatDate(auction.end_time)}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mt-3 sm:mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:flex-1 border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-950/30 text-xs sm:text-sm"
                          onClick={() => navigate(`/auction/${auction._id}`)}
                        >
                          <Eye className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:flex-1 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:hover:bg-blue-950/30 text-xs sm:text-sm"
                          onClick={() => navigate(`/edit-auction/${auction._id}`)}
                        >
                          <Edit className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:flex-1 border-green-200 text-green-600 hover:bg-green-50 dark:border-green-800 dark:hover:bg-green-950/30 text-xs sm:text-sm"
                          onClick={() => fetchBidDetails(auction._id)}
                        >
                          <Users className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                          Bids
                        </Button>
                        <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:flex-1 border-gray-200 text-red-600 hover:bg-red-50 dark:border-gray-700 dark:hover:bg-red-950/30 text-xs sm:text-sm"
                      onClick={() => deleteAuction(auction._id)}
                      disabled={auction.total_bids > 0}
                      title={auction.total_bids > 0 ? "Cannot delete auctions with bids" : "Delete this auction"}
                    >
                      <Trash2 className="h-3 sm:h-4 w-3 sm:w-4 mr-1" />
                      Delete
                    </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create-auction" className="space-y-6">
            <div className="flex justify-end mb-4">
              <Button 
                onClick={() => navigate('/edit-auction/new')}
                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Auction
              </Button>
            </div>
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-red-200/20 dark:border-red-700/30 overflow-hidden">
              <div className="h-1.5 w-full bg-gradient-to-r from-red-600 to-orange-600"></div>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center">
                  <Plus className="h-5 w-5 mr-2 text-red-600" />
                  Create New Auction
                </CardTitle>
                <CardDescription>
                  Fill in the details below to create a new auction listing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="title">Auction Title</Label>
                      <Input 
                        id="title" 
                        placeholder="Enter auction title" 
                        value={formData.title}
                        onChange={handleInputChange}
                        className={formErrors.title ? 'border-red-500' : ''}
                      />
                      {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => handleSelectChange(value, 'category')}>
                        <SelectTrigger className={formErrors.category ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="watches">Watches</SelectItem>
                          <SelectItem value="art">Art</SelectItem>
                          <SelectItem value="jewelry">Jewelry</SelectItem>
                          <SelectItem value="cars">Cars</SelectItem>
                          <SelectItem value="books">Books</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="collectibles">Collectibles</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.category && <p className="text-red-500 text-xs mt-1">{formErrors.category}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item in detail..."
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className={formErrors.description ? 'border-red-500' : ''}
                    />
                    {formErrors.description && <p className="text-red-500 text-xs mt-1">{formErrors.description}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="starting_price">Starting Price (₹)</Label>
                      <Input 
                        id="starting_price" 
                        type="number" 
                        placeholder="1000" 
                        min="100" 
                        value={formData.starting_price}
                        onChange={handleInputChange}
                        className={formErrors.starting_price ? 'border-red-500' : ''}
                      />
                      {formErrors.starting_price && <p className="text-red-500 text-xs mt-1">{formErrors.starting_price}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bid_increment">Bid Increment (₹)</Label>
                      <Input 
                        id="bid_increment" 
                        type="number" 
                        placeholder="100" 
                        min="1" 
                        value={formData.bid_increment}
                        onChange={handleInputChange}
                        className={formErrors.bid_increment ? 'border-red-500' : ''}
                      />
                      {formErrors.bid_increment && <p className="text-red-500 text-xs mt-1">{formErrors.bid_increment}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select value={formData.condition} onValueChange={(value) => handleSelectChange(value, 'condition')}>
                        <SelectTrigger className={formErrors.condition ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="new">New</SelectItem>
                          <SelectItem value="like_new">Like New</SelectItem>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="poor">Poor</SelectItem>
                        </SelectContent>
                      </Select>
                      {formErrors.condition && <p className="text-red-500 text-xs mt-1">{formErrors.condition}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="start_time">Start Time</Label>
                      <Input 
                        id="start_time" 
                        type="datetime-local" 
                        value={formData.start_time}
                        onChange={handleInputChange}
                        className={formErrors.start_time ? 'border-red-500' : ''}
                      />
                      {formErrors.start_time && <p className="text-red-500 text-xs mt-1">{formErrors.start_time}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_time">End Time</Label>
                      <Input 
                        id="end_time" 
                        type="datetime-local" 
                        value={formData.end_time}
                        onChange={handleInputChange}
                        className={formErrors.end_time ? 'border-red-500' : ''}
                      />
                      {formErrors.end_time && <p className="text-red-500 text-xs mt-1">{formErrors.end_time}</p>}
                    </div>
                  </div>
                  
                  {/* Image upload section */}
                  <div className="space-y-2">
                    <Label>Product Images (Required)</Label>
                    <div className="border-2 border-dashed border-red-300 dark:border-red-700 rounded-lg p-4 text-center">
                      <Upload className="h-8 w-8 text-red-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        Upload up to 3 images of your product
                      </p>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="product-images"
                      />
                      <Label
                        htmlFor="product-images"
                        className="cursor-pointer bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium inline-block"
                      >
                        <ImageIcon className="h-4 w-4 mr-1 inline" />
                        Select Images
                      </Label>
                    </div>
                    {formErrors.images && <p className="text-red-500 text-xs mt-1">{formErrors.images}</p>}
                  </div>
                  
                  {/* Preview selected images */}
                  {previewUrls.length > 0 && (
                    <div className="space-y-2">
                      <Label>Selected Images</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {previewUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => {
                                setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                                setPreviewUrls(previewUrls.filter((_, i) => i !== index));
                              }}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={uploadImages}
                        disabled={uploading || selectedFiles.length === 0}
                        className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
                      >
                        {uploading ? 'Uploading...' : 'Upload Selected Images'}
                      </Button>
                    </div>
                  )}
                  
                  {/* Display uploaded images */}
                  {uploadedImages.length > 0 && (
                    <div className="space-y-2">
                      <Label>Uploaded Images</Label>
                      <div className="grid grid-cols-3 gap-4">
                        {uploadedImages.map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={img.url}
                              alt={`Uploaded ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border-2 border-green-500"
                            />
                            <div className="absolute top-1 right-1 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                              Uploaded
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button 
                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                    onClick={handleCreateAuction}
                    disabled={formSubmitting}
                  >
                    {formSubmitting ? 'Creating...' : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Auction
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>

      {/* Bid Details Dialog */}
      <Dialog open={bidDialogOpen} onOpenChange={setBidDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedAuction && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg sm:text-xl font-semibold flex flex-col sm:flex-row sm:items-center gap-1">
                  <div className="flex items-center">
                    <Users className="h-4 sm:h-5 w-4 sm:w-5 mr-2 text-primary" />
                    Bid Details
                  </div>
                  <span className="text-sm sm:text-base text-muted-foreground sm:ml-2 truncate">
                    for {selectedAuction.title}
                  </span>
                </DialogTitle>
                <DialogDescription className="text-xs sm:text-sm">
                  Showing all bids for this auction. Base price: {formatPrice(selectedAuction.starting_price)}
                </DialogDescription>
              </DialogHeader>
              
              <div className="mt-4">
                {loadingBids ? (
                  <div className="flex justify-center items-center py-6 sm:py-8">
                    <div className="animate-spin rounded-full h-6 sm:h-8 w-6 sm:w-8 border-b-2 border-primary"></div>
                  </div>
                ) : selectedAuction.bids && selectedAuction.bids.length > 0 ? (
                  <div className="border rounded-lg overflow-hidden overflow-x-auto -mx-2 sm:mx-0">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Bidder</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Amount</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium hidden sm:table-cell">Date & Time</th>
                          <th className="px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {selectedAuction.bids.map((bid) => (
                          <tr key={bid._id} className={bid.is_winning ? 'bg-green-50 dark:bg-green-900/10 border-l-4 border-l-green-500' : ''}>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                              <div className="flex items-center">
                                <div className="font-medium">{bid.bidder_id.name}</div>
                                {bid.is_winning && (
                                  <Badge className="ml-2 bg-green-500 text-white text-xs">Highest Bidder</Badge>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">{bid.bidder_id.email}</div>
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                              <div className={`font-bold ${bid.is_winning ? 'text-green-600 dark:text-green-400' : ''}`}>
                                {formatPrice(bid.amount)}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {bid.amount === selectedAuction.starting_price && (
                                  <Badge variant="outline" className="text-xs">Base Price</Badge>
                                )}
                                {bid.is_winning && (
                                  <Badge className="bg-green-500 text-white text-xs">Highest Bid</Badge>
                                )}
                              </div>
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell">
                              {new Date(bid.bid_time).toLocaleString()}
                            </td>
                            <td className="px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm">
                              <Badge className={`text-xs ${bid.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}`}>
                                {bid.status}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-6 sm:py-8 border rounded-lg">
                    <p className="text-xs sm:text-sm text-muted-foreground">No bids have been placed for this auction yet.</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 sm:mt-6 flex justify-end">
                <Button variant="outline" size="sm" onClick={() => setBidDialogOpen(false)}>
                  Close
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SellerDashboard;
