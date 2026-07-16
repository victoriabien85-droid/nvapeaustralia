import React from 'react';
import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero animate-fade-in">
      <Link to="/shop" className="hero-link">
        <img src="/assets/CnvapesAustralia-Social-Banner1.png" alt="CnvapesAustralia" className="hero-img" />
      </Link>
    </section>
  );
};

export default Hero;
