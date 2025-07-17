
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { Gavel, Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  rememberMe: z.boolean().optional(),
});

const UserSignIn = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        toast.error("Sign in failed", {
          description: error.message || "Please check your credentials and try again."
        });
      } else {
        toast.success("Welcome back!", {
          description: "You have successfully signed in."
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("An unexpected error occurred", {
        description: "Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20 px-4 relative overflow-hidden">
      {/* Auction-themed background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -left-20 -top-20 w-60 h-60 rounded-full bg-gradient-to-r from-red-500/10 to-orange-500/10 backdrop-blur-3xl animate-pulse"></div>
        <div className="absolute right-10 bottom-10 w-80 h-80 rounded-full bg-gradient-to-r from-yellow-500/10 to-red-500/10 backdrop-blur-3xl animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute left-1/3 top-1/4 w-40 h-40 rounded-full bg-gradient-to-r from-orange-400/10 to-red-400/10 backdrop-blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>
      
      <Link
        to="/"
        className="absolute top-6 left-6 text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors z-10 font-medium"
      >
        ← Back to Home
      </Link>
      
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-6 relative z-10 border border-red-200/20 dark:border-red-700/30">
        {/* Auction glow effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-red-500/20 via-orange-500/20 to-yellow-500/20 rounded-2xl blur-xl opacity-60"></div>
        
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-3 mb-6 group"
          >
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-orange-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
              <Gavel className="text-white h-6 w-6" />
            </div>
            <span className="font-bold text-2xl tracking-tight">
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Bid</span>
              <span className="text-gray-800 dark:text-gray-200">Blaze</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Sign in to start bidding on amazing items</p>
        </div>
        
        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-300/50 to-transparent"></div>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Email Address</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your email" 
                      className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-red-200 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 h-12"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Enter your password"
                        className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-red-200 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 h-12 pr-12"
                        {...field} 
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-12 w-12 text-gray-500 hover:text-red-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="border-red-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600"
                      />
                    </FormControl>
                    <FormLabel className="text-sm cursor-pointer text-gray-600 dark:text-gray-400">Remember me</FormLabel>
                  </FormItem>
                )}
              />
              
              <Button variant="link" className="p-0 h-auto font-medium text-red-600 hover:text-red-700" type="button">
                Forgot password?
              </Button>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In to BidBlaze"}
            </Button>
          </form>
        </Form>
        
        <div className="pt-4 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Don't have an account?</span>{" "}
          <Link to="/user-signup" className="text-red-600 hover:text-red-700 font-medium hover:underline">
            Sign up now
          </Link>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            Want to sell items?{" "}
          </span>
          <Link 
            to="/seller-signin" 
            className="text-red-600 hover:text-red-700 font-medium text-sm hover:underline"
          >
            Seller Sign In
          </Link>
        </div>
      </div>
      
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-600 flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500/50 rounded-full animate-pulse"></div>
        Secure Authentication • Real-time Bidding Platform
      </div>
    </div>
  );
};

export default UserSignIn;
