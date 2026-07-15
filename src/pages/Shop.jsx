import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Shop = () => {
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  const filteredProducts = filter === 'All' 
    ? products 
    : products.filter(p => p.category === filter);

  return (
    <div className="shop-page container animate-fade-in" style={{ padding: '3rem 24px', minHeight: 'calc(100vh - var(--nav-height))' }}>
      <h1 className="text-4xl font-display mb-2">Shop All Products</h1>
      <p className="text-muted mb-8">Browse our complete collection of premium vaping devices.</p>
      
      <div className="filters flex gap-4 mb-8" style={{ overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            className={`btn ${filter === cat ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFilter(cat)}
            style={{ whiteSpace: 'nowrap' }}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2rem' 
        }}
      >
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
