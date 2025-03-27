
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import PasswordInput from "./PasswordInput";
import TermsCheckbox from "./TermsCheckbox";
import { supabase } from "@/integrations/supabase/client";

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

interface SellerRegistrationFormProps {
  onMissingEnvVars: () => void;
}

const SellerRegistrationForm = ({ onMissingEnvVars }: SellerRegistrationFormProps) => {
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
      toast({
        title: "Terms required",
        description: "You must accept the terms to continue",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // 1. Register user with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            role: 'seller',
            business_name: values.businessName,
          }
        }
      });

      if (authError) throw authError;

      // 2. Store additional seller details in 'sellers' table
      const { error: profileError } = await supabase
        .from('sellers')
        .insert({
          user_id: authData.user?.id,
          business_name: values.businessName,
          email: values.email,
          phone: values.phone,
          description: values.description,
          status: 'pending' // Sellers need approval
        });

      if (profileError) throw profileError;

      // Success! Show success message
      toast({
        title: "Seller account created!",
        description: "Your application has been submitted for review",
      });

      // Redirect to sign-in page after successful registration
      setTimeout(() => navigate("/seller-signin"), 1500);
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive"
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
            <FormItem>
              <FormLabel>Business Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business name" {...field} />
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter your business phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your business and the types of items you will be selling"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
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
        
        <TermsCheckbox 
          checked={termsAccepted}
          onChange={setTermsAccepted}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
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
