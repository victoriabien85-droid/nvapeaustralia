import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import Reviews from '../components/Reviews';
import ShippingTable from '../components/ShippingTable';
import { products } from '../data/products';
import { Truck, ShieldCheck, Clock, Package } from 'lucide-react';

const Home = () => {
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="home-page animate-fade-in">

      {/* Hero Banner */}
      <Hero />

      {/* Featured Products */}
      <section className="featured-section" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="flex justify-between items-end" style={{ marginBottom: '2.5rem' }}>
            <div>
              <p className="text-sm text-accent font-bold" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>🔥 Most Popular</p>
              <h2 className="text-3xl font-display" style={{ lineHeight: 1.2 }}>Best Selling Products</h2>
              <p className="text-muted" style={{ marginTop: '0.5rem' }}>Real products, real prices — direct from our store.</p>
            </div>
            <Link to="/shop" className="btn btn-outline hide-mobile">View All</Link>
          </div>
          
          <div className="products-grid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="flex justify-center" style={{ marginTop: '2.5rem' }}>
            <Link to="/shop" className="btn btn-primary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* Delivery Promise Banner */}
      <section style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '3rem 0' }}>
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <Truck size={36} style={{ color: 'var(--primary-accent)', marginBottom: '1rem' }} />
              <h3 className="font-bold text-lg" style={{ marginBottom: '0.5rem' }}>Free Shipping</h3>
              <p className="text-muted text-sm">Free shipping on 5+ units. The more you buy, the lower your cost.</p>
            </div>
            <div className="feature-card">
              <ShieldCheck size={36} style={{ color: 'var(--primary-accent)', marginBottom: '1rem' }} />
              <h3 className="font-bold text-lg" style={{ marginBottom: '0.5rem' }}>100% Delivery Protection</h3>
              <p className="text-muted text-sm">Every order is covered. If not delivered for any reason, we provide a full refund.</p>
            </div>
            <div className="feature-card">
              <Package size={36} style={{ color: 'var(--primary-accent)', marginBottom: '1rem' }} />
              <h3 className="font-bold text-lg" style={{ marginBottom: '0.5rem' }}>Authentic Products</h3>
              <p className="text-muted text-sm">100% genuine products sourced directly from the Cnvapes supply chain.</p>
            </div>
            <div className="feature-card">
              <Clock size={36} style={{ color: 'var(--primary-accent)', marginBottom: '1rem' }} />
              <h3 className="font-bold text-lg" style={{ marginBottom: '0.5rem' }}>24hr Processing</h3>
              <p className="text-muted text-sm">Orders processed within 24 hours. Real-time tracking available on your account.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Shipping Table */}
      <ShippingTable />

      {/* Customer Reviews */}
      <Reviews />

    </div>
  );
};

export default Home;
