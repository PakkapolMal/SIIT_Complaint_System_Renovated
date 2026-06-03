import { useAuth } from '../../contexts/AuthProvider';

export function useHomePath() {
  const { isAuthenticated, isAdmin } = useAuth();

  if (!isAuthenticated) {
    return '/';
  }

  return isAdmin ? '/admin' : '/portal';
}
