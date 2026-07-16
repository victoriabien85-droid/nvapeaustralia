import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';

const Shop = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const searchParam = queryParams.get('search') || '';
  const brandParam = queryParams.get('brand') || '';
  const badgeParam = queryParams.get('badge') || '';

  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...new Set(products.map(p => p.category))];
  
  // Filter products based on category, brandParam, badgeParam, and searchParam
  const filteredProducts = products.filter(product => {
    // 1. Internal Category selector
    if (filter !== 'All' && product.category !== filter) {
      return false;
    }
    // 2. Brand from URL query
    if (brandParam && product.brand.toLowerCase() !== brandParam.toLowerCase()) {
      return false;
    }
    // 3. Badge from URL query
    if (badgeParam && (!product.badge || product.badge.toLowerCase() !== badgeParam.toLowerCase())) {
      return false;
    }
    // 4. Search query
    if (searchParam) {
      const q = searchParam.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCat = product.category.toLowerCase().includes(q);
      const matchDesc = product.description && product.description.toLowerCase().includes(q);
      
      if (!matchName && !matchBrand && !matchCat && !matchDesc) {
        return false;
      }
    }
    return true;
  });

  const clearFilters = () => {
    setFilter('All');
    navigate('/shop');
  };

  return (
    <div className="shop-page container animate-fade-in" style={{ padding: '3rem 24px', minHeight: 'calc(100vh - var(--nav-height))' }}>
      <h1 className="text-4xl font-display mb-2">
        {brandParam ? `${brandParam} Collection` : badgeParam ? `${badgeParam} Deals` : 'Shop All Products'}
      </h1>
      <p className="text-muted mb-8">Browse our complete collection of premium vaping devices.</p>
      
      {/* Active filters summary */}
      {(searchParam || brandParam || badgeParam) && (
        <div 
          className="flex justify-between items-center mb-6" 
          style={{ 
            padding: '0.75rem 1.25rem', 
            backgroundColor: 'var(--bg-secondary)', 
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)' 
          }}
        >
          <span style={{ fontSize: '0.85rem' }}>
            Showing results for:{' '}
            <strong style={{ color: 'white' }}>
              {searchParam && `Search: "${searchParam}"`}
              {brandParam && `Brand: ${brandParam}`}
              {badgeParam && `Deals: ${badgeParam}`}
            </strong>
          </span>
          <button 
            onClick={clearFilters} 
            className="btn btn-outline" 
            style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
          >
            Clear Filters
          </button>
        </div>
      )}

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
      
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }} className="mb-4">No products found matching your criteria.</p>
          <button onClick={clearFilters} className="btn btn-primary">Reset Filters</button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default Shop;
