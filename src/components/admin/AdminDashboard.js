import { useState, useEffect } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  useColorModeValue,
  Flex,
  Heading,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Button
} from '@chakra-ui/react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FiUsers, FiMessageSquare, FiAlertCircle } from 'react-icons/fi';
import Analytics from './Analytics';
import UserManagement from './UserManagement';
import ContentManagement from './ContentManagement';
import ReportsManagement from './ReportsManagement';
import RealTimeMonitoring from './RealTimeMonitoring';
import RoleManagement from './RoleManagement';
import RoleBasedComponent from '../shared/RoleBasedComponent';
import { ROLES } from '../../utils/roles';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    pendingReports: 0,
    userGrowth: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    // Real-time stats monitoring
    const unsubscribers = [];

    // Monitor users
    const usersQuery = query(collection(db, 'users'));
    unsubscribers.push(
      onSnapshot(usersQuery, (snapshot) => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const newUsers = users.filter(user => 
          new Date(user.createdAt) > thirtyDaysAgo
        );

        setStats(prev => ({
          ...prev,
          totalUsers: users.length,
          newUsers: newUsers.length,
          userGrowth: ((newUsers.length / users.length) * 100).toFixed(1)
        }));
      })
    );

    // Monitor active users
    const activeUsersQuery = query(
      collection(db, 'userStatus'),
      where('status', '==', 'online')
    );
    unsubscribers.push(
      onSnapshot(activeUsersQuery, (snapshot) => {
        setStats(prev => ({
          ...prev,
          activeUsers: snapshot.size
        }));
      })
    );

    // Monitor questions and answers
    const questionsQuery = query(collection(db, 'questions'));
    const answersQuery = query(collection(db, 'answers'));
    
    unsubscribers.push(
      onSnapshot(questionsQuery, (snapshot) => {
        setStats(prev => ({
          ...prev,
          totalQuestions: snapshot.size
        }));
      })
    );

    unsubscribers.push(
      onSnapshot(answersQuery, (snapshot) => {
        setStats(prev => ({
          ...prev,
          totalAnswers: snapshot.size
        }));
      })
    );

    // Monitor pending reports
    const reportsQuery = query(
      collection(db, 'reports'),
      where('status', '==', 'pending')
    );
    unsubscribers.push(
      onSnapshot(reportsQuery, (snapshot) => {
        setStats(prev => ({
          ...prev,
          pendingReports: snapshot.size
        }));
      })
    );

    // Monitor recent activity
    const activityQuery = query(
      collection(db, 'activityLogs'),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    unsubscribers.push(
      onSnapshot(activityQuery, (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentActivity(activities);
      })
    );

    setLoading(false);

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }, []);

  return (
    <Box>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading size="lg">Admin Dashboard</Heading>
          <RoleBasedComponent requiredRole={ROLES.ADMIN}>
            <Button
              colorScheme="blue"
              onClick={() => {/* Add system settings modal */}}
            >
              System Settings
            </Button>
          </RoleBasedComponent>
        </Flex>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
          <Card>
            <CardHeader>
              <Heading size="md">User Growth</Heading>
            </CardHeader>
            <CardBody>
              <Stat>
                <StatLabel>Total Users</StatLabel>
                <StatNumber>{stats.totalUsers}</StatNumber>
                <StatHelpText>
                  <StatArrow type={stats.userGrowth > 0 ? 'increase' : 'decrease'} />
                  {stats.userGrowth}%
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
                <StatLabel>Currently Online</StatLabel>
                <StatNumber>{stats.activeUsers}</StatNumber>
                <Progress 
                  value={(stats.activeUsers / stats.totalUsers) * 100} 
                  size="sm" 
                  colorScheme="green" 
                />
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Content Stats</Heading>
            </CardHeader>
            <CardBody>
              <Stat>
                <StatLabel>Total Content</StatLabel>
                <StatNumber>{stats.totalQuestions + stats.totalAnswers}</StatNumber>
                <StatHelpText>
                  Q: {stats.totalQuestions} | A: {stats.totalAnswers}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Pending Reports</Heading>
            </CardHeader>
            <CardBody>
              <Stat>
                <StatLabel>Reports</StatLabel>
                <StatNumber>{stats.pendingReports}</StatNumber>
                <StatHelpText color="red.500">
                  Needs attention
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        <Tabs variant="enclosed">
          <TabList>
            <Tab>Overview</Tab>
            <RoleBasedComponent requiredRole={ROLES.ADMIN}>
              <Tab>Analytics</Tab>
            </RoleBasedComponent>
            <Tab>Users</Tab>
            <Tab>Content</Tab>
            <RoleBasedComponent requiredRole={ROLES.MODERATOR}>
              <Tab>Reports</Tab>
            </RoleBasedComponent>
            <Tab>Real-Time</Tab>
            <RoleBasedComponent 
              requiredRole={ROLES.ADMIN}
              requiredPermission="canManageRoles"
            >
              <Tab>Role Management</Tab>
            </RoleBasedComponent>
          </TabList>

          <TabPanels>
            <TabPanel>
              <RealTimeMonitoring recentActivity={recentActivity} />
            </TabPanel>
            
            <RoleBasedComponent requiredRole={ROLES.ADMIN}>
              <TabPanel>
                <Analytics />
              </TabPanel>
            </RoleBasedComponent>

            <TabPanel>
              <UserManagement />
            </TabPanel>

            <TabPanel>
              <ContentManagement />
            </TabPanel>

            <RoleBasedComponent requiredRole={ROLES.MODERATOR}>
              <TabPanel>
                <ReportsManagement />
              </TabPanel>
            </RoleBasedComponent>

            <TabPanel>
              <RealTimeMonitoring />
            </TabPanel>

            <RoleBasedComponent 
              requiredRole={ROLES.ADMIN}
              requiredPermission="canManageRoles"
            >
              <TabPanel>
                <RoleManagement />
              </TabPanel>
            </RoleBasedComponent>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
} 