import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from './components/ProductCard';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get('http://localhost:5000/api/search');
        
        if (response.data.success) {
          setProducts(response.data.items);
        } else {
          setError('Failed to fetch products');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.error || 'Failed to fetch products from server');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>eBay Product Search</h1>
        </header>
        <main className="app-main">
          <div className="loading">Loading products...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>eBay Product Search</h1>
        </header>
        <main className="app-main">
          <div className="error">
            <h2>Error</h2>
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>eBay Product Search</h1>
        <p>Found {products.length} products</p>
      </header>
      <main className="app-main">
        <div className="products-grid">
          {products.map((item, index) => (
            <ProductCard key={item.itemId || index} item={item} />
          ))}
        </div>
        {products.length === 0 && (
          <div className="no-products">
            <p>No products found</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
