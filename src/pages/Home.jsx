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
      <section className="featured-section" style={{ padding: '3rem 0' }}>
        <div className="container">
          <div className="flex-col items-center justify-center text-center" style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', display: 'inline-block' }}>
              Best Selling Products
            </h2>
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
      <section style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '2rem 0', marginTop: '2rem' }}>
        <div className="container">
          <div className="features-grid" style={{ gap: '1rem' }}>
            <div className="feature-card text-center items-center">
              <Truck size={28} style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Free Shipping</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Free shipping on 5+ units.</p>
            </div>
            <div className="feature-card text-center items-center">
              <ShieldCheck size={28} style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>100% Protection</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Full refund if not delivered.</p>
            </div>
            <div className="feature-card text-center items-center">
              <Package size={28} style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>Authentic Products</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>100% genuine sourced.</p>
            </div>
            <div className="feature-card text-center items-center">
              <Clock size={28} style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }} />
              <h3 style={{ fontSize: '0.9rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>24hr Processing</h3>
              <p className="text-muted" style={{ fontSize: '0.8rem' }}>Fast dispatch & tracking.</p>
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
