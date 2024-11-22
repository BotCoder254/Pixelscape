import { useEffect, useRef, useCallback } from 'react';
import { Box, VStack } from '@chakra-ui/react';
import LiquidLoader from './LiquidLoader';

export default function InfiniteScroll({
  children,
  loading,
  hasMore,
  onLoadMore,
  loadingComponent = <LiquidLoader />,
  threshold = 100
}) {
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    }, {
      rootMargin: `${threshold}px`
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore, threshold]);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  return (
    <VStack spacing={4} align="stretch" w="100%">
      {children}
      {hasMore && (
        <Box ref={lastElementRef} py={4} textAlign="center">
          {loading && loadingComponent}
        </Box>
      )}
    </VStack>
  );
} 