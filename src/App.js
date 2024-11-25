import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import LandingPage from './pages/LandingPage';
import Gallery from './pages/Gallery';

const AppContent = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

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
          <Route path="/gallery" element={<Gallery />} />
          <Route path="*" element={<LandingPage />} />
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
        <AppContent />
      </Router>
    </ErrorBoundary>
  );
};

export default App;
