import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { formatRupees } from '@/lib/currency';
import { useSocket } from '@/contexts/SocketContext';
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
  TrendingUp
} from 'lucide-react';

interface Auction {
  _id: string;
  title: string;
  description: string;
  category: string;
  starting_price: number;
  current_price: number;
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
}

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const { emitProductUpdate, emitImageUpdate } = useSocket();

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
    
    // Create preview URLs
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const uploadImages = async (): Promise<string[]> => {
    if (selectedFiles.length === 0) return [];

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
    return data.images.map((img: any) => ({
      url: img.url,
      public_id: img.public_id,
      alt: ''
    }));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
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
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20">
      {/* Header */}
      <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-b border-red-200/20 dark:border-red-700/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Bid</span>
                <span className="text-gray-800 dark:text-gray-200">Blaze</span>
              </h1>
              <span className="text-gray-600 dark:text-gray-400">Seller Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user?.full_name || user?.business_name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-gray-200 text-gray-600 hover:bg-gray-50"
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-red-200/20 dark:border-red-700/30">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Package className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Auctions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{auctions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-red-200/20 dark:border-red-700/30">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Auctions</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {auctions.filter(a => a.status === 'active').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-red-200/20 dark:border-red-700/30">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bids</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {auctions.reduce((sum, auction) => sum + auction.total_bids, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-red-200/20 dark:border-red-700/30">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Value</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {formatPrice(auctions.reduce((sum, auction) => sum + auction.current_price, 0))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="auctions" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-red-200/20 dark:border-red-700/30">
            <TabsTrigger value="auctions" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              My Auctions
            </TabsTrigger>
            <TabsTrigger value="create" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Create Auction
            </TabsTrigger>
            <TabsTrigger value="images" className="data-[state=active]:bg-red-600 data-[state=active]:text-white">
              Image Manager
            </TabsTrigger>
          </TabsList>

          <TabsContent value="auctions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">My Auctions</h2>
              <Button
                onClick={() => navigate('/create-auction')}
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
                    onClick={() => navigate('/create-auction')}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Auction
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {auctions.map((auction) => (
                  <Card key={auction._id} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-red-200/20 dark:border-red-700/30 hover:shadow-lg transition-shadow">
                    <CardHeader className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                            {auction.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {auction.category}
                          </CardDescription>
                        </div>
                        <Badge className={getStatusColor(auction.status)}>
                          {auction.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      {auction.images && auction.images.length > 0 && (
                        <div className="mb-4">
                          <img
                            src={auction.images[0].url}
                            alt={auction.images[0].alt || auction.title}
                            className="w-full h-32 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Current Price:</span>
                          <span className="font-semibold text-green-600">{formatPrice(auction.current_price)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Total Bids:</span>
                          <span className="font-semibold">{auction.total_bids}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Ends:</span>
                          <span className="font-semibold">{formatDate(auction.end_time)}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                          onClick={() => navigate(`/auction/${auction._id}`)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() => navigate(`/edit-auction/${auction._id}`)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-red-200/20 dark:border-red-700/30">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
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
                      <Input id="title" placeholder="Enter auction title" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select>
                        <SelectTrigger>
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
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your item in detail..."
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startingPrice">Starting Price (₹)</Label>
                      <Input id="startingPrice" type="number" placeholder="1000" min="100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bidIncrement">Bid Increment (₹)</Label>
                      <Input id="bidIncrement" type="number" placeholder="100" min="1" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="condition">Condition</Label>
                      <Select>
                        <SelectTrigger>
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
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="startTime">Start Time</Label>
                      <Input id="startTime" type="datetime-local" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endTime">End Time</Label>
                      <Input id="endTime" type="datetime-local" />
                    </div>
                  </div>

                  <Button className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Auction
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="images" className="space-y-6">
            <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg border-red-200/20 dark:border-red-700/30">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Image Manager
                </CardTitle>
                <CardDescription>
                  Upload and manage images for your auctions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="border-2 border-dashed border-red-300 dark:border-red-700 rounded-lg p-8 text-center">
                    <Upload className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                      Upload Images
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Drag and drop images here, or click to select files
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label
                      htmlFor="image-upload"
                      className="cursor-pointer bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-medium inline-block"
                    >
                      <ImageIcon className="h-4 w-4 mr-2 inline" />
                      Select Images
                    </Label>
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900 dark:text-gray-100">Selected Images:</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        disabled={uploading}
                        className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700"
                      >
                        {uploading ? 'Uploading...' : 'Upload Images'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;
