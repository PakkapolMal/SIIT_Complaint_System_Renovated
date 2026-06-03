import React from 'react';
import { cn } from '../../lib/utils';
import { layout } from '../../lib/designTokens';

function LandingSection({ id, children, className, variant = 'default' }) {
  const variants = {
    default: 'bg-background',
    muted: 'bg-muted/40 border-y border-border',
    card: 'bg-card',
  };

  return (
    <section
      id={id}
      className={cn(layout.sectionY, variants[variant], className)}
      aria-labelledby={id ? `${id}-heading` : undefined}
    >
      <div className={layout.container}>{children}</div>
    </section>
  );
}

export default LandingSection;
