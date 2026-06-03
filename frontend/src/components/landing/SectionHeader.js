import React from 'react';
import { cn } from '../../lib/utils';
import { typography } from '../../lib/designTokens';

function SectionHeader({ id, eyebrow, title, description, className, align = 'center' }) {
  const alignClass =
    align === 'left'
      ? 'max-w-3xl text-left'
      : 'mx-auto max-w-3xl text-center';

  return (
    <header className={cn('mb-8 sm:mb-10', alignClass, className)}>
      {eyebrow ? (
        <p className={cn(typography.eyebrow, 'mb-2')}>{eyebrow}</p>
      ) : null}
      <h2 id={id} className={typography.h2}>
        {title}
      </h2>
      {description ? (
        <p className={cn(typography.lead, 'mt-3')}>{description}</p>
      ) : null}
    </header>
  );
}

export default SectionHeader;
