
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LiveAuctions from "@/components/LiveAuctions";
import Categories from "@/components/Categories";
import FeaturesSection from "@/components/FeaturesSection";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import axios from "axios";

const Index = () => {
  const [ebayItems, setEbayItems] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEbay = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching eBay items from API...');
        const res = await axios.get("http://localhost:5050/api/search", {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        console.log('eBay API response:', res.data);
        setEbayItems(res.data?.items || []);
      } catch (err: any) {
        console.error('Error fetching eBay items:', err);
        // Log more detailed error information
        if (err.response) {
          console.error('Error response data:', err.response.data);
          console.error('Error response status:', err.response.status);
        } else if (err.request) {
          console.error('Error request:', err.request);
        } else {
          console.error('Error message:', err.message);
        }
        setError(err?.response?.data?.error || "Failed to load eBay items");
      } finally {
        setLoading(false);
      }
    };
    fetchEbay();
  }, []);
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <HeroSection />
        <LiveAuctions />
        {/* eBay products section */}
        <section className="py-10">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">eBay Picks</h2>
            {loading && (
              <p className="text-gray-500">Loading eBay products...</p>
            )}
            {error && (
              <p className="text-red-600">{error}</p>
            )}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {ebayItems.slice(0, 8).map((item, idx) => (
                  <div key={item.itemId || idx} className="bg-white rounded-lg shadow hover:shadow-lg transition p-4">
                    <div className="aspect-[4/3] bg-gray-100 rounded overflow-hidden mb-3">
                      <img src={item.image?.imageUrl || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="font-semibold text-sm line-clamp-2 mb-2">{item.title}</h3>
                    <p className="text-green-700 font-bold">
                      {item.price?.value} {item.price?.currency}
                    </p>
                  </div>
                ))}
                {ebayItems.length === 0 && (
                  <p className="text-gray-500">No eBay items found.</p>
                )}
              </div>
            )}
          </div>
        </section>
        <Categories />
        <FeaturesSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
