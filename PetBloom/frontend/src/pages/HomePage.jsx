import React, { useState } from 'react';
import { Hero } from '../components/home/Hero';
import { TrustSection } from '../components/home/TrustSection';
import { FeaturedCollections } from '../components/home/FeaturedCollections';
import { Bestsellers } from '../components/home/Bestsellers';
import { BrandStory } from '../components/home/BrandStory';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { Testimonials } from '../components/home/Testimonials';
import { InstagramGallery } from '../components/home/InstagramGallery';
import { QuickViewModal } from '../components/product/QuickViewModal';

export const HomePage = () => {
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  return (
    <div className="min-h-screen bg-ivory-50">
      <Hero />
      <TrustSection />
      <FeaturedCollections />
      <Bestsellers onQuickView={(prod) => setQuickViewProduct(prod)} />
      <BrandStory />
      <WhyChooseUs />
      <Testimonials />
      <InstagramGallery />

      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
