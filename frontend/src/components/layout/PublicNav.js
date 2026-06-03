import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

function PublicNav({ page = 'home' }) {
  const navigate = useNavigate();

  if (page === 'login') {
    return (
      <nav className="flex items-center gap-2 sm:gap-3" aria-label="Public navigation">
        <Button type="button" variant="outline" size="sm" onClick={() => navigate('/')}>
          Menu
        </Button>
        {/* <Button asChild size="sm">
          <Link to="/signup">Sign up</Link>
        </Button> */}
      </nav>
    );
  }
  
  return (
    <nav className="flex items-center gap-2 sm:gap-3" aria-label="Public navigation">
      <Button asChild size="sm">
        <Link to="/login">Sign in</Link>
      </Button>
    </nav>
  );
}

export default PublicNav;
