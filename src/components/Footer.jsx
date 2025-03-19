import React from 'react';
import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';

const Footer = () => {
  const { user } = useAuth();

  return (
    <footer className="bg-white text-text-primary py-12 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-accent">Pixelscape</h3>
            <p className="text-text-secondary">
              Discover and download stunning high-quality images for your creative projects.
            </p>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/gallery" className="text-text-secondary hover:text-accent transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link to="/" className="text-text-secondary hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              {!user ? (
                <>
                  <li>
                    <Link to="/login" className="text-text-secondary hover:text-accent transition-colors">
                      Sign In
                    </Link>
                  </li>
                  <li>
                    <Link to="/signup" className="text-text-secondary hover:text-accent transition-colors">
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link to="/gallery" className="text-text-secondary hover:text-accent transition-colors">
                    My Collection
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-text-secondary hover:text-accent transition-colors">
                  License
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-text-secondary hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <FaTwitter size={24} />
              </a>
              <a 
                href="#" 
                className="text-text-secondary hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram size={24} />
              </a>
              <a 
                href="#" 
                className="text-text-secondary hover:text-accent transition-colors"
                aria-label="GitHub"
              >
                <FaGithub size={24} />
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200 text-center text-text-secondary">
          <p>&copy; {new Date().getFullYear()} Pixelscape. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 