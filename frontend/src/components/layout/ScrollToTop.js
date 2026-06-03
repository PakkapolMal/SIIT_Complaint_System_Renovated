import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Reset scroll on route change so short pages don't inherit landing scroll offset. */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default ScrollToTop;
