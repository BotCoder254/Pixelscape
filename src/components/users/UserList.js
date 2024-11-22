import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  Box,
  SimpleGrid,
  VStack,
  HStack,
  Text,
  Avatar,
  Link,
  Badge,
  useColorModeValue,
  Skeleton,
  Input,
  Select,
  Flex
} from '@chakra-ui/react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('reputation');
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersQuery = query(collection(db, 'users'), orderBy(sortBy, 'desc'));
        const snapshot = await getDocs(usersQuery);
        const usersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [sortBy]);

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} height="200px" />
        ))}
      </SimpleGrid>
    );
  }

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold" mb={6}>Community Members</Text>
      
      <Flex gap={4} mb={6} direction={{ base: 'column', md: 'row' }}>
        <Input
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW={{ base: 'full', md: '300px' }}
        />
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          maxW={{ base: 'full', md: '200px' }}
        >
          <option value="reputation">Reputation</option>
          <option value="createdAt">Join Date</option>
          <option value="username">Username</option>
        </Select>
      </Flex>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {filteredUsers.map((user) => (
          <Box
            key={user.id}
            p={6}
            borderWidth={1}
            borderRadius="lg"
            bg={bgColor}
            borderColor={borderColor}
            boxShadow="sm"
            _hover={{ boxShadow: 'md' }}
            transition="all 0.2s"
          >
            <VStack align="start" spacing={4}>
              <HStack spacing={4} width="full">
                <Avatar
                  size="lg"
                  src={user.avatarUrl}
                  name={user.username}
                />
                <VStack align="start" spacing={1}>
                  <Link
                    as={RouterLink}
                    to={`/user/${user.id}`}
                    fontSize="lg"
                    fontWeight="semibold"
                    color="blue.500"
                    _hover={{ color: 'blue.600' }}
                  >
                    {user.username}
                  </Link>
                  <Badge colorScheme={user.role === 'admin' ? 'red' : 'blue'}>
                    {user.role}
                  </Badge>
                </VStack>
              </HStack>

              <VStack align="start" spacing={1} width="full">
                <Text fontSize="sm" color="gray.500">
                  Reputation: {user.reputation || 0}
                </Text>
                <Text fontSize="sm" color="gray.500">
                  Member since: {new Date(user.createdAt).toLocaleDateString()}
                </Text>
              </VStack>

              {user.bio && (
                <Text fontSize="sm" noOfLines={2}>
                  {user.bio}
                </Text>
              )}
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
} 