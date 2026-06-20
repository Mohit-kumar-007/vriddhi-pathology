import React, { useEffect, useState } from 'react';
import api from '../utils/api';

export default function OfferBanner() {
  const [bannerText, setBannerText] = useState('30% OFF on All Tests | 10% Extra for Senior Citizens (60+) | Free Home Collection*');
  
  useEffect(() => {
    let active = true;
    const fetchSettings = async () => {
      try {
        const response = await api.get('/offers');
        if (response.data.success && response.data.data && active) {
          setBannerText(response.data.data.offerBannerText);
        }
      } catch (err) {
        console.error('Failed to load offer settings:', err);
      }
    };
    fetchSettings();
    return () => { active = false; };
  }, []);

  return (
    <div className="marquee-container">
      <div className="marquee-content">
        <span>{bannerText}</span>
        <span>•</span>
        <span>{bannerText}</span>
        <span>•</span>
        <span>{bannerText}</span>
        <span>•</span>
        <span>{bannerText}</span>
      </div>
    </div>
  );
}
