import React from 'react';

const ShoppingGuide = () => (
  <div className="container animate-fade-in" style={{ padding: '3rem 24px', maxWidth: 860, minHeight: 'calc(100vh - 70px)' }}>
    <div style={{ marginBottom: '2rem' }}>
      <p className="text-sm text-accent font-bold" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>CnvapesAustralia</p>
      <h1 className="font-display" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>Shopping Guide</h1>
      <p className="text-muted text-lg">Everything you need to know before placing your order.</p>
    </div>
    <hr style={{ borderColor: 'var(--border-color)', marginBottom: '2.5rem' }} />

    {[
      {
        title: "About CnvapesAustralia",
        content: "CnvapesAustralia is the Australia retail service site powered by Cnvapes | China Vape Source. Cnvapes has nearly 10 years of experience in vape wholesale, supply chain support, and international shipping. We work with reliable brand partners and trusted source channels to support product authenticity, stable stock, and competitive pricing. Through this site, we provide Australian customers with real pricing, flexible retail orders, bulk order support, and Australia-wide delivery."
      },
      {
        title: "Payment Methods",
        content: "We support secure online payment by Credit Card, Apple Pay, and Google Pay. We also support PayPal and Bank Transfer. For PayPal and Bank Transfer payments, please contact our customer representative to receive the payment account details."
      },
      {
        title: "Order Processing & Delivery",
        content: "Orders are usually processed within 24 hours after payment is confirmed. Packing photos, order updates, and tracking information will be uploaded to your CnvapesAustralia account. You can log in with the email address used when placing the order and check your order status directly on our website at any time. Final delivery in Australia is handled by local delivery partners such as Australia Post. Delivery time may vary depending on stock availability, customs clearance, transit conditions, and local delivery progress."
      },
      {
        title: "100% Delivery Protection",
        content: "Every order is covered by our 100% Delivery Protection. If your order is not delivered for any reason, including customs-related issues, we will take responsibility and provide a full refund. You can order with complete confidence."
      },
      {
        title: "Pricing & Shipping Rules",
        content: "Shipping fees and quantity discounts are automatically calculated based on the total quantity in your cart. The more you buy, the lower your average landed cost.",
        table: true
      },
      {
        title: "Customer Delivery Feedback",
        content: "Real feedback and received product photos from our verified customers. We are proud of our delivery record and share real customer experiences to build trust and transparency."
      },
      {
        title: "Cnvapes Promise",
        icon: "🤝",
        content: "Thank you for taking the time to learn more about CnvapesAustralia. We look forward to serving you with reliable products, 100% Delivery Protection, transparent service, and long-term support. We hope this is the first step toward a trusted long-term relationship."
      }
    ].map((section, i) => (
      <div key={i} style={{ marginBottom: '2.5rem', paddingBottom: '2.5rem', borderBottom: '1px solid var(--border-color)' }}>
        <h2 className="font-display text-2xl" style={{ marginBottom: '1rem', color: 'white' }}>
          {section.icon && <span style={{ marginRight: '0.5rem' }}>{section.icon}</span>}
          {section.title}
        </h2>
        <p style={{ color: '#c8c8c8', lineHeight: 1.8, fontSize: '1rem' }}>{section.content}</p>
        {section.table && (
          <div style={{ marginTop: '1.5rem', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'var(--bg-secondary)', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)' }}>
                  <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>Quantity</th>
                  <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>Shipping</th>
                  <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>Discount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['4 pcs', 'AUD $20', 'Base Price'],
                  ['5–6 pcs', '✅ Free Shipping', 'Base Price'],
                  ['7–10 pcs', '✅ Free Shipping', '5% Off'],
                  ['11–50 pcs', '✅ Free Shipping', '10% Off'],
                  ['51+ pcs', '✅ Free Shipping', '15% Off'],
                ].map(([qty, ship, disc], j) => (
                  <tr key={j} style={{ borderTop: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '0.875rem 1.25rem', fontWeight: 700 }}>{qty}</td>
                    <td style={{ padding: '0.875rem 1.25rem', color: ship.includes('✅') ? 'var(--success)' : 'white', fontWeight: ship.includes('✅') ? 600 : 400 }}>{ship}</td>
                    <td style={{ padding: '0.875rem 1.25rem', color: disc !== 'Base Price' ? 'var(--primary-accent)' : 'var(--text-secondary)', fontWeight: disc !== 'Base Price' ? 700 : 400 }}>{disc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    ))}

    <div style={{ background: 'rgba(196,0,0,0.07)', border: '1px solid rgba(196,0,0,0.25)', borderRadius: '12px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <span style={{ fontSize: '2rem' }}>📞</span>
      <div>
        <p className="font-bold">Need Help? Contact Us</p>
        <p className="text-muted text-sm">Telephone: +61410736059</p>
      </div>
    </div>
  </div>
);

export default ShoppingGuide;
