import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getRandomPhotos } from '../../services/unsplash';

export default function AuthLayout({ children }) {
  const [photos, setPhotos] = useState([]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    const fetchPhotos = async () => {
      const fetchedPhotos = await getRandomPhotos(5, 'nature landscape minimal');
      setPhotos(fetchedPhotos);
    };
    fetchPhotos();
  }, []);

  useEffect(() => {
    if (photos.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => 
        prevIndex === photos.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [photos]);

  return (
    <div className="flex min-h-screen">
      {/* Left side - Image Carousel */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <AnimatePresence mode="wait">
          {photos[currentPhotoIndex] && (
            <motion.div
              key={photos[currentPhotoIndex].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-black/10 z-10" />
              <img
                src={photos[currentPhotoIndex].urls.regular}
                alt={photos[currentPhotoIndex].alt_description}
                className="object-cover w-full h-full"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white z-20">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="max-w-lg mx-auto"
                >
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                    className="text-sm"
                  >
                    Photo by{' '}
                    <a
                      href={photos[currentPhotoIndex].user.links.html}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-gray-200 transition-colors"
                    >
                      {photos[currentPhotoIndex].user.name}
                    </a>{' '}
                    on{' '}
                    <a
                      href="https://unsplash.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-gray-200 transition-colors"
                    >
                      Unsplash
                    </a>
                  </motion.p>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md mx-auto px-6 py-12 flex flex-col justify-center min-h-screen lg:min-h-0"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
} 