import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiDownload, HiUser, HiHeart } from 'react-icons/hi';

const ImageModal = ({ image, onClose, onDownload }) => {
  if (!image) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative max-w-6xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/50 to-transparent z-10 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img
                src={image.user.profile_image.medium}
                alt={image.user.name}
                className="w-10 h-10 rounded-full border-2 border-white"
              />
              <div className="text-white">
                <p className="font-medium">{image.user.name}</p>
                <a
                  href={image.user.links.html}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm opacity-75 hover:opacity-100"
                >
                  @{image.user.username}
                </a>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-colors"
            >
              <HiX className="text-white text-xl" />
            </button>
          </div>

          {/* Image */}
          <div className="relative aspect-auto max-h-[80vh] overflow-hidden">
            <img
              src={image.urls.regular}
              alt={image.alt_description}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Footer */}
          <div className="p-4 bg-white">
            <div className="flex justify-between items-center">
              <div>
                {image.description && (
                  <p className="text-gray-700 mb-2">{image.description}</p>
                )}
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span>
                    <HiHeart className="inline mr-1" />
                    {image.likes} likes
                  </span>
                  <span>
                    <HiUser className="inline mr-1" />
                    {image.views || 0} views
                  </span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onDownload(image)}
                className="px-6 py-2 bg-accent text-white rounded-full hover:bg-accent-dark transition-colors flex items-center space-x-2"
              >
                <HiDownload className="text-xl" />
                <span>Download</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal; 