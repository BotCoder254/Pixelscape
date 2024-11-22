import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, getDocs, startAfter, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useSearch(collectionName) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState(null);
  const [searchParams, setSearchParams] = useState({
    searchTerm: '',
    sortBy: 'newest',
    filters: {
      tags: [],
      timeRange: 'all'
    }
  });

  const buildQuery = (isLoadMore = false) => {
    let baseQuery = collection(db, collectionName);
    let constraints = [];

    // Search term
    if (searchParams.searchTerm) {
      constraints.push(where('title', '>=', searchParams.searchTerm));
      constraints.push(where('title', '<=', searchParams.searchTerm + '\uf8ff'));
    }

    // Tags filter
    if (searchParams.filters.tags.length > 0) {
      constraints.push(where('tags', 'array-contains-any', searchParams.filters.tags));
    }

    // Time range filter
    if (searchParams.filters.timeRange !== 'all') {
      const date = new Date();
      switch (searchParams.filters.timeRange) {
        case 'today':
          date.setHours(0, 0, 0, 0);
          break;
        case 'week':
          date.setDate(date.getDate() - 7);
          break;
        case 'month':
          date.setMonth(date.getMonth() - 1);
          break;
        default:
          break;
      }
      constraints.push(where('createdAt', '>=', date));
    }

    // Sorting
    switch (searchParams.sortBy) {
      case 'votes':
        constraints.push(orderBy('votes', 'desc'));
        break;
      case 'answers':
        constraints.push(orderBy('answers.length', 'desc'));
        break;
      case 'unanswered':
        constraints.push(where('answers.length', '==', 0));
        break;
      default:
        constraints.push(orderBy('createdAt', 'desc'));
    }

    // Pagination
    if (isLoadMore && lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    constraints.push(limit(10));

    return query(baseQuery, ...constraints);
  };

  const search = async (newParams = null) => {
    if (newParams) {
      setSearchParams(newParams);
      setLastDoc(null);
      setHasMore(true);
    }

    setLoading(true);
    try {
      const q = buildQuery();
      const snapshot = await getDocs(q);
      
      const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setItems(results);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 10);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const q = buildQuery(true);
      const snapshot = await getDocs(q);
      
      const newResults = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setItems(prev => [...prev, ...newResults]);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
      setHasMore(snapshot.docs.length === 10);
    } catch (error) {
      console.error('Load more error:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    hasMore,
    search,
    loadMore,
    searchParams,
    setSearchParams
  };
} 