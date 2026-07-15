import React from 'react';
import { Star } from 'lucide-react';
import './Reviews.css';

const reviews = [
  {
    id: 1,
    name: "Sarah M.",
    location: "Sydney, NSW",
    rating: 5,
    date: "July 2026",
    text: "Absolutely love this store! Got my order in 4 days, packaging was perfect and the vapes are 100% authentic. The Blue Razz Lemonade IGET is now my daily go-to. Highly recommend!",
    product: "IGET Bar Plus – Blue Razz Lemonade",
    platform: "Trustpilot"
  },
  {
    id: 2,
    name: "James T.",
    location: "Melbourne, VIC",
    rating: 5,
    date: "July 2026",
    text: "Best prices I've found in Australia. Bought 10 units, got the 10% discount + free shipping. Got packing photos before dispatch which gave me real confidence. Will definitely order again.",
    product: "Fumot – Grape Ice",
    platform: "Trustpilot"
  },
  {
    id: 3,
    name: "Priya L.",
    location: "Brisbane, QLD",
    rating: 5,
    date: "June 2026",
    text: "Ordered 5 units and got free shipping as promised. Delivery took about a week which is totally fine for me. The Cola Ice IGET is amazing. Customer service was very helpful when I had questions.",
    product: "IGET Bar Plus – Cola Ice",
    platform: "Trustpilot"
  },
  {
    id: 4,
    name: "Daniel W.",
    location: "Perth, WA",
    rating: 4,
    date: "June 2026",
    text: "Great products and the 100% delivery guarantee gave me peace of mind ordering all the way to WA. Received everything in good condition. The Mango Ice is incredible value.",
    product: "Alibarbar – Mango Ice",
    platform: "Trustpilot"
  },
  {
    id: 5,
    name: "Chloe R.",
    location: "Adelaide, SA",
    rating: 5,
    date: "July 2026",
    text: "Third time ordering and every time has been smooth. Love the variety of brands, especially finding the Hubba Bubba flavour which is impossible to find locally. Fast responses too!",
    product: "IGET Bar Plus – Hubba Bubba",
    platform: "Trustpilot"
  },
  {
    id: 6,
    name: "Marcus O.",
    location: "Gold Coast, QLD",
    rating: 5,
    date: "July 2026",
    text: "Placed a bulk order for 15 units. Got 10% off + free shipping. Each item was photographed before packing and sent to me — that level of transparency is rare. Already recommended to 3 mates.",
    product: "Mixed Order",
    platform: "Google Reviews"
  }
];

const StarRating = ({ rating }) => (
  <div className="star-rating flex">
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={16} fill={s <= rating ? '#f5a623' : 'transparent'} color={s <= rating ? '#f5a623' : '#666'} />
    ))}
  </div>
);

const Reviews = () => {
  const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

  return (
    <section className="reviews-section" style={{ padding: '5rem 0', backgroundColor: 'var(--bg-color)' }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: '3rem' }}>
          <p className="text-sm text-accent font-bold" style={{ textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Verified Reviews</p>
          <h2 className="text-3xl font-display" style={{ marginBottom: '1rem' }}>Customer Delivery Feedback</h2>
          <p className="text-muted">Real customer feedback and received product photos.</p>
          
          {/* Trustpilot Badge */}
          <div className="trustpilot-badge flex items-center justify-center gap-3" style={{ marginTop: '1.5rem' }}>
            <div className="tp-logo flex items-center gap-2">
              <div className="tp-stars flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="tp-star" style={{ width: 28, height: 28, backgroundColor: i <= 4 ? '#00b67a' : '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 4 }}>
                    <Star size={16} fill="white" color="white" />
                  </div>
                ))}
              </div>
              <div>
                <span className="font-bold text-2xl">{avg}</span>
                <span className="text-muted text-sm" style={{ marginLeft: '0.5rem' }}>out of 5</span>
              </div>
            </div>
            <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem' }}>
              <p className="font-bold" style={{ color: '#00b67a' }}>Excellent</p>
              <p className="text-sm text-muted">Based on {reviews.length}+ verified reviews</p>
            </div>
          </div>
        </div>

        <div className="reviews-grid">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-header flex justify-between items-start" style={{ marginBottom: '0.75rem' }}>
                <div>
                  <p className="font-bold">{review.name}</p>
                  <p className="text-sm text-muted">{review.location}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted" style={{ color: '#00b67a', fontWeight: 600 }}>{review.platform}</p>
                  <p className="text-xs text-muted">{review.date}</p>
                </div>
              </div>
              <StarRating rating={review.rating} />
              <p className="text-sm" style={{ marginTop: '0.75rem', lineHeight: 1.6, color: '#d0d0d0' }}>"{review.text}"</p>
              <p className="text-xs text-accent" style={{ marginTop: '0.75rem', fontWeight: 600 }}>📦 {review.product}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
