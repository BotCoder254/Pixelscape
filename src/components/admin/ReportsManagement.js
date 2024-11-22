import { useState, useEffect } from 'react';

import {

  Box,

  VStack,

  Text,

  Table,

  Thead,

  Tbody,

  Tr,

  Th,

  Td,

  Badge,

  Menu,

  MenuButton,

  MenuList,

  MenuItem,

  IconButton,

  useToast,

  HStack,

  Select,

  Input,

  InputGroup,

  InputLeftElement,

  Flex,

  Spinner,

  Alert,

  AlertIcon,

  useColorModeValue,

  Tooltip,

  Link

} from '@chakra-ui/react';

import { FiMoreVertical, FiSearch, FiFilter, FiEye, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';

import { collection, query, where, getDocs, orderBy, onSnapshot } from 'firebase/firestore';

import { db } from '../../firebase/config';

import { useReportManagement } from '../../hooks/useReportManagement';

import { Link as RouterLink } from 'react-router-dom';

import { TimeAgo } from '../utils/TimeAgo';



export default function ReportsManagement() {

  const { updateReportStatus, deleteReportedContent } = useReportManagement();

  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(true);

  const [filter, setFilter] = useState('pending');

  const toast = useToast();

  

  const bgColor = useColorModeValue('white', 'gray.700');

  const borderColor = useColorModeValue('gray.200', 'gray.600');



  useEffect(() => {

    const q = query(

      collection(db, 'reports'),

      filter !== 'all' ? where('status', '==', filter) : null,

      orderBy('createdAt', 'desc')

    );



    const unsubscribe = onSnapshot(q, (snapshot) => {

      const reportsList = snapshot.docs.map(doc => ({

        id: doc.id,

        ...doc.data()

      }));

      setReports(reportsList);

      setLoading(false);

    });



    return () => unsubscribe();

  }, [filter]);



  const handleAction = async (reportId, action) => {

    try {

      await updateReportStatus(reportId, action);

      if (action === 'removed') {

        const report = reports.find(r => r.id === reportId);

        if (report) {

          await deleteReportedContent(report.itemId, report.itemType);

        }

      }

      toast({

        title: "Success",

        description: `Report ${action} successfully`,

        status: "success",

        duration: 3000,

      });

    } catch (error) {

      toast({

        title: "Error",

        description: error.message,

        status: "error",

        duration: 3000,

      });

    }

  };



  const getStatusColor = (status) => {

    switch (status) {

      case 'pending': return 'yellow';

      case 'resolved': return 'green';

      case 'dismissed': return 'gray';

      case 'removed': return 'red';

      default: return 'gray';

    }

  };



  return (

    <Box>

      <Flex justify="space-between" align="center" mb={6}>

        <Text fontSize="xl" fontWeight="bold">Content Reports</Text>

        <Select 

          value={filter} 

          onChange={(e) => setFilter(e.target.value)}

          width="200px"

        >

          <option value="all">All Reports</option>

          <option value="pending">Pending</option>

          <option value="resolved">Resolved</option>

          <option value="dismissed">Dismissed</option>

          <option value="removed">Removed</option>

        </Select>

      </Flex>



      <Box 

        bg={bgColor} 

        borderWidth={1} 

        borderRadius="lg" 

        borderColor={borderColor}

        overflow="hidden"

      >

        <Table variant="simple">

          <Thead>

            <Tr>

              <Th>Type</Th>

              <Th>Content Preview</Th>

              <Th>Reporter</Th>

              <Th>Reason</Th>

              <Th>Status</Th>

              <Th>Reported At</Th>

              <Th>Actions</Th>

            </Tr>

          </Thead>

          <Tbody>

            {reports.map((report) => (

              <Tr key={report.id}>

                <Td>

                  <Badge colorScheme={report.itemType === 'question' ? 'blue' : 'purple'}>

                    {report.itemType}

                  </Badge>

                </Td>

                <Td>

                  <Tooltip label={report.contentPreview}>

                    <Link

                      as={RouterLink}

                      to={`/${report.itemType}/${report.itemId}`}

                      color="blue.500"

                      noOfLines={1}

                    >

                      {report.contentPreview.substring(0, 50)}...

                    </Link>

                  </Tooltip>

                </Td>

                <Td>{report.reporterName}</Td>

                <Td>

                  <Badge colorScheme="red">{report.reason}</Badge>

                </Td>

                <Td>

                  <Badge colorScheme={getStatusColor(report.status)}>

                    {report.status}

                  </Badge>

                </Td>

                <Td>

                  <TimeAgo date={report.createdAt?.toDate()} />

                </Td>

                <Td>

                  <Menu>

                    <MenuButton

                      as={IconButton}

                      icon={<FiMoreVertical />}

                      variant="ghost"

                      size="sm"

                    />

                    <MenuList>

                      <MenuItem 

                        icon={<FiEye />}

                        as={RouterLink}

                        to={`/${report.itemType}/${report.itemId}`}

                      >

                        View Content

                      </MenuItem>

                      <MenuItem 

                        icon={<FiCheck />}

                        onClick={() => handleAction(report.id, 'resolved')}

                      >

                        Mark as Resolved

                      </MenuItem>

                      <MenuItem 

                        icon={<FiX />}

                        onClick={() => handleAction(report.id, 'dismissed')}

                      >

                        Dismiss Report

                      </MenuItem>

                      <MenuItem 

                        icon={<FiTrash2 />}

                        onClick={() => handleAction(report.id, 'removed')}

                        color="red.500"

                      >

                        Remove Content

                      </MenuItem>

                    </MenuList>

                  </Menu>

                </Td>

              </Tr>

            ))}

          </Tbody>

        </Table>

      </Box>

    </Box>

  );

} 


