import React from 'react';
import { Eye, ListChecks, Shield, Workflow } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import SectionHeader from './SectionHeader';
import LandingSection from './LandingSection';
import { landingCopy } from './landingContent';
import { layout } from '../../lib/designTokens';

const FEATURE_ICONS = {
  anonymous: Shield,
  tracking: ListChecks,
  transparency: Eye,
  workflow: Workflow,
};

function LandingFeatures() {
  const { features } = landingCopy;

  return (
    <LandingSection id="features">
      <SectionHeader
        id="features-heading"
        //eyebrow="Capabilities"
        title="Designed for students and administrators"
        description="Core tools that keep reporting structured, private where needed, and transparent where appropriate."
      />
      <ul className={layout.gridFeatures}>
        {features.map((feature) => {
          const Icon = FEATURE_ICONS[feature.id] || Shield;
          return (
            <li key={feature.id}>
              <Card className="h-full transition-colors duration-200 hover:border-primary/30 hover:shadow-md">
                <CardHeader className="pb-2">
                  <div
                    className="mb-2 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary"
                    aria-hidden="true"
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </li>
          );
        })}
      </ul>
    </LandingSection>
  );
}

export default LandingFeatures;
