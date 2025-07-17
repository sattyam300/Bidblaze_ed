
import { useState } from "react";
import AuthLayout from "@/components/AuthLayout";
import SellerRegistrationForm from "@/components/SellerRegistrationForm";

const SellerSignUp = () => {
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
        <SellerRegistrationForm />
      </AuthLayout>
    </>
  );
};

export default SellerSignUp;
