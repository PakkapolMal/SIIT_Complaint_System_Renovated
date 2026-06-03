import React from 'react';
import { Link } from 'react-router-dom';
import { landingCopy } from './landingContent';
import { cn } from '../../lib/utils';
import { layout, typography } from '../../lib/designTokens';

function InstagramIcon(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37a4 4 0 1 1-4.63-4.63A4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LandingFooter() {
  const { footer } = landingCopy;

  return (
    <footer className="border-t border-border bg-card">
      <div className={layout.container}>
        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:py-12">
          <div className="sm:col-span-2 lg:col-span-2">
            <h2 className="text-lg font-semibold text-foreground">
              SIIT Complaint System
            </h2>
            <p className={cn(typography.body, 'mt-2 max-w-xl')}>
              {footer.purpose}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              {footer.contactLabel}
            </h3>
            <p className={cn(typography.body, 'mt-2 flex items-start gap-2')}>
              <InstagramIcon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span><a href="https://www.instagram.com/siit.studentcommittee?igsh=OXZiMDduMTZ0dnRt" target="_blank" rel="noopener noreferrer" className="text-primary transition-colors duration-200 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm w-fit">{footer.contact}</a></span>
            </p>
            {/* <nav className="mt-4 flex flex-col gap-2 text-sm" aria-label="Footer links">
              <Link
                to="/login"
                className="text-primary transition-colors duration-200 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm w-fit"
              >
                Sign in
              </Link>
              <Link
                to="/overall-view"
                className="text-primary transition-colors duration-200 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm w-fit"
              >
                Public complaints
              </Link>
            </nav> */}
          </div>
        </div>
        <div className="border-t border-border py-6">
          <p className="text-center text-xs text-muted-foreground sm:text-left">
            {footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default LandingFooter;