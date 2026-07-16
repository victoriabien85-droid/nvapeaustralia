import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, ChevronDown, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { products } from '../data/products';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, cartTotal, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isBrandsOpen, setIsBrandsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  const brandsList = [...new Set(products.map(p => p.brand))];

  const checkLoginStatus = () => {
    const email = localStorage.getItem('userEmail');
    setIsLoggedIn(!!email);
    setUserEmail(email || '');
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('auth-change', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('auth-change', checkLoginStatus);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchVal.trim())}`);
      setSearchVal('');
      setIsMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

  return (
    <header className="site-header">
      {/* Top Header Row - White Background */}
      <div className="header-top-row">
        <div className="container flex justify-between items-center header-top-content">
          <div className="header-login-col">
            {isLoggedIn ? (
              <div className="user-logged-in flex items-center gap-2">
                <User size={14} />
                <span className="user-email text-xs hide-mobile">{userEmail}</span>
                <Link to="/my-account" className="login-link text-xs font-bold">My Account</Link>
                <span className="text-muted">|</span>
                <button onClick={handleLogout} className="login-link text-xs">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="login-link text-xs">Login</Link>
            )}
          </div>

          <div className="header-logo-col">
            <Link to="/" className="header-logo-link">
              <img src="/assets/logo.png" alt="CNVAPES AUSTRALIA" className="site-logo" />
            </Link>
          </div>

          <div className="header-search-col">
            <form onSubmit={handleSearch} className="search-form flex">
              <input
                type="text"
                placeholder="Search..."
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                className="search-input"
              />
              <button type="submit" className="search-btn">
                <Search size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Header Row - Red Background */}
      <nav className="navbar-bottom-row">
        <div className="container flex justify-between items-center navbar-content">
          <div className="flex items-center">
            {/* Mobile Menu Button toggles bottom row nav links */}
            <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            
            <ul className={`nav-links flex items-center gap-6 ${isMenuOpen ? 'open' : ''}`}>
              <li>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
              </li>
              <li>
                <Link to="/shop?badge=Hot" onClick={() => setIsMenuOpen(false)}>Hot Sales</Link>
              </li>
              <li 
                className="brands-dropdown-container"
                onMouseEnter={() => setIsBrandsOpen(true)}
                onMouseLeave={() => setIsBrandsOpen(false)}
              >
                <button 
                  className="brands-dropdown-trigger flex items-center gap-1"
                  onClick={() => setIsBrandsOpen(!isBrandsOpen)}
                >
                  Brands <ChevronDown size={14} />
                </button>
                <ul className={`brands-dropdown ${isBrandsOpen ? 'show' : ''}`}>
                  {brandsList.map(brand => (
                    <li key={brand}>
                      <Link 
                        to={`/shop?brand=${encodeURIComponent(brand)}`}
                        onClick={() => {
                          setIsBrandsOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        {brand}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li>
                <Link to="/shopping-guide" onClick={() => setIsMenuOpen(false)}>Shipping & FAQ</Link>
              </li>
              <li>
                <Link to="/track-order" onClick={() => setIsMenuOpen(false)}>Track Order</Link>
              </li>
              <li>
                <Link to={isLoggedIn ? "/my-account" : "/login"} onClick={() => setIsMenuOpen(false)}>My account</Link>
              </li>
            </ul>
          </div>

          <div className="flex items-center">
            <button className="cart-total-btn flex items-center gap-2" onClick={toggleCart}>
              <ShoppingCart size={18} />
              <span className="cart-text hide-mobile">Cart /</span>
              <span className="cart-amount">AUD ${cartTotal.toFixed(2)}</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
