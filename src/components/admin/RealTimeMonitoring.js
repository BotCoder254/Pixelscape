import { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  useColorModeValue,
  Icon,
  Flex
} from '@chakra-ui/react';
import { collection, query, onSnapshot, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiActivity, FiUsers, FiMessageSquare, FiFlag } from 'react-icons/fi';
import { TimeAgo } from '../utils/TimeAgo';

export default function RealTimeMonitoring() {
  const [stats, setStats] = useState({
    activeUsers: 0,
    newQuestions: 0,
    newAnswers: 0,
    pendingReports: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    // Monitor active users
    const userStatusRef = collection(db, 'userStatus');
    const activeUsersQuery = query(userStatusRef, where('status', '==', 'online'));
    
    const unsubscribeUsers = onSnapshot(activeUsersQuery, (snapshot) => {
      setOnlineUsers(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })));
      setStats(prev => ({ ...prev, activeUsers: snapshot.size }));
    });

    // Monitor recent questions
    const questionsRef = collection(db, 'questions');
    const recentQuestionsQuery = query(questionsRef, orderBy('createdAt', 'desc'), limit(5));
    
    const unsubscribeQuestions = onSnapshot(recentQuestionsQuery, (snapshot) => {
      const questions = snapshot.docs.map(doc => ({
        id: doc.id,
        type: 'question',
        ...doc.data()
      }));
      updateRecentActivity(questions);
    });

    // Monitor reports
    const reportsRef = collection(db, 'reports');
    const pendingReportsQuery = query(reportsRef, where('status', '==', 'pending'));
    
    const unsubscribeReports = onSnapshot(pendingReportsQuery, (snapshot) => {
      setStats(prev => ({ ...prev, pendingReports: snapshot.size }));
    });

    return () => {
      unsubscribeUsers();
      unsubscribeQuestions();
      unsubscribeReports();
    };
  }, []);

  const updateRecentActivity = (newActivity) => {
    setRecentActivity(prev => {
      const combined = [...newActivity, ...prev];
      const unique = combined.filter((item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
      );
      return unique.slice(0, 10);
    });
  };

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Active Users</StatLabel>
              <StatNumber>{stats.activeUsers}</StatNumber>
              <StatHelpText>Currently online</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>New Questions (24h)</StatLabel>
              <StatNumber>{stats.newQuestions}</StatNumber>
              <Progress value={(stats.newQuestions / 100) * 100} size="sm" colorScheme="blue" />
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>New Answers (24h)</StatLabel>
              <StatNumber>{stats.newAnswers}</StatNumber>
              <Progress value={(stats.newAnswers / 100) * 100} size="sm" colorScheme="green" />
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Pending Reports</StatLabel>
              <StatNumber>{stats.pendingReports}</StatNumber>
              <StatHelpText color="red.500">Needs attention</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
        <Card>
          <CardBody>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Recent Activity</Text>
            <VStack spacing={4} align="stretch">
              {recentActivity.map((activity) => (
                <HStack key={activity.id} spacing={4}>
                  <Icon 
                    as={activity.type === 'question' ? FiMessageSquare : FiActivity}
                    color={activity.type === 'question' ? 'blue.500' : 'green.500'}
                  />
                  <Box flex={1}>
                    <Text fontSize="sm" noOfLines={1}>{activity.title || activity.content}</Text>
                    <Text fontSize="xs" color="gray.500">
                      by {activity.username} • <TimeAgo date={activity.createdAt?.toDate()} />
                    </Text>
                  </Box>
                  <Badge colorScheme={activity.type === 'question' ? 'blue' : 'green'}>
                    {activity.type}
                  </Badge>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Online Users</Text>
            <VStack spacing={2} align="stretch">
              {onlineUsers.map((user) => (
                <HStack key={user.id} spacing={4}>
                  <Icon as={FiUsers} color="green.500" />
                  <Text flex={1}>{user.username}</Text>
                  <Badge colorScheme="green">online</Badge>
                </HStack>
              ))}
            </VStack>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  );
} 