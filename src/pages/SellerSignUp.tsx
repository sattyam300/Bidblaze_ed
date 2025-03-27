
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import SellerRegistrationForm from "@/components/SellerRegistrationForm";
import EnvConfigDialog from "@/components/EnvConfigDialog";
import { supabase } from "@/integrations/supabase/client";

const SellerSignUp = () => {
  // Check if Supabase connection is valid
  const isSupabaseConfigured = Boolean(supabase);
  const [showEnvDialog, setShowEnvDialog] = useState(!isSupabaseConfigured);
  
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
