import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Cart from './components/Cart';
import FloatingWidgets from './components/FloatingWidgets';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import ShoppingGuide from './pages/ShoppingGuide';
import ProductDetail from './pages/ProductDetail';
import TrackOrder from './pages/TrackOrder';
import Login from './pages/Login';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app flex flex-col min-h-screen">
          <Navbar />
          <Cart />
          <FloatingWidgets />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/shopping-guide" element={<ShoppingGuide />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/login" element={<Login />} />
              <Route path="/my-account" element={<Login />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
