import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaChevronDown, FaCamera, FaImage, 
  FaDownload, FaGlobe, FaRegCompass, FaPalette,
  FaRegClock, FaMountain, FaCity, FaPortrait,
  FaUser, FaSignInAlt, FaUserPlus
} from 'react-icons/fa';
import * as UnsplashService from '../services/unsplash';
import { useAuth } from '../contexts/AuthContext';

const categories = [
  { name: 'Nature', icon: <FaMountain />, color: 'from-green-500 to-emerald-500' },
  { name: 'Architecture', icon: <FaCity />, color: 'from-blue-500 to-indigo-500' },
  { name: 'Travel', icon: <FaGlobe />, color: 'from-purple-500 to-pink-500' },
  { name: 'Portrait', icon: <FaPortrait />, color: 'from-yellow-500 to-orange-500' },
];

// Replace this URL with your static background image path
const staticBackgroundImage = "../assets/hero.jpg";

const LandingPage = () => {
  const [backgroundImages, setBackgroundImages] = useState([]);
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadBackgroundImages = async () => {
      try {
        const images = await UnsplashService.getRandomPhotos(5);
        if (images.length > 0) {
          // Preload images in the background
          images.forEach(img => {
            const image = new Image();
            image.src = img.urls.full;
          });
          setBackgroundImages(images);
        }
      } catch (error) {
        console.error('Error loading background images:', error);
      }
    };

    loadBackgroundImages();
  }, []);

  useEffect(() => {
    if (backgroundImages.length === 0) return;

    const interval = setInterval(() => {
      setCurrentBgIndex(prev => 
        prev === backgroundImages.length - 1 ? 0 : prev + 1
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (!user) {
        navigate('/login');
        return;
      }
      navigate(`/gallery?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const handleCategoryClick = (category) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/gallery?category=${category.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen relative">
      {/* Navigation Bar */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <motion.span 
                className="text-2xl font-bold text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Pixelscape
              </motion.span>
            </Link>

            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <Link 
                    to="/gallery" 
                    className="text-white/90 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <FaImage className="text-lg" />
                    <span>Gallery</span>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
                  >
                    <FaUser className="text-lg" />
                    <span>Logout</span>
                  </motion.button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-white/90 hover:text-white transition-colors flex items-center space-x-2"
                  >
                    <FaSignInAlt className="text-lg" />
                    <span>Sign In</span>
                  </Link>
                  <Link 
                    to="/signup" 
                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-full flex items-center space-x-2 transition-colors"
                  >
                    <FaUserPlus className="text-lg" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Only show on landing page */}
      {isLandingPage && (
        <div className="min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <motion.div 
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {/* Static background while loading */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
              style={{
                backgroundImage: `url(${staticBackgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: backgroundImages[currentBgIndex] ? 0 : 1
              }}
            />
            
            {/* Dynamic background from Unsplash */}
            {backgroundImages[currentBgIndex] && (
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000"
                style={{
                  backgroundImage: `url(${backgroundImages[currentBgIndex].urls.full})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 backdrop-blur-[1px]" />
          </motion.div>

          {/* Content */}
          <div className="relative z-10 text-center px-4 w-full max-w-6xl mx-auto mt-20">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 md:space-y-8"
            >
              {/* Title */}
              <motion.h1
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-white"
              >
                Pixelscape
              </motion.h1>
              
              <p className="text-lg sm:text-xl md:text-2xl text-white/90 px-4">
                Discover and download stunning high-quality images
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto px-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search images..."
                    className="w-full px-6 py-3 md:py-4 pl-12 rounded-full bg-white/10 backdrop-blur-md text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-accent/50 text-base md:text-lg border border-white/20"
                  />
                  <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70 text-xl" />
                  <button
                    type="submit"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-accent text-white px-4 md:px-6 py-1.5 md:py-2 rounded-full hover:bg-accent-dark transition-colors text-sm md:text-base"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Categories */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-4 px-4 mt-6 md:mt-8">
                {categories.map((category) => (
                  <motion.button
                    key={category.name}
                    onClick={() => handleCategoryClick(category.name)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white/10 backdrop-blur-md px-4 py-2 md:px-6 md:py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                  >
                    <div className="flex items-center space-x-2 text-white">
                      <span className="text-lg md:text-xl group-hover:text-accent transition-colors">
                        {category.icon}
                      </span>
                      <span className="text-sm md:text-base">{category.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Scroll Indicator - Only show on landing page */}
          <motion.div
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 z-20 cursor-pointer hidden md:flex flex-col items-center space-y-2"
            onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          >
            <span className="text-sm font-light">Scroll Down</span>
            <FaChevronDown className="text-2xl animate-bounce" />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default LandingPage; 