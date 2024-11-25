import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiHome, HiPhotograph } from 'react-icons/hi';

const MobileNav = () => {
  const location = useLocation();

  const navItems = [
    { title: 'Home', icon: <HiHome className="text-2xl" />, path: '/' },
    { title: 'Gallery', icon: <HiPhotograph className="text-2xl" />, path: '/gallery' },
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 z-50"
    >
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
              location.pathname === item.path
                ? 'text-accent'
                : 'text-gray-500 hover:text-accent'
            }`}
          >
            {item.icon}
            <span className="text-xs">{item.title}</span>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default MobileNav; 