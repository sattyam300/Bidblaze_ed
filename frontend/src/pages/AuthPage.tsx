import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { Gavel, Eye, EyeOff, User, AtSign, Lock, Building2 } from "lucide-react";

const userSignupSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const sellerSignupSchema = z.object({
  businessName: z.string().min(2, { message: "Business name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const AuthPage = () => {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [userType, setUserType] = useState<'user' | 'seller'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Choose schema based on mode and userType
  const schema = mode === 'signup'
    ? (userType === 'user' ? userSignupSchema : sellerSignupSchema)
    : loginSchema;

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: mode === 'signup'
      ? (userType === 'user'
        ? { fullName: '', email: '', password: '', confirmPassword: '' }
        : { businessName: '', email: '', password: '', confirmPassword: '' })
      : { email: '', password: '' },
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(values.email, values.password, userType);
        if (error) {
          toast.error("Sign in failed", { description: error.message || "Please check your credentials and try again." });
        } else {
          toast.success("Welcome back!", { description: "You have successfully signed in." });
          navigate("/");
        }
      } else {
        // signup
        if (userType === 'user') {
          const { error } = await signUp(values.email, values.password, values.fullName, 'user');
          if (error) {
            toast.error("Sign up failed", { description: error.message || "Please try again later" });
          } else {
            toast.success("Account created!", { description: "You can now sign in." });
            setMode('login');
          }
        } else {
          const { error } = await signUp(values.email, values.password, values.businessName, 'seller');
          if (error) {
            toast.error("Sign up failed", { description: error.message || "Please try again later" });
          } else {
            toast.success("Seller account created!", { description: "You can now sign in as a seller." });
            setMode('login');
          }
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-red-900/20 dark:to-orange-900/20 px-4 relative overflow-hidden">
      <div className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 space-y-6 relative z-10 border border-red-200/20 dark:border-red-700/30 mt-8">
        <div className="flex justify-between items-center mb-4">
          <div className="flex gap-2">
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${mode === 'login' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setMode('login')}
            >
              Login
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${mode === 'signup' ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
              onClick={() => setMode('signup')}
            >
              Sign Up
            </button>
          </div>
          <select
            className="ml-4 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-200 font-medium"
            value={userType}
            onChange={e => setUserType(e.target.value as 'user' | 'seller')}
          >
            <option value="user">User</option>
            <option value="seller">Seller</option>
          </select>
        </div>
        <div className="text-center mb-4">
          <span className="font-bold text-2xl tracking-tight">
            <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Bid</span>
            <span className="text-gray-800 dark:text-gray-200">Blaze</span>
          </span>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {mode === 'signup' && userType === 'user' && (
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <User className="h-4 w-4 text-red-600" /> Full Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {mode === 'signup' && userType === 'seller' && (
              <FormField
                control={form.control}
                name="businessName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Building2 className="h-4 w-4 text-red-600" /> Business Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your business name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <AtSign className="h-4 w-4 text-red-600" /> Email Address
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email" {...field} />
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
                  <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                    <Lock className="h-4 w-4 text-red-600" /> Password
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder={mode === 'signup' ? "Create a password" : "Enter your password"}
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
            {mode === 'signup' && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium">
                      <Lock className="h-4 w-4 text-red-600" /> Confirm Password
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm your password"
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
            )}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading
                ? (mode === 'login' ? 'Signing In...' : 'Creating Account...')
                : (mode === 'login' ? 'Sign In to BidBlaze' : 'Create Account')}
            </Button>
          </form>
        </Form>
        <div className="pt-4 text-center text-sm">
          {mode === 'login' ? (
            <>
              <span className="text-gray-600 dark:text-gray-400">Don't have an account?</span>{' '}
              <button
                className="text-red-600 hover:text-red-700 font-medium hover:underline"
                onClick={() => setMode('signup')}
              >
                Sign up now
              </button>
            </>
          ) : (
            <>
              <span className="text-gray-600 dark:text-gray-400">Already have an account?</span>{' '}
              <button
                className="text-red-600 hover:text-red-700 font-medium hover:underline"
                onClick={() => setMode('login')}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 