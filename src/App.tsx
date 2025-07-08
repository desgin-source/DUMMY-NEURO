import React from 'react';
import FluidBackground from './components/FluidBackground';
import PremiumNavigation from './components/PremiumNavigation';
import PremiumHero from './components/PremiumHero';
import PremiumAudio from './components/PremiumAudio';
import PremiumSummary from './components/PremiumSummary';
import PremiumGraph from './components/PremiumGraph';

function App() {
  return (
    <div className="relative w-screen min-h-screen overflow-x-hidden">
      <FluidBackground />
      
      <main className="relative z-10">
        <PremiumNavigation />
        <PremiumHero />
        <PremiumAudio />
        <PremiumSummary />
        <PremiumGraph />
      </main>
    </div>
  );
}

export default App;