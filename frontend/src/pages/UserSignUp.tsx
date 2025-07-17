
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Gavel, Eye, EyeOff, User, AtSign, Lock, Loader2 } from "lucide-react";

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const UserSignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!termsAccepted) {
      toast.error("Terms required", {
        description: "You must accept the terms to continue"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await signUp(values.email, values.password, values.fullName);
      
      if (error) {
        toast.error("Sign up failed", {
          description: error.message || "Please try again later"
        });
      } else {
        toast.success("Account created successfully!", {
          description: "Please check your email to verify your account"
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed", {
        description: "An unexpected error occurred. Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            Join BidBlaze
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Create your account to start bidding</p>
        </div>
        
        <div className="h-px w-full bg-gradient-to-r from-transparent via-red-300/50 to-transparent"></div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <User className="h-4 w-4 text-red-600" /> Full Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter your full name" 
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <AtSign className="h-4 w-4 text-red-600" /> Email Address
                  </FormLabel>
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
            
            <div className="space-y-4 p-4 bg-red-50/50 dark:bg-red-900/10 rounded-xl border border-red-200/30 dark:border-red-700/30">
              <div className="flex items-center gap-2 text-sm text-red-700 dark:text-red-400 mb-2">
                <Lock className="h-4 w-4" />
                <span className="font-medium">Secure Password</span>
              </div>
              
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
                          placeholder="Create a password"
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
              
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300 font-medium">Confirm Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
                          className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm border-red-200 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 h-12 pr-12"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-12 w-12 text-gray-500 hover:text-red-600"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="p-4 bg-orange-50/50 dark:bg-orange-900/10 rounded-xl border border-orange-200/30 dark:border-orange-700/30">
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="terms" 
                  className="rounded border-red-300 text-red-600 focus:ring-red-500 focus:ring-offset-0"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                  I agree to the <a href="#" className="text-red-600 hover:text-red-700 hover:underline">Terms of Service</a> and <a href="#" className="text-red-600 hover:text-red-700 hover:underline">Privacy Policy</a>
                </label>
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Your Account"
              )}
            </Button>
          </form>
        </Form>
        
        <div className="pt-4 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">Already have an account?</span>{" "}
          <Link to="/user-signin" className="text-red-600 hover:text-red-700 font-medium hover:underline">
            Sign in
          </Link>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            Want to sell items?{" "}
          </span>
          <Link 
            to="/seller-signup" 
            className="text-red-600 hover:text-red-700 font-medium text-sm hover:underline"
          >
            Seller Sign Up
          </Link>
        </div>
      </div>
      
      <div className="mt-6 text-xs text-gray-500 dark:text-gray-600 flex items-center gap-2">
        <div className="w-2 h-2 bg-red-500/50 rounded-full animate-pulse"></div>
        Secure Registration • Join Thousands of Bidders
      </div>
    </div>
  );
};

export default UserSignUp;
