import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FilePlus } from 'lucide-react';
import { Button } from '../ui/button';
import { landingCopy } from './landingContent';
import { cn } from '../../lib/utils';
import { layout, typography } from '../../lib/designTokens';

function LandingHero() {
  const { hero } = landingCopy;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-10 shadow-sm sm:px-10 sm:py-14 lg:px-14">
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-secondary/30 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative max-w-3xl">
        <p className={typography.eyebrow}>{hero.eyebrow}</p>
        <h1
          id="hero-heading"
          className={cn(typography.display, 'mt-3')}
        >
          {hero.headline}
        </h1>
        <p className={cn(typography.lead, 'mt-4 max-w-2xl')}>{hero.description}</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Button
            asChild
            size="lg"
            className={cn('w-full sm:w-auto', layout.touchTarget)}
          >
            <Link to="/login">
              <FilePlus className="h-5 w-5" aria-hidden="true" />
              {hero.primaryCta}
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className={cn('w-full sm:w-auto', layout.touchTarget)}
          >
            <Link to="/overall-view">
              {hero.secondaryCta}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default LandingHero;
