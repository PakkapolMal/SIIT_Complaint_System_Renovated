import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import SectionHeader from './SectionHeader';
import LandingSection from './LandingSection';
import { landingCopy } from './landingContent';
import { typography } from '../../lib/designTokens';

function LandingAbout() {
  const { about } = landingCopy;

  return (
    <LandingSection id="about" variant="muted">
      <div className="mx-auto lg:max-w-3xl">
        <SectionHeader
          id="about-heading"
          title={about.title}
          description={about.description}
          align="left"
        />
        <ul className="grid gap-3 sm:grid-cols-1 lg:max-w-3xl mx-auto">
          {about.bullets.map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-lg border border-border bg-card p-4 shadow-sm transition-colors duration-200"
            >
              <CheckCircle2
                className="mt-0.5 h-5 w-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <span className={typography.body}>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </LandingSection>
  );
}

export default LandingAbout;
