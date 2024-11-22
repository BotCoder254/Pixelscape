import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Heading,
  Text,
  HStack,
  Avatar,
  Button,
  useColorModeValue,
  Skeleton,
  Flex,
  Badge,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FiFilter, FiPlus } from 'react-icons/fi';
import { useSearchResults } from '../../hooks/useSearchResults';
import SearchBar from '../shared/SearchBar';
import { TimeAgo } from '../utils/TimeAgo';
import QuestionTags from '../shared/QuestionTags';
// Add Firebase imports
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function QuestionList() {
  const {
    results: questions,
    loading,
    hasMore,
    searchParams,
    setSearchParams,
    handleSearch,
    handleLoadMore
  } = useSearchResults('questions');
  const [availableTags, setAvailableTags] = useState([]);
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const tagsSnapshot = await getDocs(collection(db, 'tags'));
        const tagsList = tagsSnapshot.docs.map(doc => doc.data().name);
        setAvailableTags(tagsList);
      } catch (error) {
        console.error('Error fetching tags:', error);
      }
    };
    fetchTags();
  }, []);

  const handleFilterChange = (type, value) => {
    if (type === 'tags') {
      const updatedTags = searchParams.filters.tags.includes(value)
        ? searchParams.filters.tags.filter(t => t !== value)
        : [...searchParams.filters.tags, value];
      
      setSearchParams({
        ...searchParams,
        filters: {
          ...searchParams.filters,
          tags: updatedTags
        }
      });
    } else if (type === 'timeRange') {
      setSearchParams({
        ...searchParams,
        filters: {
          ...searchParams.filters,
          timeRange: value
        }
      });
    }
  };

  const handleTagRemove = (tagToRemove) => {
    const updatedTags = searchParams.filters.tags.filter(tag => tag !== tagToRemove);
    setSearchParams({
      ...searchParams,
      filters: {
        ...searchParams.filters,
        tags: updatedTags
      }
    });
  };

  return (
    <Box>
      <Flex justify="space-between" align="center" mb={6}>
        <Heading size="lg">Questions</Heading>
        <Button
          as={RouterLink}
          to="/ask"
          colorScheme="blue"
          leftIcon={<FiPlus />}
        >
          Ask Question
        </Button>
      </Flex>

      <SearchBar
        searchTerm={searchParams.searchTerm}
        onSearchChange={(value) => {
          setSearchParams({
            ...searchParams,
            searchTerm: value
          });
          handleSearch();
        }}
        sortBy={searchParams.sortBy}
        onSortChange={(value) => {
          setSearchParams({
            ...searchParams,
            sortBy: value
          });
          handleSearch();
        }}
        filters={{
          tags: availableTags,
          selectedTags: searchParams.filters.tags
        }}
        onFilterChange={handleFilterChange}
        isLoading={loading}
      />

      {searchParams.filters.tags.length > 0 && (
        <Box mb={4}>
          <QuestionTags 
            tags={searchParams.filters.tags} 
            onRemoveTag={handleTagRemove} 
            isEditable={true} 
          />
        </Box>
      )}

      {/* Rest of the component remains the same */}
    </Box>
  );
} 






