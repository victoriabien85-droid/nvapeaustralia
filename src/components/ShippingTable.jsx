import React from 'react';
import './ShippingTable.css';

const tiers = [
  { qty: '4 pcs', shipping: 'AUD $20', discount: 'Base Price' },
  { qty: '5–6 pcs', shipping: 'Free Shipping', discount: 'Base Price', highlight: true },
  { qty: '7–10 pcs', shipping: 'Free Shipping', discount: '5% Off', highlight: true },
  { qty: '11–50 pcs', shipping: 'Free Shipping', discount: '10% Off', highlight: true },
  { qty: '51+ pcs', shipping: 'Free Shipping', discount: '15% Off', highlight: true },
];

const ShippingTable = () => (
  <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-tertiary)' }}>
    <div className="container">
      <div className="text-center" style={{ marginBottom: '2.5rem' }}>
        <p className="text-sm text-accent font-bold" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Pricing & Shipping</p>
        <h2 className="text-3xl font-display" style={{ marginBottom: '1rem' }}>The More You Buy, The Less You Pay</h2>
        <p className="text-muted">Shipping fees and quantity discounts are automatically calculated at checkout.</p>
      </div>
      
      <div className="shipping-table-wrapper">
        <table className="shipping-table">
          <thead>
            <tr>
              <th>Quantity</th>
              <th>Shipping</th>
              <th>Discount</th>
            </tr>
          </thead>
          <tbody>
            {tiers.map((tier, i) => (
              <tr key={i} className={tier.highlight ? 'highlighted' : ''}>
                <td><span className="qty-badge">{tier.qty}</span></td>
                <td>
                  {tier.shipping === 'Free Shipping'
                    ? <span className="free-ship">✓ Free Shipping</span>
                    : tier.shipping}
                </td>
                <td>
                  {tier.discount !== 'Base Price'
                    ? <span className="discount-badge">{tier.discount}</span>
                    : <span className="text-muted">Base Price</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="shield-banner flex items-center justify-center gap-4" style={{ marginTop: '2.5rem', padding: '1.5rem', background: 'rgba(196,0,0,0.08)', border: '1px solid rgba(196,0,0,0.3)', borderRadius: 'var(--radius-lg)' }}>
        <span style={{ fontSize: '2rem' }}>🛡️</span>
        <div>
          <h3 className="font-bold text-lg" style={{ marginBottom: '0.25rem' }}>100% Delivery Protection</h3>
          <p className="text-sm text-muted">Every order is covered. If your order is not delivered for any reason — including customs issues — we will provide a full refund.</p>
        </div>
      </div>
    </div>
  </section>
);

export default ShippingTable;
