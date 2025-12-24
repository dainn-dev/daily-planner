import React from 'react';
import PublicHeader from '../components/PublicHeader';
import Hero from '../components/Hero';
import SmartScheduling from '../components/SmartScheduling';
import GoalBreakdown from '../components/GoalBreakdown';
import FocusMode from '../components/FocusMode';
import AdditionalFeatures from '../components/AdditionalFeatures';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const HomePage = () => {
  return (
    <div className="bg-background-light font-display text-gray-900 overflow-x-hidden">
      <PublicHeader />
      <main className="flex flex-col items-center">
        <Hero />
        <SmartScheduling />
        <GoalBreakdown />
        <FocusMode />
        <AdditionalFeatures />
        <CTA />
        <Footer />
      </main>
    </div>
  );
};

export default HomePage;

