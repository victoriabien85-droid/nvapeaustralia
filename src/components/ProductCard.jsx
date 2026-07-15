import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <div className="product-card group">
      <Link to={`/product/${product.id}`} className="product-image-container">
        <img src={product.image} alt={product.name} className="product-image" />
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <div className="product-overlay">
          <span className="quick-view-hint">Quick View</span>
        </div>
      </Link>
      <div className="product-info">
        <div className="product-category text-sm text-muted">{product.category} · {product.puffs}</div>
        <Link to={`/product/${product.id}`}>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="product-footer">
          <div className="product-price">${product.price.toFixed(2)} AUD</div>
          <button 
            className="btn btn-primary add-to-cart-btn"
            onClick={() => addToCart(product)}
          >
            <ShoppingCart size={16} /> Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
