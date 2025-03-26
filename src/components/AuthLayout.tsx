
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footer: {
    text: string;
    linkText: string;
    linkTo: string;
  };
  userType: "user" | "seller";
  isLogin?: boolean;
}

const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  footer, 
  userType, 
  isLogin = true 
}: AuthLayoutProps) => {
  const otherUserType = userType === "user" ? "seller" : "user";
  const otherUserTypeLabel = userType === "user" ? "Seller" : "User";
  const otherAuthPath = isLogin 
    ? `/${otherUserType}-signin` 
    : `/${otherUserType}-signup`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Link
        to="/"
        className="absolute top-6 left-6 text-gray-600 hover:text-primary dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
      >
        ← Back to Home
      </Link>
      
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center justify-center gap-2 mb-4 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-blue-500 flex items-center justify-center animate-pulse-light">
              <span className="text-white font-bold text-xl">B</span>
            </div>
            <span className="font-semibold text-xl tracking-tight">
              <span className="text-primary">Bid</span>
              <span className="text-gray-800 dark:text-gray-200">Blaze</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">{subtitle}</p>
        </div>
        
        {children}
        
        <div className="pt-4 text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">{footer.text}</span>{" "}
          <Link to={footer.linkTo} className="text-primary hover:underline font-medium">
            {footer.linkText}
          </Link>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 mt-6 text-center">
          <span className="text-gray-600 dark:text-gray-400 text-sm">
            {isLogin ? "Sign in" : "Sign up"} as a{" "}
          </span>
          <Link 
            to={otherAuthPath} 
            className="text-primary hover:underline font-medium text-sm"
          >
            {otherUserTypeLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
