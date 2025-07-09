
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";

export const AuthButtons = () => {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" className="rounded-full">
            Sign In
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col h-full">
            <div className="flex-grow flex flex-col items-center justify-center space-y-6 py-8">
              <h3 className="text-2xl font-bold">Choose Account Type</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center px-4">
                Select the account type you want to sign in with
              </p>
              
              <div className="grid grid-cols-1 gap-4 w-full px-4">
                <SheetClose asChild>
                  <Button asChild size="lg" className="w-full">
                    <Link to="/user-signin">Sign In as User</Link>
                  </Button>
                </SheetClose>
                
                <SheetClose asChild>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link to="/seller-signin">Sign In as Seller</Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      <Sheet>
        <SheetTrigger asChild>
          <Button className="rounded-full">
            Sign Up
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[300px] sm:w-[400px]">
          <div className="flex flex-col h-full">
            <div className="flex-grow flex flex-col items-center justify-center space-y-6 py-8">
              <h3 className="text-2xl font-bold">Create Account</h3>
              <p className="text-gray-600 dark:text-gray-400 text-center px-4">
                Choose the type of account you want to create
              </p>
              
              <div className="grid grid-cols-1 gap-4 w-full px-4">
                <SheetClose asChild>
                  <Button asChild size="lg" className="w-full">
                    <Link to="/user-signup">Register as User</Link>
                  </Button>
                </SheetClose>
                
                <SheetClose asChild>
                  <Button asChild variant="outline" size="lg" className="w-full">
                    <Link to="/seller-signup">Register as Seller</Link>
                  </Button>
                </SheetClose>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};
