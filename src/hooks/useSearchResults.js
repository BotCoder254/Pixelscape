import { useState, useEffect } from 'react';
import { useSearch } from './useSearch';

export function useSearchResults(collectionName) {
  const {
    items,
    loading,
    hasMore,
    search,
    loadMore,
    searchParams,
    setSearchParams
  } = useSearch(collectionName);

  const [filteredItems, setFilteredItems] = useState([]);
  const [groupedResults, setGroupedResults] = useState({});

  useEffect(() => {
    // Group results by type or category
    const grouped = items.reduce((acc, item) => {
      const type = item.type || 'other';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {});
    setGroupedResults(grouped);

    // Apply additional filtering if needed
    const filtered = items.filter(item => {
      // Add any additional filtering logic here
      return true;
    });
    setFilteredItems(filtered);
  }, [items]);

  const handleSearch = async (newParams) => {
    await search(newParams);
  };

  const handleLoadMore = async () => {
    await loadMore();
  };

  return {
    results: filteredItems,
    groupedResults,
    loading,
    hasMore,
    searchParams,
    setSearchParams,
    handleSearch,
    handleLoadMore
  };
} 