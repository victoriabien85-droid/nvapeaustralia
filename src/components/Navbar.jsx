import React from 'react';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { cartCount, toggleCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center navbar-content">
        <div className="flex items-center gap-4">
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Link to="/" className="brand">
            <span className="brand-text">VAPE<span className="text-accent">AU</span></span>
          </Link>
        </div>

        <ul className={`nav-links flex items-center gap-8 ${isMenuOpen ? 'open' : ''}`}>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/shop">Shop</Link></li>
          <li><Link to="/shopping-guide">Shopping Guide</Link></li>
        </ul>

        <div className="flex items-center gap-6">
          <button className="icon-btn hide-mobile">
            <Search size={20} />
          </button>
          <button className="icon-btn cart-btn" onClick={toggleCart}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
