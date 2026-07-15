import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Package, Truck, ShieldCheck, Star, Minus, Plus, ChevronRight } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const product = products.find(p => p.id === Number(id));
  
  if (!product) {
    return (
      <div className="not-found-container container animate-fade-in">
        <h1>Product not found</h1>
        <Link to="/shop" className="btn btn-primary">← Back to Shop</Link>
      </div>
    );
  }

  // Related products: same category, excluding current
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);
  const otherProducts = related.length < 4 
    ? [...related, ...products.filter(p => p.category !== product.category).slice(0, 4 - related.length)]
    : related;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Determine shipping tier based on quantity
  const getShippingInfo = (qty) => {
    if (qty < 5) return { shipping: `AUD $20`, discount: null };
    if (qty < 7) return { shipping: 'Free Shipping', discount: null };
    if (qty < 11) return { shipping: 'Free Shipping', discount: '5% Off' };
    if (qty < 51) return { shipping: 'Free Shipping', discount: '10% Off' };
    return { shipping: 'Free Shipping', discount: '15% Off' };
  };
  
  const shippingInfo = getShippingInfo(quantity);
  const discountedPrice = shippingInfo.discount 
    ? product.price * (1 - parseInt(shippingInfo.discount) / 100)
    : product.price;
  const totalPrice = discountedPrice * quantity;

  return (
    <div className="product-detail-page animate-fade-in">
      {/* Breadcrumb */}
      <div className="breadcrumb-bar">
        <div className="container">
          <nav className="breadcrumb">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop">Shop</Link>
            <ChevronRight size={14} />
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container" style={{ padding: '3rem 24px' }}>
        {/* Main Product Section */}
        <div className="pd-layout">
          {/* Product Image */}
          <div className="pd-image-section">
            <div className="pd-image-wrapper">
              {product.badge && <span className="pd-badge">{product.badge}</span>}
              <img src={product.image} alt={product.name} className="pd-image" />
            </div>
            {/* Trust badges under image */}
            <div className="pd-trust-badges">
              <div className="trust-item">
                <ShieldCheck size={18} style={{ color: 'var(--success)' }} />
                <span>100% Delivery Protection</span>
              </div>
              <div className="trust-item">
                <Package size={18} style={{ color: 'var(--primary-accent)' }} />
                <span>Authentic Product</span>
              </div>
              <div className="trust-item">
                <Truck size={18} style={{ color: '#60a5fa' }} />
                <span>Australia-Wide Delivery</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="pd-info">
            <p className="pd-brand text-muted text-sm">{product.brand} · {product.category}</p>
            <h1 className="pd-title">{product.name}</h1>

            {/* Star Rating */}
            <div className="pd-rating">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="#f59e0b" stroke="#f59e0b" />
              ))}
              <span className="text-muted text-sm" style={{ marginLeft: '0.5rem' }}>4.8 (Trustpilot)</span>
            </div>

            <div className="pd-puffs-tag">
              <span>💨</span> {product.puffs}
            </div>

            <p className="pd-description">{product.description}</p>

            {/* Price & Quantity */}
            <div className="pd-price-block">
              <div className="pd-price-main">
                <span className="pd-price">
                  ${discountedPrice.toFixed(2)}
                  <span className="pd-currency"> AUD</span>
                </span>
                {shippingInfo.discount && (
                  <span className="pd-original-price">${product.price.toFixed(2)}</span>
                )}
              </div>
              {shippingInfo.discount && (
                <span className="pd-discount-tag">{shippingInfo.discount}</span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="pd-qty-section">
              <label className="pd-label">Quantity</label>
              <div className="pd-qty-controls">
                <button 
                  className="qty-btn" 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  <Minus size={16} />
                </button>
                <span className="qty-value">{quantity}</span>
                <button 
                  className="qty-btn" 
                  onClick={() => setQuantity(q => q + 1)}
                >
                  <Plus size={16} />
                </button>
              </div>
              <span className="text-muted text-sm">
                {quantity < 5 && <span>Buy <strong style={{color:'white'}}>{5 - quantity}</strong> more for free shipping!</span>}
                {quantity >= 5 && quantity < 7 && <span style={{color:'var(--success)'}}>✅ Free Shipping!</span>}
                {quantity >= 7 && quantity < 11 && <span style={{color:'var(--success)'}}>✅ Free Shipping + 5% Off!</span>}
                {quantity >= 11 && quantity < 51 && <span style={{color:'var(--success)'}}>✅ Free Shipping + 10% Off!</span>}
                {quantity >= 51 && <span style={{color:'var(--success)'}}>✅ Free Shipping + 15% Off!</span>}
              </span>
            </div>

            {/* Shipping live preview */}
            <div className="pd-shipping-preview">
              <div className="ship-row">
                <Truck size={16} style={{ color: '#60a5fa', flexShrink: 0 }} />
                <span>Shipping: <strong style={{ color: shippingInfo.shipping === 'Free Shipping' ? 'var(--success)' : 'white' }}>{shippingInfo.shipping}</strong></span>
              </div>
              <div className="ship-row">
                <ShoppingCart size={16} style={{ color: 'var(--primary-accent)', flexShrink: 0 }} />
                <span>Total: <strong style={{ color: 'white' }}>${totalPrice.toFixed(2)} AUD</strong></span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pd-actions">
              <button 
                className={`btn pd-add-btn ${added ? 'added' : 'btn-primary'}`}
                onClick={handleAddToCart}
              >
                {added ? '✓ Added to Cart!' : <><ShoppingCart size={20} /> Add to Cart</>}
              </button>
              <Link to="/checkout" className="btn btn-outline pd-checkout-btn">
                Buy Now
              </Link>
            </div>

            <button className="back-link" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} /> Back
            </button>
          </div>
        </div>

        {/* Related Products */}
        {otherProducts.length > 0 && (
          <section className="pd-related">
            <div className="flex justify-between items-center" style={{ marginBottom: '2rem' }}>
              <h2 className="text-2xl font-display">You May Also Like</h2>
              <Link to="/shop" className="btn btn-outline" style={{ padding: '0.5rem 1.25rem', fontSize: '0.875rem' }}>View All</Link>
            </div>
            <div className="related-grid">
              {otherProducts.map(p => (
                <Link to={`/product/${p.id}`} key={p.id} className="related-card">
                  <div className="related-image-wrap">
                    <img src={p.image} alt={p.name} />
                  </div>
                  <div className="related-info">
                    <p className="text-sm text-muted">{p.category}</p>
                    <p className="related-name">{p.name}</p>
                    <p className="related-price">${p.price.toFixed(2)} AUD</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
