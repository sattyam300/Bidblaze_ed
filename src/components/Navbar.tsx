
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, Search, Bell, ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const upcomingAuctions = [
    {
      id: "1",
      title: "Vintage Rolex Collection",
      time: "Tomorrow, 2:00 PM",
      image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&q=80&w=100&h=100",
    },
    {
      id: "2",
      title: "Rare Art Pieces Auction",
      time: "Today, 8:00 PM",
      image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=100&h=100",
    },
    {
      id: "3",
      title: "Classic Cars Exhibition",
      time: "Jul 15, 10:00 AM",
      image: "https://images.unsplash.com/photo-1567808291548-fc3ee04dbcf0?auto=format&fit=crop&q=80&w=100&h=100",
    }
  ];

  const getUserDisplayName = () => {
    if (user?.full_name) return user.full_name;
    if (user?.email) return user.email.split('@')[0];
    return "User";
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center animate-pulse-light">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">
              <span className="text-gradient">Bid</span>
              <span className="text-gray-800 dark:text-gray-200">Blaze</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors link-underline"
            >
              Home
            </Link>
            <Link 
              to="/auctions" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors link-underline"
            >
              Auctions
            </Link>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors link-underline">
                  Categories
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/auctions?category=watches" className="cursor-pointer">Watches</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/auctions?category=art" className="cursor-pointer">Art</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/auctions?category=jewelry" className="cursor-pointer">Jewelry</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/auctions?category=cars" className="cursor-pointer">Cars</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/auctions?category=books" className="cursor-pointer">Books</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link 
              to="/about" 
              className="text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors link-underline"
            >
              About
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200">
              <Search className="h-5 w-5" />
            </Button>
            
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200 relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full flex items-center justify-center text-[10px] text-white">
                      3
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">Upcoming Auctions</h3>
                      <Button variant="link" size="sm" className="p-0 h-auto">
                        Mark all as read
                      </Button>
                    </div>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {upcomingAuctions.map((auction) => (
                      <DropdownMenuItem key={auction.id} asChild>
                        <Link to={`/auctions/${auction.id}`} className="flex items-start gap-3 py-3 cursor-pointer">
                          <img 
                            src={auction.image} 
                            alt={auction.title} 
                            className="h-10 w-10 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-medium text-sm">{auction.title}</p>
                            <p className="text-gray-500 dark:text-gray-400 text-xs">{auction.time}</p>
                          </div>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <div className="p-2 border-t">
                    <Button variant="outline" size="sm" className="w-full" asChild>
                      <Link to="/notifications">
                        View All Notifications
                      </Link>
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
            {authLoading ? (
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2 h-auto">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-200">
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{getUserDisplayName()}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/user-profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="rounded-full">
                      Sign In
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col h-full">
                      <div className="flex-grow flex flex-col items-center justify-center space-y-6 py-8">
                        <h3 className="text-2xl font-bold">Choose Account Type</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center px-4">
                          Select the account type you want to sign in with
                        </p>
                        
                        <div className="grid grid-cols-1 gap-4 w-full px-4">
                          <SheetClose asChild>
                            <Button asChild size="lg" className="w-full">
                              <Link to="/user-signin">Sign In as User</Link>
                            </Button>
                          </SheetClose>
                          
                          <SheetClose asChild>
                            <Button asChild variant="outline" size="lg" className="w-full">
                              <Link to="/seller-signin">Sign In as Seller</Link>
                            </Button>
                          </SheetClose>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
                
                <Sheet>
                  <SheetTrigger asChild>
                    <Button className="rounded-full">
                      Sign Up
                    </Button>
                  </SheetTrigger>
                  <SheetContent className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col h-full">
                      <div className="flex-grow flex flex-col items-center justify-center space-y-6 py-8">
                        <h3 className="text-2xl font-bold">Create Account</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center px-4">
                          Choose the type of account you want to create
                        </p>
                        
                        <div className="grid grid-cols-1 gap-4 w-full px-4">
                          <SheetClose asChild>
                            <Button asChild size="lg" className="w-full">
                              <Link to="/user-signup">Register as User</Link>
                            </Button>
                          </SheetClose>
                          
                          <SheetClose asChild>
                            <Button asChild variant="outline" size="lg" className="w-full">
                              <Link to="/seller-signup">Register as Seller</Link>
                            </Button>
                          </SheetClose>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? 
                <X className="h-6 w-6 text-gray-700 dark:text-gray-200" /> : 
                <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />
              }
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 absolute left-0 right-0 top-full shadow-md animate-fade-in">
            <div className="py-4 px-4 space-y-3">
              <Link 
                to="/" 
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/auctions" 
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Auctions
              </Link>
              <div className="py-2">
                <button 
                  className="flex items-center text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary w-full justify-between"
                  onClick={(e) => {
                    e.preventDefault();
                    const submenu = document.getElementById('categories-submenu');
                    if (submenu) {
                      submenu.classList.toggle('hidden');
                    }
                  }}
                >
                  <span>Categories</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                <div id="categories-submenu" className="hidden pl-4 mt-2 space-y-2">
                  <Link 
                    to="/auctions?category=watches" 
                    className="block py-1 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Watches
                  </Link>
                  <Link 
                    to="/auctions?category=art" 
                    className="block py-1 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Art
                  </Link>
                  <Link 
                    to="/auctions?category=jewelry" 
                    className="block py-1 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Jewelry
                  </Link>
                  <Link 
                    to="/auctions?category=cars" 
                    className="block py-1 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Cars
                  </Link>
                  <Link 
                    to="/auctions?category=books" 
                    className="block py-1 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Books
                  </Link>
                </div>
              </div>
              <Link 
                to="/about" 
                className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              
              {user ? (
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3 py-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{getUserDisplayName()}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link 
                    to="/user-profile" 
                    className="block py-2 text-gray-700 dark:text-gray-200 hover:text-primary dark:hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start p-2 text-red-600 hover:text-red-700"
                    onClick={() => {
                      handleSignOut();
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Link to="/user-signin" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/user-signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
