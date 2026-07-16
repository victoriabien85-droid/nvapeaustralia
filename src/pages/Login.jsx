import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Mail, CreditCard, Package, LogOut, LayoutDashboard, MapPin, Eye, FileText, CheckCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState('');
  const navigate = useNavigate();

  const checkLoginStatus = () => {
    const savedEmail = localStorage.getItem('userEmail');
    if (savedEmail) {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
    } else {
      setIsLoggedIn(false);
      setUserEmail('');
    }
  };

  useEffect(() => {
    checkLoginStatus();
    window.addEventListener('auth-change', checkLoginStatus);
    return () => window.removeEventListener('auth-change', checkLoginStatus);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    localStorage.setItem('userEmail', email.trim());
    window.dispatchEvent(new Event('auth-change'));
    setIsLoggedIn(true);
    setUserEmail(email.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem('userEmail');
    window.dispatchEvent(new Event('auth-change'));
    setIsLoggedIn(false);
    navigate('/');
  };

  const viewPackagePhoto = (imagePath) => {
    setSelectedPhoto(imagePath);
    setShowPhotoModal(true);
  };

  if (isLoggedIn) {
    // Show Account Dashboard Mockup
    return (
      <div className="account-page container animate-fade-in" style={{ padding: '3rem 24px', minHeight: 'calc(100vh - 110px)' }}>
        <div className="flex justify-between items-center mb-8 border-b" style={{ paddingBottom: '1.5rem', borderColor: '#333' }}>
          <div>
            <h1 className="text-3xl font-display font-bold" style={{ color: 'white' }}>Customer Dashboard</h1>
            <p className="text-muted text-sm" style={{ marginTop: '0.25rem' }}>Welcome back, <strong style={{ color: 'white' }}>{userEmail}</strong></p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline flex items-center gap-2" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>

        <div className="account-grid" style={{ display: 'grid', gridTemplateColumns: '3fr 1.2fr', gap: '2rem' }}>
          {/* Main Dashboard Content - Orders list */}
          <div className="account-main flex flex-col gap-6">
            
            {/* Stats Row */}
            <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
              <div className="stat-card" style={{ backgroundColor: '#1c1c1c', border: '1px solid #333', borderRadius: '8px', padding: '1.25rem' }}>
                <p className="text-xs text-muted" style={{ textTransform: 'uppercase' }}>Account Status</p>
                <p className="text-lg font-bold" style={{ color: 'var(--success)', marginTop: '0.25rem' }}>Verified Customer</p>
              </div>
              <div className="stat-card" style={{ backgroundColor: '#1c1c1c', border: '1px solid #333', borderRadius: '8px', padding: '1.25rem' }}>
                <p className="text-xs text-muted" style={{ textTransform: 'uppercase' }}>Total Orders</p>
                <p className="text-lg font-bold" style={{ color: 'white', marginTop: '0.25rem' }}>2 Orders</p>
              </div>
              <div className="stat-card" style={{ backgroundColor: '#1c1c1c', border: '1px solid #333', borderRadius: '8px', padding: '1.25rem' }}>
                <p className="text-xs text-muted" style={{ textTransform: 'uppercase' }}>Volume Tier</p>
                <p className="text-lg font-bold" style={{ color: 'var(--primary-accent)', marginTop: '0.25rem' }}>5% Bulk Discount</p>
              </div>
            </div>

            {/* Orders Table */}
            <div className="orders-card" style={{ backgroundColor: '#1c1c1c', border: '1px solid #333', borderRadius: '8px', padding: '1.5rem' }}>
              <h2 className="text-xl font-display mb-4" style={{ color: 'white' }}>Order History</h2>
              <div style={{ overflowX: 'auto' }}>
                <table className="orders-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                      <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Order ID</th>
                      <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Date</th>
                      <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Products</th>
                      <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Total</th>
                      <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Status</th>
                      <th style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #222' }}>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>CNV-84920</td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', color: '#ccc' }}>July 14, 2026</td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', color: '#ccc' }}>
                        IGET Bar Plus – Blue Razz Lemonade (x5)
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>$274.75 AUD</td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.8rem' }}>
                        <span style={{ color: 'white', backgroundColor: '#3b82f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.7rem' }}>In Transit</span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => viewPackagePhoto('/assets/Blue-Razz-Lemonade-247x296.jpg')} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', borderColor: '#444' }}>
                            📷 Package Photo
                          </button>
                          <button onClick={() => navigate('/track-order?id=CNV-84920')} className="btn btn-primary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                            Track
                          </button>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>CNV-81042</td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', color: '#ccc' }}>July 08, 2026</td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', color: '#ccc' }}>
                        Vozol – Cool Mint (x2)<br/>
                        Alibarbar – Mango Ice (x3)
                      </td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'white' }}>$246.90 AUD</td>
                      <td style={{ padding: '1rem 0.5rem', fontSize: '0.8rem' }}>
                        <span style={{ color: 'white', backgroundColor: '#10b981', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600, fontSize: '0.7rem' }}>Delivered</span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right' }}>
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => viewPackagePhoto('/assets/Cool-Mint-280x280.jpg')} className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', borderColor: '#444' }}>
                            📷 Package Photo
                          </button>
                          <button onClick={() => navigate('/track-order?id=CNV-81042')} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', border: '1px solid #444' }}>
                            History
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Sidebar - Profile details */}
          <div className="account-sidebar flex flex-col gap-6">
            <div className="profile-card" style={{ backgroundColor: '#1c1c1c', border: '1px solid #333', borderRadius: '8px', padding: '1.5rem' }}>
              <div className="flex items-center gap-2 mb-4" style={{ color: 'white' }}>
                <MapPin size={18} style={{ color: 'var(--primary-accent)' }} />
                <h3 className="font-display font-bold">Shipping Address</h3>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#ccc', lineHeight: 1.6 }}>
                <p style={{ fontWeight: 700, color: 'white' }}>John Smith</p>
                <p>123 George Street, Suite 5</p>
                <p>Sydney, NSW 2000</p>
                <p>Australia</p>
                <p style={{ marginTop: '0.5rem' }}>📞 +61 400 000 000</p>
              </div>
            </div>

            <div className="protection-card" style={{ backgroundColor: 'rgba(19, 174, 34, 0.05)', border: '1px solid rgba(19, 174, 34, 0.25)', borderRadius: '8px', padding: '1.5rem' }}>
              <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--success)' }}>
                <CheckCircle size={18} />
                <h3 className="font-display font-bold" style={{ fontSize: '0.95rem' }}>100% Secure</h3>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#aaa', lineHeight: 1.5 }}>
                Every purchase is protected under CNVapes Australia Delivery Protection program. If your shipment gets lost or stopped, we provide free reships or full returns.
              </p>
            </div>
          </div>
        </div>

        {/* Packing Photo Modal */}
        {showPhotoModal && (
          <div className="photo-modal-overlay flex items-center justify-center" onClick={() => setShowPhotoModal(false)}>
            <div className="photo-modal-card" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: '#1c1c1c', border: '1px solid #333', borderRadius: '12px', padding: '1.5rem', maxWidth: '440px', width: '90%' }}>
              <h3 className="font-display text-lg mb-2" style={{ color: 'white' }}>Order Packaging Verification</h3>
              <p className="text-xs text-muted mb-4">This package photo was uploaded by the fulfillment representative before dispatching.</p>
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #222', backgroundColor: '#fff', padding: '10px' }}>
                <img src={selectedPhoto} alt="Package Verification" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '280px', objectFit: 'contain' }} />
              </div>
              <div className="flex justify-end mt-4">
                <button className="btn btn-primary" onClick={() => setShowPhotoModal(false)} style={{ padding: '0.4rem 1.2rem', fontSize: '0.8rem' }}>Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Not logged in - Show login form
  return (
    <div className="login-page container animate-fade-in" style={{ padding: '5rem 24px', minHeight: 'calc(100vh - 110px)' }}>
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon">🔑</div>
          <h1 className="login-title font-display">My Account Login</h1>
          <p className="login-subtitle">Access your order logs, parcel photos, and tracking status.</p>
        </div>

        <form onSubmit={handleLogin} className="login-form flex flex-col gap-4">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-with-icon">
              <Mail size={16} className="input-icon-left" />
              <input
                type="email"
                required
                className="input input-indented"
                placeholder="customer@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-with-icon">
              <Lock size={16} className="input-icon-left" />
              <input
                type="password"
                required
                className="input input-indented"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary login-btn">
            Log In to Account
          </button>
        </form>

        <div className="login-footer text-center">
          <p className="text-muted text-xs">
            Any email and password can be used for this demonstration model.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
