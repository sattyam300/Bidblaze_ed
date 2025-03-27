
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import SellerRegistrationForm from "@/components/SellerRegistrationForm";
import EnvConfigDialog from "@/components/EnvConfigDialog";

const SellerSignUp = () => {
  const [showEnvDialog, setShowEnvDialog] = useState(!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY);
  
  return (
    <>
      <AuthLayout
        title="Register as a Seller"
        subtitle="Create a seller account to list your items for auction"
        footer={{
          text: "Already have a seller account?",
          linkText: "Sign in",
          linkTo: "/seller-signin",
        }}
        userType="seller"
        isLogin={false}
      >
        <SellerRegistrationForm onMissingEnvVars={() => setShowEnvDialog(true)} />
      </AuthLayout>

      <EnvConfigDialog 
        open={showEnvDialog} 
        onOpenChange={setShowEnvDialog} 
      />
    </>
  );
};

export default SellerSignUp;
