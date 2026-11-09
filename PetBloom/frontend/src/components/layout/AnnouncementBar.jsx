import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldAlert, Truck, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const announcements = [
  {
    icon: Truck,
    text: 'Complimentary Pan-India Delivery on orders above ₹999',
    link: '/shop',
    linkText: 'Shop Now',
  },
  {
    icon: Sparkles,
    text: 'Welcome to the Ritual: Enjoy 10% off your first curation with code RITUAL10',
    link: '/shop',
    linkText: 'Explore',
  },
  {
    icon: ShieldAlert,
    text: 'Essential Canine Emergency Kits formulated for absolute peace of mind',
    link: '/emergency-kits',
    linkText: 'Learn More',
  },
];

export const AnnouncementBar = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const current = announcements[currentIndex];
  const Icon = current.icon;

  return (
    <div className="bg-sage-800 text-ivory-100 text-xs py-2 px-4 border-b border-sage-700/50 transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-2 text-ivory-300">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse"></span>
          <span className="tracking-widest uppercase text-[10px] font-medium text-gold-300">
            Apothecary Pet Care
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center space-x-2 text-center text-ivory-100">
          <Icon className="w-3.5 h-3.5 text-gold-400 shrink-0" />
          <span className="tracking-wide text-xs">{current.text}</span>
          <Link
            to={current.link}
            className="underline underline-offset-4 font-medium text-gold-300 hover:text-gold-200 transition-colors inline-flex items-center text-xs"
          >
            {current.linkText}
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-4 text-[11px] text-ivory-300">
          <Link to="/emergency-guide" className="hover:text-gold-300 transition-colors">
            Emergency Triage Guide
          </Link>
          <span className="text-sage-600">|</span>
          <Link to="/contact" className="hover:text-gold-300 transition-colors">
            Concierge Care
          </Link>
        </div>
      </div>
    </div>
  );
};
