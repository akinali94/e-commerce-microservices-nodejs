import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { renderMoney } from '../utils/moneyUtils';
import ProductQuantitySelector from '../components/products/ProductQuantitySelector';
import RecommendationList from '../components/recommendations/RecommendationList';
import TextAd from '../components/ads/TextAd';
import '../styles/global.css';

const ProductPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ad, setAd] = useState(null);
  const [packagingInfo, setPackagingInfo] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        
        // Fetch product details
        const productData = await productService.getProduct(id);
        setProduct(productData);
        
        // Fetch recommendations
        const recommendationsData = await productService.getRecommendations([id]);
        setRecommendations(recommendationsData);
        
        // For demo purposes, create a sample ad
        // In real implementation, this would come from an ad service
        setAd({
          redirectUrl: '/',
          text: 'Check out our latest collection of products!'
        });
        
        // For demo purposes, create sample packaging info
        // In real implementation, this would come from packaging service
        setPackagingInfo({
          weight: 1.2,
          width: 10.5,
          height: 12.0,
          depth: 3.2
        });
        
        setError(null);
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProductData();
    }
  }, [id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    
    if (!product) return;
    
    try {
      await addToCart(product.item.id, quantity);
      // Show success notification
      alert('Product added to cart!'); // Replace with nicer notification
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading product details...</div>;
  }

  if (error || !product) {
    return <div className="text-center py-5 text-danger">{error || 'Product not found'}</div>;
  }

  return (
    <div>
      <div className="h-product container">
        <div className="row">
          <div className="col-md-6">
            <img 
              className="product-image" 
              alt={product.item.name} 
              src={product.item.picture} 
            />
          </div>
          <div className="product-info col-md-5">
            <div className="product-wrapper">
              <h2>{product.item.name}</h2>
              <p className="product-price">{renderMoney(product.price)}</p>
              <p>{product.item.description}</p>
              
              {packagingInfo && (
                <div className="product-packaging">
                  <h3>Packaging</h3>
                  <span>
                    Weight: {packagingInfo.weight ? `${packagingInfo.weight}lb` : 'n/a'}
                  </span>
                  <span>
                    Width: {packagingInfo.width ? `${packagingInfo.width}cm` : 'n/a'}
                  </span>
                  <span>
                    Height: {packagingInfo.height ? `${packagingInfo.height}cm` : 'n/a'}
                  </span>
                  <span>
                    Depth: {packagingInfo.depth ? `${packagingInfo.depth}cm` : 'n/a'}
                  </span>
                </div>
              )}
              
              <form onSubmit={handleAddToCart}>
                <input type="hidden" name="product_id" value={product.item.id} />
                <ProductQuantitySelector 
                  value={quantity} 
                  onChange={(value) => setQuantity(value)} 
                />
                <button type="submit" className="cymbal-button-primary">
                  Add To Cart
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      
      {recommendations.length > 0 && (
        <RecommendationList recommendations={recommendations} />
      )}
      
      <div className="ad">
        {ad && <TextAd ad={ad} />}
      </div>
    </div>
  );
};

export default ProductPage;