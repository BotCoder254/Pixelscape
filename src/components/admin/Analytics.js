import { useState, useEffect } from 'react';
import {
  Box,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Progress,
  useColorModeValue
} from '@chakra-ui/react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function Analytics() {
  const [timeRange, setTimeRange] = useState('7days');
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    new: 0,
    growth: 0
  });
  const [contentStats, setContentStats] = useState({
    questions: 0,
    answers: 0,
    comments: 0,
    engagement: 0
  });
  const [topUsers, setTopUsers] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      // Fetch user statistics
      const usersQuery = query(collection(db, 'users'));
      const usersSnapshot = await getDocs(usersQuery);
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate user stats
      const now = new Date();
      const timeRangeDate = new Date();
      timeRangeDate.setDate(timeRangeDate.getDate() - (timeRange === '7days' ? 7 : 30));

      const newUsers = users.filter(user => 
        new Date(user.createdAt) > timeRangeDate
      );

      setUserStats({
        total: users.length,
        active: users.filter(user => user.lastActivity > timeRangeDate).length,
        new: newUsers.length,
        growth: ((newUsers.length / users.length) * 100).toFixed(1)
      });

      // Fetch content statistics
      const questionsQuery = query(collection(db, 'questions'));
      const answersQuery = query(collection(db, 'answers'));
      const commentsQuery = query(collection(db, 'comments'));

      const [questionsSnapshot, answersSnapshot, commentsSnapshot] = await Promise.all([
        getDocs(questionsQuery),
        getDocs(answersQuery),
        getDocs(commentsQuery)
      ]);

      setContentStats({
        questions: questionsSnapshot.size,
        answers: answersSnapshot.size,
        comments: commentsSnapshot.size,
        engagement: ((answersSnapshot.size + commentsSnapshot.size) / questionsSnapshot.size).toFixed(2)
      });

      // Fetch top users
      const topUsersData = users
        .sort((a, b) => (b.reputation || 0) - (a.reputation || 0))
        .slice(0, 5);
      setTopUsers(topUsersData);

      // Generate activity data
      const dates = Array.from({ length: timeRange === '7days' ? 7 : 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return date.toISOString().split('T')[0];
      }).reverse();

      const activityStats = dates.map(date => ({
        date,
        questions: 0,
        answers: 0,
        users: 0
      }));

      setActivityData(activityStats);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box>
      <HStack justify="space-between" mb={6}>
        <Heading size="lg">Analytics Dashboard</Heading>
        <Select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          width="200px"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </Select>
      </HStack>

      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
        <Card>
          <CardHeader>
            <Heading size="md">User Growth</Heading>
          </CardHeader>
          <CardBody>
            <Stat>
              <StatLabel>Total Users</StatLabel>
              <StatNumber>{userStats.total}</StatNumber>
              <StatHelpText>
                <StatArrow type={userStats.growth > 0 ? 'increase' : 'decrease'} />
                {userStats.growth}%
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Content Stats</Heading>
          </CardHeader>
          <CardBody>
            <Stat>
              <StatLabel>Total Questions</StatLabel>
              <StatNumber>{contentStats.questions}</StatNumber>
              <StatHelpText>
                Engagement Rate: {contentStats.engagement}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Active Users</Heading>
          </CardHeader>
          <CardBody>
            <Stat>
              <StatLabel>Active Users</StatLabel>
              <StatNumber>{userStats.active}</StatNumber>
              <Progress 
                value={(userStats.active / userStats.total) * 100} 
                size="sm" 
                colorScheme="green" 
              />
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">New Users</Heading>
          </CardHeader>
          <CardBody>
            <Stat>
              <StatLabel>New Users</StatLabel>
              <StatNumber>{userStats.new}</StatNumber>
              <StatHelpText>
                In the last {timeRange === '7days' ? '7 days' : '30 days'}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
        <Card>
          <CardHeader>
            <Heading size="md">Activity Overview</Heading>
          </CardHeader>
          <CardBody>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="questions" stroke="#8884d8" />
                  <Line type="monotone" dataKey="answers" stroke="#82ca9d" />
                  <Line type="monotone" dataKey="users" stroke="#ffc658" />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <Heading size="md">Content Distribution</Heading>
          </CardHeader>
          <CardBody>
            <Box height="300px">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Questions', value: contentStats.questions },
                      { name: 'Answers', value: contentStats.answers },
                      { name: 'Comments', value: contentStats.comments }
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </CardBody>
        </Card>
      </SimpleGrid>

      <Card>
        <CardHeader>
          <Heading size="md">Top Contributors</Heading>
        </CardHeader>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>User</Th>
                <Th>Reputation</Th>
                <Th>Questions</Th>
                <Th>Answers</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {topUsers.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.username}</Td>
                  <Td>{user.reputation || 0}</Td>
                  <Td>{user.questionCount || 0}</Td>
                  <Td>{user.answerCount || 0}</Td>
                  <Td>
                    <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </Box>
  );
} 