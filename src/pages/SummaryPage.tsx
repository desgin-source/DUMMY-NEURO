import React from 'react';
import PremiumSummary from '../components/PremiumSummary';

export default function SummaryPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0C10] via-[#0B0E11] to-[#000000]">
      <div className="pt-20 pb-32">
        <PremiumSummary />
      </div>
    </div>
  );
}