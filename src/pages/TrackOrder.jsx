import React, { useState } from 'react';
import { Search, MapPin, Calendar, Clipboard, CheckCircle2, Circle, Truck, Package, ShieldAlert, ArrowRight } from 'lucide-react';
import './TrackOrder.css';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [trackingData, setTrackingData] = useState(null);
  const [searched, setSearched] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    if (!orderId.trim()) return;

    setSearched(true);
    
    // Hash order ID to deterministic state for simulated tracking data
    const idStr = orderId.toUpperCase().trim();
    let score = 0;
    for (let i = 0; i < idStr.length; i++) {
      score += idStr.charCodeAt(i);
    }
    const statusType = score % 4; // 4 status flows

    let status = 'delivered';
    let steps = [];
    let eta = 'Delivered';
    let mockProduct = 'IGET Bar Plus – Blue Razz Lemonade (5x)';
    let trackingNum = 'AP-928471638-AU';

    const baseSteps = [
      { name: 'Order Received', desc: 'Payment confirmed & order sent to packaging warehouse.', date: 'July 14, 2026 09:30 AM', done: true },
      { name: 'Packed & Photographed', desc: 'Order contents verified, packed, and parcel photo uploaded.', date: 'July 14, 2026 03:45 PM', done: true, hasPhoto: true },
      { name: 'Shipped (China Warehouse)', desc: 'Despatched from China main sorting center. Air transit to Australia.', date: 'July 15, 2026 11:20 AM', done: true },
      { name: 'Customs Clearance', desc: 'Arrived at Australian import terminal. Customs cleared successfully.', date: 'July 16, 2026 08:15 AM', done: false },
      { name: 'Out for Delivery', desc: 'Handed over to Australia Post for final delivery.', date: 'July 16, 2026 01:10 PM', done: false },
      { name: 'Delivered', desc: 'Successfully delivered to shipping address. Safe drop applied.', date: 'July 16, 2026 04:30 PM', done: false }
    ];

    if (statusType === 0) {
      // Delivered
      status = 'Delivered';
      eta = 'Delivered on July 16';
      steps = baseSteps.map(s => ({ ...s, done: true }));
    } else if (statusType === 1) {
      // Out for delivery
      status = 'Out for Delivery';
      eta = 'Expected Today (By 5:00 PM)';
      steps = baseSteps.map((s, idx) => ({ ...s, done: idx <= 4 }));
    } else if (statusType === 2) {
      // Customs clearance
      status = 'In Transit (Customs Cleared)';
      eta = 'Expected July 18';
      steps = baseSteps.map((s, idx) => ({ ...s, done: idx <= 3 }));
    } else {
      // Packed
      status = 'Packed (Awaiting Dispatch)';
      eta = 'Expected July 20';
      steps = baseSteps.map((s, idx) => ({ ...s, done: idx <= 1 }));
    }

    setTrackingData({
      orderId: idStr,
      status,
      eta,
      carrier: 'Australia Post',
      trackingNum,
      product: mockProduct,
      steps
    });
  };

  return (
    <div className="track-order-page container animate-fade-in" style={{ padding: '3rem 24px', minHeight: 'calc(100vh - 110px)' }}>
      <div className="track-header text-center" style={{ maxWidth: '600px', margin: '0 auto 3rem' }}>
        <p className="text-sm text-accent font-bold" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Track Shipment</p>
        <h1 className="text-4xl font-display mb-4">Track Your Order</h1>
        <p className="text-muted">Enter your Order ID (found in your email or account dashboard) and email address to view real-time shipping status and packing photographs.</p>
      </div>

      <div className="track-card-form" style={{ maxWidth: '560px', margin: '0 auto' }}>
        <form onSubmit={handleTrack} className="flex flex-col gap-4">
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem', display: 'block' }}>Order Reference ID *</label>
            <input
              type="text"
              className="input"
              placeholder="e.g. CNV-10492"
              required
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              style={{ background: '#1c1c1c', border: '1px solid #333', color: 'white' }}
            />
          </div>
          <div className="form-group">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'white', marginBottom: '0.5rem', display: 'block' }}>Email Address *</label>
            <input
              type="email"
              className="input"
              placeholder="e.g. customer@email.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ background: '#1c1c1c', border: '1px solid #333', color: 'white' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%' }}>
            Retrieve Tracking Information <ArrowRight size={16} />
          </button>
        </form>
      </div>

      {searched && trackingData && (
        <div className="tracking-results-container animate-slide-up" style={{ maxWidth: '800px', margin: '3rem auto 0' }}>
          
          {/* Status Header Banner */}
          <div className="status-banner flex justify-between items-center" style={{ backgroundColor: '#1c1c1c', border: '1px solid #333', padding: '1.5rem', borderRadius: '8px 8px 0 0' }}>
            <div>
              <p className="text-xs text-muted" style={{ textTransform: 'uppercase' }}>Current Status</p>
              <h2 className="text-xl font-bold text-accent">{trackingData.status}</h2>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p className="text-xs text-muted" style={{ textTransform: 'uppercase' }}>Estimated Arrival</p>
              <h2 className="text-lg font-bold" style={{ color: 'white' }}>{trackingData.eta}</h2>
            </div>
          </div>

          {/* Details Bar */}
          <div className="tracking-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', backgroundColor: '#121212', borderLeft: '1px solid #333', borderRight: '1px solid #333', borderBottom: '1px solid #333', padding: '1.25rem' }}>
            <div>
              <p className="text-xs text-muted">Carrier</p>
              <p className="text-sm font-bold" style={{ color: 'white' }}>{trackingData.carrier}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Tracking ID</p>
              <p className="text-sm font-bold flex items-center gap-1" style={{ color: 'white' }}>
                {trackingData.trackingNum}
                <button 
                  onClick={() => navigator.clipboard.writeText(trackingData.trackingNum)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: 0 }}
                  title="Copy"
                >
                  <Clipboard size={14} />
                </button>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted">Items</p>
              <p className="text-sm font-bold text-truncate" style={{ color: 'white', maxWidth: '200px' }}>{trackingData.product}</p>
            </div>
            <div>
              <p className="text-xs text-muted">Delivery Protection</p>
              <p className="text-sm font-bold" style={{ color: 'var(--success)' }}>🛡️ 100% Guaranteed</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="timeline-section" style={{ backgroundColor: '#1c1c1c', borderLeft: '1px solid #333', borderRight: '1px solid #333', borderBottom: '1px solid #333', padding: '2rem 1.5rem', borderRadius: '0 0 8px 8px' }}>
            <h3 className="font-display text-lg mb-6" style={{ color: 'white' }}>Shipping History</h3>
            
            <div className="timeline-flow">
              {trackingData.steps.map((step, idx) => (
                <div key={idx} className={`timeline-item ${step.done ? 'done' : 'pending'}`}>
                  <div className="timeline-icon-col">
                    {step.done ? (
                      <div className="icon-circle done">
                        <CheckCircle2 size={18} />
                      </div>
                    ) : (
                      <div className="icon-circle pending">
                        <Circle size={18} />
                      </div>
                    )}
                    {idx < trackingData.steps.length - 1 && (
                      <div className={`timeline-connector ${step.done && trackingData.steps[idx + 1].done ? 'done' : ''}`} />
                    )}
                  </div>
                  <div className="timeline-text-col">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h4 className="step-title font-bold text-sm" style={{ color: step.done ? 'white' : '#666' }}>{step.name}</h4>
                        <p className="step-desc text-xs text-muted" style={{ marginTop: '0.25rem' }}>{step.desc}</p>
                      </div>
                      <span className="step-date text-xs text-muted" style={{ whiteSpace: 'nowrap' }}>{step.done ? step.date : '--'}</span>
                    </div>

                    {step.hasPhoto && step.done && (
                      <div style={{ marginTop: '0.75rem' }}>
                        <button 
                          className="btn btn-outline" 
                          onClick={() => setShowPhotoModal(true)}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderColor: 'var(--primary-accent)', color: 'var(--primary-accent)' }}
                        >
                          📷 View Packing Photograph
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Package Photo Modal */}
      {showPhotoModal && (
        <div className="photo-modal-overlay flex items-center justify-center" onClick={() => setShowPhotoModal(false)}>
          <div className="photo-modal-card" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#1c1c1c', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', maxWidth: '480px', width: '90%', position: 'relative' }}>
            <h3 className="font-display text-lg mb-2" style={{ color: 'white' }}>Parcel Packing Photograph</h3>
            <p className="text-xs text-muted mb-4">This photo was captured in our distribution hub prior to seal and shipment dispatch to verify quantities and condition.</p>
            <div className="photo-preview-box" style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #222' }}>
              <img src="/assets/Blue-Razz-Lemonade-247x296.jpg" alt="Vape packaging" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '300px', objectFit: 'contain', backgroundColor: '#fff', padding: '10px' }} />
            </div>
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-muted">Order ID: {orderId.toUpperCase()}</span>
              <button className="btn btn-primary" onClick={() => setShowPhotoModal(false)} style={{ padding: '0.4rem 1rem', fontSize: '0.8rem' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
