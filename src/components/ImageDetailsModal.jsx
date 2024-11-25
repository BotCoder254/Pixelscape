import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiHeart, HiDownload, HiUser, HiPhotograph } from 'react-icons/hi';
import { useAuth } from '../contexts/AuthContext';

const ImageDetailsModal = ({ image, onClose, onFavorite, isFavorited }) => {
  const { currentUser } = useAuth();

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.8 }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(image.urls.full);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${image.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-secondary rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Image Details</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <HiX className="text-white text-xl" />
            </button>
          </div>

          <div className="p-4">
            <div className="relative">
              <img
                src={image.urls.regular}
                alt={image.alt_description}
                className="w-full rounded-lg"
              />
              <div className="absolute top-4 right-4 flex space-x-2">
                {currentUser && (
                  <button
                    onClick={onFavorite}
                    className={`p-2 rounded-full ${
                      isFavorited ? 'bg-accent' : 'bg-white'
                    }`}
                  >
                    <HiHeart className={`text-xl ${
                      isFavorited ? 'text-white' : 'text-gray-800'
                    }`} />
                  </button>
                )}
                <button
                  onClick={handleDownload}
                  className="p-2 rounded-full bg-white"
                >
                  <HiDownload className="text-xl text-gray-800" />
                </button>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              <div className="flex items-center space-x-4">
                <img
                  src={image.user.profile_image.medium}
                  alt={image.user.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-white font-medium">{image.user.name}</h3>
                  <a
                    href={image.user.links.html}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline text-sm"
                  >
                    @{image.user.username}
                  </a>
                </div>
              </div>

              {image.description && (
                <p className="text-gray-300">{image.description}</p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <HiPhotograph />
                    <span>Dimensions</span>
                  </div>
                  <p className="text-white mt-1">
                    {image.width} x {image.height}
                  </p>
                </div>
                <div className="bg-primary p-4 rounded-lg">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <HiUser />
                    <span>Downloads</span>
                  </div>
                  <p className="text-white mt-1">{image.downloads || 0}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ImageDetailsModal; 