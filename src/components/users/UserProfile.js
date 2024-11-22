import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/config';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  Skeleton,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Link
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { TimeAgo } from '../utils/TimeAgo';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    async function fetchUserData() {
      try {
        // Fetch user data
        const userDoc = await getDoc(doc(db, 'users', id));
        if (userDoc.exists()) {
          setUser({ id: userDoc.id, ...userDoc.data() });
        }

        // Fetch user's questions
        const questionsQuery = query(collection(db, 'questions'), where('userId', '==', id));
        const questionsSnapshot = await getDocs(questionsQuery);
        const questionsList = questionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setQuestions(questionsList);

        // Fetch user's answers
        const answersQuery = query(collection(db, 'answers'), where('userId', '==', id));
        const answersSnapshot = await getDocs(answersQuery);
        const answersList = answersSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setAnswers(answersList);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [id]);

  if (loading) {
    return (
      <VStack spacing={8}>
        <Skeleton height="200px" width="full" />
        <Skeleton height="400px" width="full" />
      </VStack>
    );
  }

  if (!user) {
    return <Text>User not found</Text>;
  }

  return (
    <Box>
      <Box
        p={6}
        borderWidth={1}
        borderRadius="lg"
        bg={bgColor}
        borderColor={borderColor}
        boxShadow="lg"
        mb={8}
      >
        <HStack spacing={8} align="start">
          <Avatar
            size="2xl"
            src={user.avatarUrl}
            name={user.username}
          />
          <VStack align="start" spacing={4}>
            <VStack align="start" spacing={1}>
              <Text fontSize="3xl" fontWeight="bold">
                {user.username}
              </Text>
              <Badge colorScheme={user.role === 'admin' ? 'red' : 'blue'}>
                {user.role}
              </Badge>
            </VStack>

            {user.bio && (
              <Text color="gray.600" _dark={{ color: 'gray.300' }}>
                {user.bio}
              </Text>
            )}

            <Text fontSize="sm" color="gray.500">
              Member since {new Date(user.createdAt).toLocaleDateString()}
            </Text>
          </VStack>
        </HStack>
      </Box>

      <StatGroup mb={8}>
        <Stat>
          <StatLabel>Reputation</StatLabel>
          <StatNumber>{user.reputation || 0}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Questions</StatLabel>
          <StatNumber>{questions.length}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>Answers</StatLabel>
          <StatNumber>{answers.length}</StatNumber>
        </Stat>
      </StatGroup>

      <Tabs variant="enclosed">
        <TabList>
          <Tab>Questions</Tab>
          <Tab>Answers</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <VStack spacing={4} align="stretch">
              {questions.map((question) => (
                <Box
                  key={question.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  bg={bgColor}
                  borderColor={borderColor}
                >
                  <Link
                    as={RouterLink}
                    to={`/question/${question.id}`}
                    fontSize="lg"
                    fontWeight="semibold"
                    color="blue.500"
                    _hover={{ color: 'blue.600' }}
                  >
                    {question.title}
                  </Link>
                  <HStack mt={2} spacing={4}>
                    <Text fontSize="sm" color="gray.500">
                      Votes: {question.votes}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Answers: {question.answers?.length || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Asked <TimeAgo date={question.createdAt?.toDate()} />
                    </Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={4} align="stretch">
              {answers.map((answer) => (
                <Box
                  key={answer.id}
                  p={4}
                  borderWidth={1}
                  borderRadius="md"
                  bg={bgColor}
                  borderColor={borderColor}
                >
                  <Text noOfLines={3}>{answer.content}</Text>
                  <HStack mt={2} spacing={4}>
                    <Text fontSize="sm" color="gray.500">
                      Votes: {answer.votes}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      Answered <TimeAgo date={answer.createdAt?.toDate()} />
                    </Text>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
} 