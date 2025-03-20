import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiHome, 
  HiPhotograph, 
  HiMenuAlt2, 
  HiX,
  HiChevronRight,
  HiLogout 
} from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const navItems = [
    { title: 'Home', icon: <HiHome />, path: '/' },
    { title: 'Gallery', icon: <HiPhotograph />, path: '/gallery' },
  ];

  const sidebarVariants = {
    open: { 
      width: '240px',
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    },
    closed: { 
      width: '0px',
      transition: { 
        duration: 0.3,
        ease: "easeInOut"
      }
    }
  };

  const contentVariants = {
    open: { 
      opacity: 1,
      x: 0,
      display: "block",
      transition: { delay: 0.2 }
    },
    closed: { 
      opacity: 0,
      x: -10,
      transitionEnd: {
        display: "none"
      }
    }
  };

  // Floating button when sidebar is closed
  const floatingButton = {
    open: { x: 0 },
    closed: { x: 20 }
  };

  return (
    <>
      <motion.div
        initial="open"
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed left-0 top-0 h-screen bg-white shadow-xl z-50 overflow-hidden"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`absolute ${isOpen ? 'right-4' : '-right-10'} top-4 bg-accent p-2 rounded-full text-white hover:bg-accent-dark transition-all duration-300`}
        >
          {isOpen ? <HiX /> : <HiMenuAlt2 />}
        </button>

        <motion.div
          variants={contentVariants}
          className="flex flex-col h-full py-8 px-4"
        >
          <div className="mb-8">
            <h1 className="text-xl font-bold text-text-primary">Pixelscape</h1>
          </div>

          <nav className="flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-accent text-white'
                    : 'text-text-secondary hover:bg-secondary hover:text-text-primary'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="ml-4">{item.title}</span>
              </Link>
            ))}
          </nav>

          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 mb-2 rounded-lg transition-all duration-300 text-text-secondary hover:bg-secondary hover:text-text-primary"
            >
              <span className="text-xl"><HiLogout /></span>
              <span className="ml-4">Logout</span>
            </button>
          )}
        </motion.div>
      </motion.div>

      {/* Floating expand button when sidebar is closed */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial="closed"
            animate="closed"
            exit="open"
            variants={floatingButton}
            onClick={() => setIsOpen(true)}
            className="fixed left-0 top-4 z-50 bg-accent hover:bg-accent-dark text-white p-2 rounded-r-lg shadow-lg transition-colors"
          >
            <HiChevronRight className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar; 