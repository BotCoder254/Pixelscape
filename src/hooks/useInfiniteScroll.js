import { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, startAfter, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useInfiniteScroll(collectionName, itemsPerPage = 10, queryConstraints = []) {
  const [items, setItems] = useState([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  const loadInitialItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, collectionName),
        ...queryConstraints,
        orderBy('createdAt', 'desc'),
        limit(itemsPerPage)
      );

      const snapshot = await getDocs(q);
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setItems(docs);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === itemsPerPage);
    } catch (err) {
      setError(err.message);
      console.error('Error loading items:', err);
    } finally {
      setLoading(false);
    }
  }, [collectionName, itemsPerPage, queryConstraints]);

  const loadMore = async () => {
    if (!hasMore || loading || !lastDoc) return;

    setLoading(true);
    try {
      const q = query(
        collection(db, collectionName),
        ...queryConstraints,
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(itemsPerPage)
      );

      const snapshot = await getDocs(q);
      const newDocs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setItems(prev => [...prev, ...newDocs]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === itemsPerPage);
    } catch (err) {
      setError(err.message);
      console.error('Error loading more items:', err);
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    setItems([]);
    setLastDoc(null);
    setHasMore(true);
    loadInitialItems();
  };

  useEffect(() => {
    loadInitialItems();
  }, [loadInitialItems]);

  return {
    items,
    loading,
    hasMore,
    error,
    loadMore,
    refresh
  };
} 