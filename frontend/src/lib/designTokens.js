/**
 * Shared layout tokens for web + future mobile (React Native can mirror these values).
 */
export const layout = {
  sectionY: 'py-12 sm:py-16 lg:py-20',
  container: 'mx-auto w-full max-w-6xl px-4 sm:px-6',
  containerNarrow: 'mx-auto w-full max-w-4xl px-4 sm:px-6',
  touchTarget: 'min-h-11 min-w-[2.75rem]',
  cardGap: 'gap-4 sm:gap-6',
  gridFeatures: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6',
  grid3Cols: 'mx-auto grid max-w-4xl grid-cols-3 gap-3',
};

export const typography = {
  display: 'text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl',
  h2: 'text-2xl font-bold tracking-tight text-foreground sm:text-3xl',
  h3: 'text-lg font-semibold text-foreground',
  lead: 'text-base text-muted-foreground sm:text-lg leading-relaxed',
  body: 'text-sm text-muted-foreground sm:text-base leading-relaxed',
  eyebrow: 'text-xs font-semibold uppercase tracking-wider text-primary',
};
