import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import OfferBanner from '../components/OfferBanner';
import TestCard from '../components/TestCard';
import PackageCard from '../components/PackageCard';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../utils/api';
import './Home.css';

export default function Home({ selectedTests, onToggleSelect, onBookNow }) {
  const navigate = useNavigate();
  const [featuredTests, setFeaturedTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [loadingPkgs, setLoadingPkgs] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchFeaturedTests = async () => {
      try {
        const response = await api.get('/tests?featured=true&limit=4');
        if (response.data.success && active) {
          setFeaturedTests(response.data.data);
        }
      } catch (err) {
        console.error('Error loading featured tests:', err);
      } finally {
        if (active) setLoadingTests(false);
      }
    };

    const fetchPackages = async () => {
      try {
        const response = await api.get('/packages');
        if (response.data.success && active) {
          // Take first 3 packages for home page
          setPackages(response.data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Error loading packages:', err);
      } finally {
        if (active) setLoadingPkgs(false);
      }
    };

    fetchFeaturedTests();
    fetchPackages();
    return () => { active = false; };
  }, []);

  return (
    <div className="home-page">
      {/* Dynamic Offer Ticker Banner */}
      <OfferBanner />

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container container">
          <div className="hero-content">
            <span className="hero-tagline">CRL Authorized Collection Point</span>
            <h1 className="hero-title">
              Accurate Reports, <br />
              <span className="highlight-gold">Healthy Living Starts Here.</span>
            </h1>
            <p className="hero-text">
              Vriddhi Pathology Laboratory brings premium diagnostic services to your doorstep in Chandauli, UP. Get certified medical tests with free home collection.
            </p>
            <div className="hero-buttons">
              <Link to="/tests" className="btn btn-gold">Browse 112+ Tests</Link>
              <Link to="/book" className="btn btn-outline-gold" style={{ color: '#fff' }}>Book Home Collection</Link>
            </div>
          </div>
          <div className="hero-image-wrapper">
            <div className="hero-accent-circle"></div>
            {/* Fallback styling for design excellence if image is absent */}
            <div className="hero-card-promo">
              <div className="promo-item">
                <span className="promo-number">30%</span>
                <span className="promo-text">Global Test Discount</span>
              </div>
              <div className="promo-item">
                <span className="promo-number">10%</span>
                <span className="promo-text">Senior Citizen Off</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="trust-badges-section">
        <div className="container trust-badges-grid">
          <div className="trust-badge-card">
            <span className="badge-icon">🎖️</span>
            <div>
              <h3>CRL Authorized</h3>
              <p>Reference Lab Quality Standards</p>
            </div>
          </div>
          <div className="trust-badge-card">
            <span className="badge-icon">🏠</span>
            <div>
              <h3>Free Home Collection</h3>
              <p>Sample Collection from home</p>
            </div>
          </div>
          <div className="trust-badge-card">
            <span className="badge-icon">⚡</span>
            <div>
              <h3>Quick Turnaround</h3>
              <p>Same-day email & WA reports</p>
            </div>
          </div>
          <div className="trust-badge-card">
            <span className="badge-icon">🎯</span>
            <div>
              <h3>100% Accurate</h3>
              <p>Quality Checked by Experts</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Tests Section */}
      <section className="section popular-tests-section">
        <div className="container">
          <h2 className="section-title">Popular Medical Tests</h2>
          <p className="section-subtitle">Most frequently booked diagnostic tests. Add to booking list or book instantly.</p>
          
          {loadingTests ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-4">
                {featuredTests.map(test => (
                  <TestCard
                    key={test._id}
                    test={test}
                    isSelected={selectedTests.some(t => t._id === test._id)}
                    onToggleSelect={onToggleSelect}
                    onBookNow={onBookNow}
                  />
                ))}
              </div>
              <div className="view-all-wrapper">
                <Link to="/tests" className="btn btn-primary btn-outline">View All 112+ Tests</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Health Packages Section */}
      <section className="section health-packages-section">
        <div className="container">
          <h2 className="section-title">Health Checkup Packages</h2>
          <p className="section-subtitle">Comprehensive health screenings for you and your family at special rates.</p>

          {loadingPkgs ? (
            <LoadingSpinner />
          ) : (
            <>
              <div className="grid grid-3">
                {packages.map(pkg => (
                  <PackageCard
                    key={pkg._id}
                    pkg={pkg}
                    isSelected={selectedTests.some(t => t._id === pkg._id)}
                    onToggleSelect={onToggleSelect}
                    onBookNow={onBookNow}
                  />
                ))}
              </div>
              <div className="view-all-wrapper">
                <Link to="/packages" className="btn btn-secondary">View All Health Packages</Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section why-choose-section">
        <div className="container">
          <h2 className="section-title">Why Choose Vriddhi Pathology?</h2>
          <p className="section-subtitle">We are committed to delivering highest standards of safety, accuracy, and care.</p>
          
          <div className="grid grid-3">
            <div className="why-card">
              <span className="why-icon">🏢</span>
              <h3>CRL Reference Network</h3>
              <p>Partnered with Central Reference Laboratory (CRL) to offer advanced diagnostics and precise report verification.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">💉</span>
              <h3>Trained Phlebotomists</h3>
              <p>Our lab technicians follow strict safety and hygiene protocols during home sample collections for painless experiences.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">🔬</span>
              <h3>Advanced Technology</h3>
              <p>Equipped with state-of-the-art analyzers and automation systems to guarantee consistent medical results.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">📱</span>
              <h3>Digital Reports</h3>
              <p>Access your reports easily via secure WhatsApp message, email, or physical printouts from our collection point.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">💖</span>
              <h3>Patient First Philosophy</h3>
              <p>Honest pricing, dynamic discount offers, senior citizen care, and prompt customer support via chat.</p>
            </div>
            <div className="why-card">
              <span className="why-icon">📍</span>
              <h3>Local Trusted Center</h3>
              <p>Conveniently located in Jagdish Saray, Chandauli to serve you and your family 7 days a week.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="section how-it-works-section">
        <div className="container">
          <h2 className="section-title">How Online Booking Works</h2>
          <p className="section-subtitle">Get your medical checkup in three simple steps without visiting the lab.</p>
          
          <div className="how-works-grid">
            <div className="step-card">
              <div className="step-number">01</div>
              <h3>Select Tests</h3>
              <p>Choose tests or packages from our comprehensive rate list and click book.</p>
            </div>
            <div className="step-card-arrow">➡️</div>
            <div className="step-card">
              <div className="step-number">02</div>
              <h3>Book Home Collection</h3>
              <p>Fill address, pick a convenient date & time slot, and send details via WhatsApp.</p>
            </div>
            <div className="step-card-arrow">➡️</div>
            <div className="step-card">
              <div className="step-number">03</div>
              <h3>Get Digital Reports</h3>
              <p>Technician collects samples at your home. Reports are delivered digitally in 24 hours.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Call to Action */}
      <section className="home-cta-section">
        <div className="container cta-container">
          <h2>Need Assistance or Have Special Inquiries?</h2>
          <p>Talk to our lab operators directly on WhatsApp. We can help you select the right tests.</p>
          <a href="https://wa.me/919026578856?text=Hi%20Vriddhi%20Lab%20I%20have%20a%20query%20about%20a%20blood%20test" target="_blank" rel="noopener noreferrer" className="btn btn-gold btn-lg">
            💬 Chat with Lab Expert
          </a>
        </div>
      </section>
    </div>
  );
}
