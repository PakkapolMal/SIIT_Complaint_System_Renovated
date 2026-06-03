import React from 'react';
import AppLayout from '../layout/AppLayout';
import PublicNav from '../layout/PublicNav';
import LandingHero from './LandingHero';
import LandingAbout from './LandingAbout';
import LandingFeatures from './LandingFeatures';
import LandingWorkflow from './LandingWorkflow';
import LandingStats from './LandingStats';
import LandingFooter from './LandingFooter';
import { layout } from '../../lib/designTokens';

function LandingPage() {
  return (
    <AppLayout headerRight={<PublicNav page="home" />} homeTo="/">
      <div className="space-y-0">
        <div className={layout.container}>
          <div className="py-8 sm:py-10 lg:py-12">
            <LandingHero />
          </div>
        </div>
        <LandingAbout />
        <LandingFeatures />
        <LandingWorkflow />
        <LandingStats />
        <LandingFooter />
      </div>
    </AppLayout>
  );
}

export default LandingPage;
