import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as UnsplashService from '../services/unsplash';
import { HiDownload, HiSearch } from 'react-icons/hi';
import { useInView } from 'react-intersection-observer';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import ImageModal from '../components/ImageModal';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ref, inView] = useInView();
  const [selectedImage, setSelectedImage] = useState(null);
  const [error, setError] = useState(null);

  const fetchImages = async (pageNum) => {
    setLoading(true);
    try {
      let data;
      if (searchQuery) {
        data = await UnsplashService.searchPhotos(searchQuery, pageNum);
        if (data && data.results) {
          setImages(prev => pageNum === 1 ? data.results : [...prev, ...data.results]);
        }
      } else {
        data = await UnsplashService.getPhotos(pageNum);
        if (Array.isArray(data)) {
          setImages(prev => pageNum === 1 ? data : [...prev, ...data]);
        }
      }
      setError(null);
    } catch (error) {
      console.error('Error fetching images:', error);
      setError('Failed to load images. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchImages(1);
  }, [searchQuery]);

  useEffect(() => {
    if (inView && !loading && page > 1) {
      fetchImages(page);
    }
  }, [inView, page]);

  useEffect(() => {
    if (inView && !loading) {
      setPage(prev => prev + 1);
    }
  }, [inView]);

  const handleDownload = async (image) => {
    try {
      const response = await fetch(image.urls.full);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pixelscape-${image.id}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-primary to-secondary min-h-screen">
      {/* Search Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto mb-8 md:mb-12"
      >
        <div className="relative">
          <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
          <input
            type="text"
            placeholder="Search for images..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 md:py-4 rounded-xl bg-white shadow-lg text-dark focus:outline-none focus:ring-2 focus:ring-accent text-base md:text-lg"
          />
        </div>
      </motion.div>

      {/* Error Message */}
      {error && (
        <div className="text-red-500 text-center mb-4">
          {error}
        </div>
      )}

      {/* Images Grid */}
      {Array.isArray(images) && images.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 max-w-7xl mx-auto space-y-4">
          {images.map((image, index) => (
            <motion.div
              key={`${image.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="relative break-inside-avoid"
            >
              <div 
                className="relative group rounded-xl overflow-hidden bg-white shadow-lg cursor-pointer"
                onClick={() => setSelectedImage(image)}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <img
                    src={image.urls.regular}
                    alt={image.alt_description}
                    className="w-full object-cover transition-transform duration-300"
                    style={{ 
                      minHeight: `${Math.random() * 200 + 200}px`,
                      backgroundColor: image.color || '#f3f4f6'
                    }}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div className="text-white">
                        <p className="font-medium truncate text-sm md:text-base">{image.user.name}</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(image);
                        }}
                        className="p-2 bg-white/90 rounded-full text-dark hover:bg-white transition-colors"
                      >
                        <HiDownload className="text-lg md:text-xl" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : !loading ? (
        <div className="text-center text-gray-500 py-20">
          <p className="text-lg md:text-xl">No images found</p>
          <p className="mt-2">Try a different search term</p>
        </div>
      ) : null}

      {/* Loading Indicator */}
      {loading && (
        <div className="flex justify-center mt-8">
          <motion.div 
            className="relative w-24 h-24"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-accent rounded-full border-t-transparent animate-spin"></div>
          </motion.div>
        </div>
      )}
      
      {/* Image Modal */}
      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
          onDownload={handleDownload}
        />
      )}
      
      <div ref={ref} className="h-10" />
    </div>
  );
};

export default Gallery; 