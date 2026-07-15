import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h2 className="brand font-display text-2xl mb-4">VAPE<span className="text-accent">AU</span></h2>
            <p className="text-muted mb-4">
              Australia's premium destination for next-generation vaping devices, e-liquids, and accessories.
            </p>
          </div>
          
          <div className="footer-links">
            <h3 className="font-display text-lg mb-4">Shop</h3>
            <ul>
              <li><Link to="/shop">All Products</Link></li>
              <li><Link to="/shop">IGET Bar Plus</Link></li>
              <li><Link to="/shop">Geek Bar</Link></li>
              <li><Link to="/shop">Elf Bar</Link></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h3 className="font-display text-lg mb-4">Help</h3>
            <ul>
              <li><Link to="/shopping-guide">Shopping Guide</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
            </ul>
          </div>
          
          <div className="footer-newsletter">
            <h3 className="font-display text-lg mb-4">Newsletter</h3>
            <p className="text-muted mb-4">Subscribe to get special offers, free giveaways, and deals.</p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" className="input" />
              <button type="submit" className="btn btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
        
        <div className="footer-bottom flex justify-between items-center text-sm text-muted mt-8 pt-8 border-t">
          <p>&copy; {new Date().getFullYear()} CnvapesAustralia. Powered by Cnvapes | China Vape Source.</p>
          <div className="payment-methods flex gap-2">
            <span>Visa</span>
            <span>Mastercard</span>
            <span>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
