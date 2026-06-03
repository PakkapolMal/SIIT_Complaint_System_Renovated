import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

/** Fixed width keeps the header from shifting between public pages. */
const NAV_SLOT = 'flex min-h-9 w-[5.75rem] shrink-0 items-center justify-end sm:w-[6.25rem]';

function PublicNav({ page = 'home' }) {
  const navigate = useNavigate();

  if (page === 'login' || page === 'signup') {
    return (
      <nav className={NAV_SLOT} aria-label="Public navigation">
        <Button type="button" variant="outline" size="sm" onClick={() => navigate('/')}>
          Menu
        </Button>
      </nav>
    );
  }

  return (
    <nav className={NAV_SLOT} aria-label="Public navigation">
      <Button asChild size="sm">
        <Link to="/login">Sign in</Link>
      </Button>
    </nav>
  );
}

export default PublicNav;
