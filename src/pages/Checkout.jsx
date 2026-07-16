import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  Building2, Smartphone, CreditCard,
  ChevronRight, ShieldCheck, Copy, CheckCheck,
  Truck, Package, MessageCircle
} from 'lucide-react';
import './Checkout.css';

/* ─── Config ─────────────────────────────────────────────────── */
const WHATSAPP_NUMBER = '61410736059'; // Australian number without +

const BANK_DETAILS = {
  accountName: 'CnvapesAustralia Pty Ltd',
  bsb: '062-000',
  accountNumber: '1234 5678',
  bank: 'Commonwealth Bank of Australia',
};

const PAYID_DETAILS = {
  payid: 'payments@cnvapesaustralia.com.au',
  type: 'Email PayID',
  name: 'CnvapesAustralia Pty Ltd',
};

const PAYMENT_METHODS = [
  {
    id: 'bank',
    icon: Building2,
    label: 'Bank Transfer',
    sub: 'Direct bank deposit — confirm via WhatsApp',
    color: '#60a5fa',
  },
  {
    id: 'payid',
    icon: Smartphone,
    label: 'PayID',
    sub: 'Instant PayID transfer — confirm via WhatsApp',
    color: '#34d399',
  },
  {
    id: 'card',
    icon: CreditCard,
    label: 'Credit / Debit Card',
    sub: 'Visa, Mastercard, Amex',
    color: '#a78bfa',
  },
];

/* ─── Copy button ─────────────────────────────────────────────── */
const CopyBtn = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button className="copy-btn" onClick={handle} title="Copy">
      {copied
        ? <CheckCheck size={15} style={{ color: 'var(--success)' }} />
        : <Copy size={15} />}
    </button>
  );
};

