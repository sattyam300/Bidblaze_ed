
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { toast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const UserSignIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // This would be replaced with actual authentication logic
    console.log("Login attempt with:", values);
    
    // For demonstration purposes, show a success toast and redirect
    toast({
      title: "Sign in successful!",
      description: "Welcome back to BidBlaze",
    });
    
    // Redirect to profile page after successful login
    setTimeout(() => navigate("/profile"), 1500);
  };

  return (
    <AuthLayout
      title="User Sign In"
      subtitle="Welcome back! Sign in to your account to continue."
      footer={{
        text: "Don't have an account?",
        linkText: "Sign up",
        linkTo: "/user-signup",
      }}
      userType="user"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-4 w-4" />
                      ) : (
                        <EyeIcon className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="remember" 
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="text-gray-600 dark:text-gray-400">
                Remember me
              </label>
            </div>
            <a href="#" className="text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          
          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </Form>
    </AuthLayout>
  );
};

export default UserSignIn;
