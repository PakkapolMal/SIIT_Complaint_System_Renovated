import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { getErrorMessage } from '../lib/authErrors';
import { isAllowedSiitEmail } from '../lib/parseStudentEmail';
import { resolveUserProfile } from '../lib/resolveUserProfile';
import { layout } from '../lib/designTokens';
import { cn } from '../lib/utils';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [staffDivision, setStaffDivision] = useState(null);
  const [profileComplete, setProfileComplete] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const pendingAuthEventRef = useRef(null);

  const clearProfileState = useCallback(() => {
    setProfile(null);
    setUserRole(null);
    setUserId(null);
    setUserName(null);
    setStudentId(null);
    setStaffDivision(null);
    setProfileComplete(false);
  }, []);

  const applyResolvedProfile = useCallback((resolved) => {
    if (resolved.authError) {
      setAuthError(resolved.authError);
      clearProfileState();
      return false;
    }

    setAuthError(null);
    setProfile(resolved.profile);
    setUserRole(resolved.userRole);
    setUserId(resolved.userId);
    setUserName(resolved.userName);
    setStudentId(resolved.studentId);
    setStaffDivision(resolved.staffDivision);
    setProfileComplete(resolved.profileComplete);
    return true;
  }, [clearProfileState]);

  const handlePostLoginRedirect = useCallback((resolved) => {
    if (!resolved || resolved.authError) {
      navigate('/login', { replace: true });
      return;
    }

    if (resolved.userRole === 'Admin') {
      navigate('/admin', { replace: true });
      return;
    }

    if (resolved.userRole === 'Staff') {
      navigate(resolved.profileComplete ? '/admin' : '/signup', { replace: true });
      return;
    }

    if (resolved.userRole === 'Student' && !resolved.profileComplete) {
      navigate('/signup', { replace: true });
      return;
    }

    if (resolved.userRole === 'Student') {
      navigate('/portal', { replace: true });
    }
  }, [navigate]);

  const loadProfileForUser = useCallback(async (activeUser, authEvent = null) => {
    if (!activeUser) {
      clearProfileState();
      return null;
    }

    setIsLoading(true);

    try {
      const email = activeUser.email?.trim().toLowerCase();

      if (!isAllowedSiitEmail(email)) {
        setAuthError('Only @siit.tu.ac.th and @g.siit.tu.ac.th Google accounts are allowed.');
        await supabase.auth.signOut();
        clearProfileState();
        return null;
      }

      const resolved = await resolveUserProfile(activeUser);
      applyResolvedProfile(resolved);

      if (authEvent === 'SIGNED_IN') {
        handlePostLoginRedirect(resolved);
        return resolved;
      }

      const landingPaths = ['/portal', '/login'];
      if (authEvent === 'INITIAL_SESSION' && landingPaths.includes(window.location.pathname)) {
        handlePostLoginRedirect(resolved);
      }

      return resolved;
    } catch (error) {
      console.error('Profile resolution failed:', error);
      setAuthError(getErrorMessage(error));
      clearProfileState();
      navigate('/login', { replace: true });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [applyResolvedProfile, clearProfileState, handlePostLoginRedirect, navigate]);

  const refreshProfile = useCallback(async (activeUser = user) => {
    return loadProfileForUser(activeUser, null);
  }, [loadProfileForUser, user]);

  useEffect(() => {
    let isMounted = true;

    const bootstrapSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (!isMounted) {
          return;
        }

        setSession(initialSession);
        setUser(initialSession?.user ?? null);
      } catch (error) {
        console.error('Session bootstrap failed:', error);
        if (isMounted) {
          setAuthError(getErrorMessage(error));
          clearProfileState();
        }
      } finally {
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    bootstrapSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      pendingAuthEventRef.current = event;
      setSession(nextSession);
      setUser(nextSession?.user ?? null);

      if (event === 'SIGNED_OUT') {
        clearProfileState();
        setAuthError(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [clearProfileState]);

  useEffect(() => {
    if (isInitializing) {
      return;
    }

    if (!user) {
      clearProfileState();
      return;
    }

    const authEvent = pendingAuthEventRef.current;
    pendingAuthEventRef.current = null;

    const timerId = window.setTimeout(() => {
      loadProfileForUser(user, authEvent);
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [clearProfileState, isInitializing, loadProfileForUser, user]);

  const signInWithGoogle = useCallback(async () => {
    setAuthError(null);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/portal`,
          queryParams: {
            hd: 'siit.tu.ac.th',
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      setAuthError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signOut();
    } finally {
      clearProfileState();
      setSession(null);
      setUser(null);
      setAuthError(null);
      setIsLoading(false);
      navigate('/', { replace: true });
    }
  }, [clearProfileState, navigate]);

  const roleLabel = userRole === 'Admin'
    ? 'Administrator'
    : userRole === 'Staff'
      ? 'Staff Member'
      : userRole === 'Student'
        ? 'Student'
        : 'Guest';

  const isAdmin = userRole === 'Admin' || userRole === 'Staff';
  const isStudent = userRole === 'Student';
  const isAuthenticated = Boolean(session?.user && userRole);

  const value = useMemo(() => ({
    session,
    user,
    profile,
    userId,
    userRole,
    userName,
    studentId,
    staffDivision,
    profileComplete,
    authError,
    isAuthenticated,
    isInitializing,
    isLoading,
    isAdmin,
    isStudent,
    roleLabel,
    signInWithGoogle,
    handleLogout,
    refreshProfile,
    setUserName,
  }), [
    session,
    user,
    profile,
    userId,
    userRole,
    userName,
    studentId,
    staffDivision,
    profileComplete,
    authError,
    isAuthenticated,
    isInitializing,
    isLoading,
    isAdmin,
    isStudent,
    roleLabel,
    signInWithGoogle,
    handleLogout,
    refreshProfile,
  ]);

  if (isInitializing) {
    return (
      <div
        className={cn(
          'flex min-h-screen items-center justify-center bg-background',
          layout.screenPaddingX
        )}
      >
        <p className="text-siit-purple font-semibold">Loading session...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
