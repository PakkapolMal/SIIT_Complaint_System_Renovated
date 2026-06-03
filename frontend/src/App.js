import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/layout/ScrollToTop';
import { AuthProvider, useAuth } from './contexts/AuthProvider';
import { NavigationContext } from './contexts.js';

import MenuAnonymous from './components/MenuAnonymous';
import OverallResponseView from './components/OverallResponseView';
import ComplaintStart from './components/ComplaintStart';
import UserMenu from './components/UserMenu';
import UserHistory from './components/UserHistory';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import ThankYouPage from './components/ThankYouPage';
import AdminMenu from './components/AdminMenu';
import AdminResponseSheet from './components/AdminResponseSheet';
import SubmissionDetail from './components/SubmissionDetail';
import AdminResponsePage from './components/AdminResponsePage';

function ProtectedRoute({ children, requireAdmin = false, requireStudent = false, requireProfileComplete = false }) {
  const { isAuthenticated, isAdmin, isStudent, profileComplete } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to={isStudent ? '/portal' : '/login'} replace />;
  }

  if (requireStudent && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (requireProfileComplete && isStudent && !profileComplete) {
    return <Navigate to="/signup" replace />;
  }

  return children;
}

const AppRoutes = () => {
  const auth = useAuth();

  return (
    <NavigationContext.Provider value={null}>
      <Routes>
        <Route path="/" element={<MenuAnonymous />} />
        <Route path="/overall-view" element={<OverallResponseView />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/signup"
          element={
            auth.session?.user
              ? <SignupPage />
              : <Navigate to="/login" replace />
          }
        />
        <Route path="/view-detail/:submissionID" element={<SubmissionDetail />} />

        <Route
          path="/portal"
          element={
            <ProtectedRoute requireStudent requireProfileComplete>
              <UserMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-history"
          element={
            <ProtectedRoute requireStudent requireProfileComplete>
              <UserHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/topics"
          element={
            <ProtectedRoute requireProfileComplete>
              <ComplaintStart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/thankyou"
          element={
            <ProtectedRoute requireProfileComplete>
              <ThankYouPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute requireAdmin>
              <AdminResponseSheet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/respond/:submissionID"
          element={
            <ProtectedRoute requireAdmin>
              <AdminResponsePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </NavigationContext.Provider>
  );
};

const AppWrapper = () => (
  <Router>
    <ScrollToTop />
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </Router>
);

export default AppWrapper;
