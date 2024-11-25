import { useState, useCallback } from 'react';
import { unsplashApi } from '../config/unsplash';

export const useUnsplash = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getRandomPhotos = useCallback(async (options) => {
    setLoading(true);
    setError(null);
    try {
      const result = await unsplashApi.photos.getRandom(options);
      if (result.type === 'success') {
        return result.response;
      }
      throw new Error('Failed to fetch photos');
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const searchPhotos = useCallback(async (query, page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const result = await unsplashApi.search.getPhotos({
        query,
        page,
        perPage: 30,
      });
      if (result.type === 'success') {
        return result.response.results;
      }
      throw new Error('Failed to search photos');
    } catch (err) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getRandomPhotos,
    searchPhotos
  };
}; 