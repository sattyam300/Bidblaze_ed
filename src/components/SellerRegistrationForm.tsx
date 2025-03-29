
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Building2, AtSign, Phone, FileText, Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import PasswordInput from "./PasswordInput";
import TermsCheckbox from "./TermsCheckbox";

// Form schema validation
const formSchema = z.object({
  businessName: z.string().min(2, { message: "Business name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }).max(500, { message: "Description cannot exceed 500 characters" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const SellerRegistrationForm = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      email: "",
      phone: "",
      description: "",
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
      toast("Seller account created!", {
        description: "Your application has been submitted for review"
      });

      // Redirect to sign-in page after successful registration
      setTimeout(() => navigate("/seller-signin"), 1500);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem className="cyber-border">
              <FormLabel className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-primary" /> Business Name
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your business name" 
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
                  placeholder="Enter your business email" 
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
          name="phone"
          render={({ field }) => (
            <FormItem className="cyber-border">
              <FormLabel className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary" /> Phone Number
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter your business phone" 
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
          name="description"
          render={({ field }) => (
            <FormItem className="cyber-border">
              <FormLabel className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> Business Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your business and the types of items you will be selling"
                  className="min-h-[100px] bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"
                  {...field}
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
          <TermsCheckbox 
            checked={termsAccepted}
            onChange={setTermsAccepted}
          />
        </div>
        
        <Button type="submit" className="w-full neo-button" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Register as Seller"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SellerRegistrationForm;
