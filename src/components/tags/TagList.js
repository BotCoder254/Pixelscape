import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  Box,
  SimpleGrid,
  VStack,
  Text,
  Link,
  Badge,
  useColorModeValue,
  Skeleton
} from '@chakra-ui/react';

export default function TagList() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    async function fetchTags() {
      try {
        const tagsMap = new Map();
        const questionsQuery = query(collection(db, 'questions'));
        const snapshot = await getDocs(questionsQuery);
        
        snapshot.forEach(doc => {
          const question = doc.data();
          question.tags.forEach(tag => {
            if (tagsMap.has(tag)) {
              tagsMap.set(tag, tagsMap.get(tag) + 1);
            } else {
              tagsMap.set(tag, 1);
            }
          });
        });

        const tagsList = Array.from(tagsMap.entries()).map(([name, count]) => ({
          name,
          count
        }));

        setTags(tagsList.sort((a, b) => b.count - a.count));
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTags();
  }, []);

  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} height="100px" />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>Tags</Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {tags.map((tag) => (
          <Box
            key={tag.name}
            p={5}
            borderWidth={1}
            borderRadius="lg"
            bg={bgColor}
            borderColor={borderColor}
            boxShadow="sm"
            _hover={{ boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <VStack align="start" spacing={2}>
              <Link
                as={RouterLink}
                to={`/?tag=${tag.name}`}
                fontSize="lg"
                fontWeight="semibold"
                color="blue.500"
                _hover={{ color: 'blue.600' }}
              >
                {tag.name}
              </Link>
              <Badge colorScheme="blue">
                {tag.count} {tag.count === 1 ? 'question' : 'questions'}
              </Badge>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
} 