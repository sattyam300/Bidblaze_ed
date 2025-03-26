
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h1 className="text-4xl font-bold mb-6">About BidBlazer</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                BidBlazer is a premier real-time auction monitoring platform that brings together
                internal and external auctions in one seamless experience.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  At BidBlazer, we're passionate about creating the most transparent,
                  efficient, and user-friendly auction platform in the world. We believe in
                  connecting buyers with unique items they love while providing sellers with
                  a global audience for their products.
                </p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our innovative platform combines cutting-edge technology with a user-centered
                  design to make auction participation seamless and enjoyable.
                </p>
              </div>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=1200&h=800" 
                  alt="BidBlazer Team" 
                  className="w-full h-auto"
                />
              </div>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 mb-16">
              <h2 className="text-2xl font-bold mb-6 text-center">Key Features</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-lg mb-3">Real-Time Bidding</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Experience seamless, live auction updates without page refreshes.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-lg mb-3">External Auction Tracking</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Monitor auctions from multiple platforms all in one place.
                  </p>
                </div>
                <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-md">
                  <h3 className="font-bold text-lg mb-3">Secure Transactions</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Safe and reliable payment processing for all transactions.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-6">Ready to Start Bidding?</h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link to="/auctions">Explore Auctions</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/user-signup">Create an Account</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