/* ─── Build WhatsApp URL with pre-filled message ─────────────── */
const buildWhatsAppUrl = ({ form, cartItems, grandTotal, shippingFee, payMethod }) => {
  const itemLines = cartItems
    .map(i => `  • ${i.name} × ${i.quantity} = $${(i.price * i.quantity).toFixed(2)} AUD`)
    .join('\n');

  const paymentSection =
    payMethod === 'bank'
      ? `💳 Payment: Bank Transfer\n  Bank: ${BANK_DETAILS.bank}\n  BSB: ${BANK_DETAILS.bsb}\n  Account: ${BANK_DETAILS.accountNumber}`
      : `💳 Payment: PayID\n  PayID: ${PAYID_DETAILS.payid}`;

  const message =
    `Hi CnvapesAustralia! 👋 I'd like to place an order.\n\n` +
    `📦 ORDER DETAILS\n${itemLines}\n\n` +
    `🚚 Shipping: ${shippingFee === 0 ? 'Free' : `AUD $${shippingFee.toFixed(2)}`}\n` +
    `💰 Total: $${grandTotal.toFixed(2)} AUD\n\n` +
    `${paymentSection}\n\n` +
    `📬 DELIVERY ADDRESS\n` +
    `  ${form.firstName} ${form.lastName}\n` +
    `  ${form.address}, ${form.city} ${form.state} ${form.postcode}\n` +
    `  📧 ${form.email}${form.phone ? `\n  📞 ${form.phone}` : ''}\n\n` +
    `Please confirm payment details. Thank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/* ─── Card payment confirmation screen ───────────────────────── */
const CardConfirmation = ({ grandTotal, onDone }) => (
  <div className="confirmation-screen animate-fade-in">
    <div className="conf-icon">✅</div>
    <h1 className="conf-title">Order Placed!</h1>
    <p className="conf-subtitle">
      Your card payment of <strong>${grandTotal.toFixed(2)} AUD</strong> was processed successfully.
      You'll receive a receipt and tracking info by email within 24 hours.
    </p>
    <div className="conf-next-steps">
      <div className="next-step"><Package size={20} style={{ color: 'var(--primary-accent)' }} /> We'll pack and photograph your order</div>
      <div className="next-step"><Truck size={20} style={{ color: '#60a5fa' }} /> Tracking info sent within 24 hrs</div>
      <div className="next-step"><ShieldCheck size={20} style={{ color: 'var(--success)' }} /> 100% Delivery Protection guaranteed</div>
    </div>
    <div className="conf-contact">📞 Questions? Call us: <strong>+61 410 736 059</strong></div>
    <button className="btn btn-primary conf-done-btn" onClick={onDone}>Continue Shopping</button>
  </div>
);

/* ─── Main Checkout ───────────────────────────────────────────── */
const Checkout = () => {
  const { cartItems, cartTotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState('bank');
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardDone, setCardDone] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    phone: '', address: '', city: '', state: '', postcode: '',
    cardNumber: '', cardExpiry: '', cardCvc: '', cardName: '',
  });
  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }));

  const totalQty = cartItems.reduce((s, i) => s + i.quantity, 0);
  const shippingFee = totalQty >= 5 ? 0 : 20;
  const grandTotal = cartTotal + shippingFee;

  /* ── WhatsApp redirect ─────────────────────────────── */
  const openWhatsApp = () => {
    const url = buildWhatsAppUrl({ form, cartItems, grandTotal, shippingFee, payMethod });
    window.open(url, '_blank');
  };

  /* ── Card submit ───────────────────────────────────── */
  const handleCardSubmit = e => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      setCardDone(true);
    }, 1500);
  };

  /* ── Empty cart ────────────────────────────────────── */
  if (cartItems.length === 0 && !cardDone) {
    return (
      <div className="container flex flex-col items-center justify-center" style={{ minHeight: '60vh', gap: '1.5rem' }}>
        <div style={{ fontSize: '4rem' }}>🛒</div>
        <h2 className="text-2xl font-display">Your cart is empty</h2>
        <p className="text-muted">Add some products before checking out.</p>
        <Link to="/shop" className="btn btn-primary">Browse Products</Link>
      </div>
    );
  }

  /* ── Card confirmation ─────────────────────────────── */
  if (cardDone) {
    return (
      <div className="container" style={{ padding: '3rem 24px' }}>
        <CardConfirmation grandTotal={grandTotal} onDone={() => navigate('/')} />
      </div>
    );
  }

  return (
    <div className="checkout-page animate-fade-in" style={{ padding: '3rem 0' }}>
      <div className="container">
        <h1 className="text-4xl font-display" style={{ marginBottom: '0.5rem' }}>Checkout</h1>
        <p className="text-muted" style={{ marginBottom: '2.5rem' }}>
          {cartCount} item{cartCount !== 1 ? 's' : ''} in your cart
        </p>

        {/* Step progress */}
        <div className="checkout-steps">
          {['Shipping', 'Payment'].map((s, i) => (
            <React.Fragment key={s}>
              <div className={`step-pill ${step > i ? 'done' : step === i + 1 ? 'active' : ''}`}>
                <span className="step-num">{step > i + 1 ? '✓' : i + 1}</span>
                <span className="step-label">{s}</span>
              </div>
              {i < 1 && <div className={`step-connector ${step > i + 1 ? 'done' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="checkout-layout">
          {/* ── Left ── */}
          <div className="checkout-left">

            {/* STEP 1 — Shipping */}
            {step === 1 && (
              <form className="checkout-card animate-fade-in" onSubmit={e => { e.preventDefault(); setStep(2); }}>
                <h2 className="section-title">📦 Shipping Details</h2>
                <div className="form-row">
                  <div className="form-group">
                    <label>First Name *</label>
                    <input className="input" required value={form.firstName} onChange={set('firstName')} placeholder="John" />
                  </div>
                  <div className="form-group">
                    <label>Last Name *</label>
                    <input className="input" required value={form.lastName} onChange={set('lastName')} placeholder="Smith" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input className="input" type="email" required value={form.email} onChange={set('email')} placeholder="john@email.com" />
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input className="input" type="tel" value={form.phone} onChange={set('phone')} placeholder="+61 400 000 000" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Street Address *</label>
                  <input className="input" required value={form.address} onChange={set('address')} placeholder="123 Main Street, Unit 4" />
                </div>
                <div className="form-row three">
                  <div className="form-group">
                    <label>City *</label>
                    <input className="input" required value={form.city} onChange={set('city')} placeholder="Sydney" />
                  </div>
                  <div className="form-group">
                    <label>State *</label>
                    <select className="input" required value={form.state} onChange={set('state')}>
                      <option value="">State</option>
                      {['NSW','VIC','QLD','WA','SA','TAS','ACT','NT'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Postcode *</label>
                    <input className="input" required value={form.postcode} onChange={set('postcode')} placeholder="2000" maxLength={4} />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary next-btn">
                  Continue to Payment <ChevronRight size={18} />
                </button>
              </form>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <div className="checkout-card animate-fade-in">
                <button type="button" className="back-link" onClick={() => setStep(1)}>
                  ← Back to Shipping
                </button>
                <h2 className="section-title">💳 Choose Payment Method</h2>

                {/* Method selector */}
                <div className="method-grid">
                  {PAYMENT_METHODS.map(m => {
                    const Icon = m.icon;
                    return (
                      <button
                        type="button"
                        key={m.id}
                        className={`method-card ${payMethod === m.id ? 'selected' : ''}`}
                        onClick={() => setPayMethod(m.id)}
                      >
                        <Icon size={26} style={{ color: payMethod === m.id ? m.color : undefined }} />
                        <span className="method-label">{m.label}</span>
                        <span className="method-sub">{m.sub}</span>
                        <div className="method-radio" />
                      </button>
                    );
                  })}
                </div>

                {/* ── BANK TRANSFER ── */}
                {payMethod === 'bank' && (
                  <div className="payment-info-box animate-fade-in">
                    <p className="pay-info-title">🏦 Bank Transfer</p>
                    <p className="pay-info-note" style={{ fontSize: '1rem', color: 'white', lineHeight: 1.6, marginBottom: '1rem' }}>
                      We support Credit Card, Apple Pay, Google Pay, PayID, and Bank Transfer.<br/><br/>
                      For PayID or Bank Transfer, please contact our customer representative for payment account details.
                    </p>
                    
                    <button className="whatsapp-cta" onClick={openWhatsApp}>
                      <MessageCircle size={22} />
                      Contact us on WhatsApp
                    </button>
                    <p className="whatsapp-note" style={{ marginTop: '0.75rem' }}>
                      Click the button above to send your order details via WhatsApp and receive our bank account information.
                    </p>
                  </div>
                )}

                {/* ── PAYID ── */}
                {payMethod === 'payid' && (
                  <div className="payment-info-box animate-fade-in">
                    <p className="pay-info-title">📱 PayID</p>
                    <p className="pay-info-note" style={{ fontSize: '1rem', color: 'white', lineHeight: 1.6, marginBottom: '1rem' }}>
                      We support Credit Card, Apple Pay, Google Pay, PayID, and Bank Transfer.<br/><br/>
                      For PayID or Bank Transfer, please contact our customer representative for payment account details.
                    </p>
                    
                    <button className="whatsapp-cta" onClick={openWhatsApp}>
                      <MessageCircle size={22} />
                      Contact us on WhatsApp
                    </button>
                    <p className="whatsapp-note" style={{ marginTop: '0.75rem' }}>
                      Click the button above to send your order details via WhatsApp and receive our PayID information.
                    </p>
                  </div>
                )}

                {/* ── CARD ── */}
                {payMethod === 'card' && (
                  <form className="payment-info-box animate-fade-in" onSubmit={handleCardSubmit}>
                    <p className="pay-info-title">💳 Card Details</p>
                    <div className="form-group">
                      <label>Name on Card *</label>
                      <input className="input" required value={form.cardName} onChange={set('cardName')} placeholder="John Smith" />
                    </div>
                    <div className="form-group" style={{ marginTop: '0.75rem' }}>
                      <label>Card Number *</label>
                      <input className="input" required value={form.cardNumber} onChange={set('cardNumber')} placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div className="form-row" style={{ marginTop: '0.75rem' }}>
                      <div className="form-group">
                        <label>Expiry *</label>
                        <input className="input" required value={form.cardExpiry} onChange={set('cardExpiry')} placeholder="MM/YY" maxLength={5} />
                      </div>
                      <div className="form-group">
                        <label>CVC *</label>
                        <input className="input" required value={form.cardCvc} onChange={set('cardCvc')} placeholder="123" maxLength={4} />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="btn btn-primary next-btn"
                      style={{ marginTop: '0.5rem' }}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Processing…' : `Pay $${grandTotal.toFixed(2)} AUD`}
                    </button>
                    <p className="secure-note">
                      <ShieldCheck size={14} /> Secure checkout · 100% Delivery Protection
                    </p>
                  </form>
                )}
              </div>
            )}
          </div>

          {/* ── Order Summary ── */}
          <div className="order-summary-panel">
            <h2 className="section-title">🧾 Order Summary</h2>
            <div className="summary-items">
              {cartItems.map(item => (
                <div key={item.id} className="summary-item">
                  <div className="summary-img">
                    <img src={item.image} alt={item.name} />
                    <span className="summary-qty-badge">{item.quantity}</span>
                  </div>
                  <div className="summary-item-info">
                    <p className="summary-item-name">{item.name}</p>
                    <p className="text-sm text-muted">{item.puffs}</p>
                  </div>
                  <span className="summary-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="summary-line">
              <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="summary-line">
              <span>Shipping</span>
              <span className={shippingFee === 0 ? 'text-success' : ''}>
                {shippingFee === 0 ? '✅ Free' : `AUD $${shippingFee.toFixed(2)}`}
              </span>
            </div>
            {shippingFee > 0 && (
              <p className="ship-note">
                Add {5 - totalQty} more item{5 - totalQty !== 1 ? 's' : ''} for free shipping!
              </p>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span>${grandTotal.toFixed(2)} AUD</span>
            </div>
            <div className="summary-trust">
              <div className="trust-row"><ShieldCheck size={15} style={{ color: 'var(--success)' }} /> 100% Delivery Protection</div>
              <div className="trust-row"><Truck size={15} style={{ color: '#60a5fa' }} /> Australia-wide delivery</div>
              <div className="trust-row"><Package size={15} style={{ color: 'var(--primary-accent)' }} /> Authentic products</div>
            </div>

            {/* WhatsApp quick contact */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="whatsapp-cta"
              style={{ fontSize: '0.875rem', padding: '0.75rem 1rem' }}
            >
              <MessageCircle size={18} /> Chat with us on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
