import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img src="/assets/CnvapesAustralia-Social-Banner1.png" alt="CnvapesAustralia" />
        <div className="hero-overlay"></div>
      </div>
      
      <div className="container hero-content flex flex-col justify-center items-center text-center">
        <p className="hero-tag animate-slide-up">Australia-Wide Delivery</p>
        <h1 className="hero-title animate-slide-up">
          Authentic Vapes. <span className="text-accent">Real Prices.</span>
        </h1>
        <p className="hero-subtitle animate-slide-up" style={{ animationDelay: '0.1s' }}>
          CnvapesAustralia offers authentic vape products, retail orders, bulk inquiry support, and door-to-door delivery across Australia — backed by the Cnvapes supply chain.
        </p>
        <div className="hero-actions animate-slide-up flex gap-4" style={{ animationDelay: '0.2s' }}>
          <Link to="/shop" className="btn btn-primary" style={{ fontSize: '1.0625rem', padding: '0.875rem 2rem' }}>Shop Now</Link>
          <Link to="/shopping-guide" className="btn btn-outline" style={{ fontSize: '1.0625rem', padding: '0.875rem 2rem' }}>Shopping Guide</Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
