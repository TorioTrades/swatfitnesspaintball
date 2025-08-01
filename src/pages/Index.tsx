import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Slider3D from '@/components/Slider3D';
import WhyChooseUs from '@/components/WhyChooseUs';
import Locations from '@/components/Locations';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

const Index = () => {
  const sliderImages = [
    'https://i.imgur.com/bmwKGCD.png',
    'https://i.imgur.com/1DXvsmX.png',
    'https://i.imgur.com/OQloxzV.png',
    'https://i.imgur.com/qfZJusy.png',
    'https://i.imgur.com/OadDKvO.png',
    'https://i.imgur.com/PGMguvp.png',
    'https://i.imgur.com/47xf6ut.png',
    'https://i.imgur.com/TsmeTVu.png',
    'https://i.imgur.com/kDUSWHF.png',
    'https://i.imgur.com/DeBps8T.png'
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Services />
      <Slider3D 
        images={sliderImages}
        title="PAINTBALL"
        subtitle="ADVENTURE"
        author="Experience the thrill of tactical combat in our premium paintball arenas"
      />
      <WhyChooseUs />
      <Locations />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Index;
