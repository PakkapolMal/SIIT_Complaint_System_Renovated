import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../ui/logo.png';

function SiteBrand({ homeTo = '/' }) {
  return (
    <Link
      to={homeTo}
      className="flex min-w-0 items-center gap-3 rounded-sm transition-colors duration-200 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <img
        src={logo}
        alt="SIIT Student and Sub Student Committee logo"
        className="h-11 w-11 shrink-0 object-contain sm:h-12 sm:w-12"
      />
      <span className="truncate text-lg font-bold leading-tight tracking-tight text-foreground sm:text-xl lg:text-2xl">
        SIIT Complaint System
      </span>
    </Link>
  );
}

export default SiteBrand;
