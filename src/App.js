import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import Gallery from './pages/Gallery';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import ResetPassword from './components/auth/ResetPassword';
import AuthLayout from './components/layouts/AuthLayout';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/reset-password'].includes(location.pathname);
  const isLandingPage = location.pathname === '/';

  // Render auth pages with AuthLayout
  if (isAuthPage) {
    return (
      <AuthLayout>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </AuthLayout>
    );
  }

  return (
    <div className="bg-primary min-h-screen text-text-primary">
      {/* Show Sidebar only on desktop and when not on landing page */}
      <div className="hidden md:block">
        {!isLandingPage && <Sidebar />}
      </div>

      {/* Main Content */}
      <main className={`${!isLandingPage ? "md:ml-[240px]" : ""} pb-16 md:pb-0`}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Show Mobile Navigation when not on landing page */}
      {!isLandingPage && <MobileNav />}

      {/* Show Footer only on landing page */}
      {isLandingPage && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
};

export default App;
