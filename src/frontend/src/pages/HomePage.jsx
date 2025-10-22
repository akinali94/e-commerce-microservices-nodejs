import React, { useState, useEffect } from 'react';
import ProductCard from '../components/products/ProductCard';
import { productService } from '../services/productService';
import '../styles/global.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">{error}</div>;
  }

  return (
    <div className="home">
      {/* Mobile hero banner for smaller screens */}
      <div className="home-mobile-hero-banner d-lg-none"></div>

      <div className="container-fluid">
        <div className="row">
          {/* Desktop left image for larger screens */}
          {/* <div className="col-4 d-none d-lg-block home-desktop-left-image"></div> */}

          <div className="col-12 col-lg-12 px-10-percent">
            <div className="row hot-products-row px-xl-6">
              <div className="col-12">
                <h3>Hot Products</h3>
              </div>

              {products.map((product, index) => (
                <div key={product.item.id || index} className="col-md-4">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;