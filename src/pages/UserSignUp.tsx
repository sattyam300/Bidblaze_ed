
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, User, AtSign, Lock, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { toast } from "sonner";
import PasswordInput from "@/components/PasswordInput";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const UserSignUp = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!termsAccepted) {
      toast("Terms required", {
        description: "You must accept the terms to continue"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Success! Show success message
      toast("Account created!", {
        description: "You can now sign in with your credentials"
      });

      // Redirect to sign-in page after successful registration
      setTimeout(() => navigate("/user-signin"), 1500);
    } catch (error) {
      console.error("Registration error:", error);
      toast("Registration failed", {
        description: error instanceof Error ? error.message : "Please try again later"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create a User Account"
      subtitle="Join BidBlaze to bid on exciting items"
      footer={{
        text: "Already have an account?",
        linkText: "Sign in",
        linkTo: "/user-signin",
      }}
      userType="user"
      isLogin={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="cyber-border">
                <FormLabel className="flex items-center gap-2">
                  <User className="h-4 w-4 text-primary" /> Full Name
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your full name" 
                    {...field} 
                    className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
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
              <FormItem className="cyber-border">
                <FormLabel className="flex items-center gap-2">
                  <AtSign className="h-4 w-4 text-primary" /> Email
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    {...field} 
                    className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="space-y-4 cyber-border p-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <Lock className="h-4 w-4 text-primary" />
              <span>Secure Password</span>
            </div>
            
            <PasswordInput 
              form={form} 
              name="password" 
              label="Password" 
              placeholder="Create a password" 
            />
            
            <PasswordInput 
              form={form} 
              name="confirmPassword" 
              label="Confirm Password" 
              placeholder="Confirm your password" 
            />
          </div>
          
          <div className="neo-card p-4">
            <div className="flex items-center gap-2 text-sm text-primary mb-2">
              <ShieldCheck className="h-4 w-4" />
              <span className="font-medium">Terms & Conditions</span>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="terms" 
                className="rounded border-gray-300 text-primary focus:ring-primary"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
                I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              </label>
            </div>
          </div>
          
          <Button type="submit" className="w-full neo-button" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default UserSignUp;
