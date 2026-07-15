import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const { 
    isCartOpen, 
    toggleCart, 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    cartTotal 
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div className="cart-overlay" onClick={toggleCart}></div>
      <div className="cart-sidebar">
        <div className="cart-header flex justify-between items-center">
          <h2>Your Cart</h2>
          <button className="icon-btn" onClick={toggleCart}>
            <X size={24} />
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart flex flex-col items-center justify-center">
              <p className="text-muted mb-4">Your cart is empty.</p>
              <button className="btn btn-primary" onClick={toggleCart}>
                Continue Shopping
              </button>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="cart-item flex gap-4 items-center">
                <div className="cart-item-img">
                  <img src={item.image} alt={item.name} />
                </div>
                <div className="cart-item-details flex-grow">
                  <h4 className="text-sm font-bold">{item.name}</h4>
                  <p className="text-accent font-bold">${item.price.toFixed(2)}</p>
                  
                  <div className="cart-item-actions flex items-center justify-between mt-2">
                    <div className="qty-controls flex items-center">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total flex justify-between items-center">
              <span className="font-bold">Subtotal</span>
              <span className="font-bold text-xl">${cartTotal.toFixed(2)}</span>
            </div>
            <p className="text-sm text-muted mb-4">Taxes and shipping calculated at checkout</p>
            <Link 
              to="/checkout" 
              className="btn btn-primary w-full"
              onClick={toggleCart}
            >
              Proceed to Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
