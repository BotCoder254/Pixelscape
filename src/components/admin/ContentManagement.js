import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
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
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Select,
  Input,
  useColorModeValue
} from '@chakra-ui/react';
import { FiMoreVertical, FiTrash2, FiEdit2, FiEye, FiArchive } from 'react-icons/fi';
import { collection, query, orderBy, getDocs, writeBatch, doc, where } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { Link as RouterLink } from 'react-router-dom';

export default function ContentManagement() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchContent();
  }, [filter]);

  const fetchContent = async () => {
    try {
      // Fetch questions
      const questionsQuery = query(
        collection(db, 'questions'),
        filter !== 'all' ? where('status', '==', filter) : null,
        orderBy('createdAt', 'desc')
      );
      const questionsSnapshot = await getDocs(questionsQuery);
      const questionsList = questionsSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'question',
        ...doc.data()
      }));
      setQuestions(questionsList);

      // Fetch answers
      const answersQuery = query(
        collection(db, 'answers'),
        orderBy('createdAt', 'desc')
      );
      const answersSnapshot = await getDocs(answersQuery);
      const answersList = answersSnapshot.docs.map(doc => ({
        id: doc.id,
        type: 'answer',
        ...doc.data()
      }));
      setAnswers(answersList);
    } catch (error) {
      toast({
        title: "Error fetching content",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBatchDelete = async () => {
    try {
      const batch = writeBatch(db);
      selectedItems.forEach(item => {
        const itemRef = doc(db, `${item.type}s`, item.id);
        batch.delete(itemRef);
      });
      await batch.commit();
      
      toast({
        title: "Success",
        description: "Selected items deleted successfully",
        status: "success",
        duration: 2000,
      });
      
      fetchContent();
      setSelectedItems([]);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleBatchArchive = async () => {
    try {
      const batch = writeBatch(db);
      selectedItems.forEach(item => {
        const itemRef = doc(db, `${item.type}s`, item.id);
        batch.update(itemRef, { status: 'archived' });
      });
      await batch.commit();
      
      toast({
        title: "Success",
        description: "Selected items archived successfully",
        status: "success",
        duration: 2000,
      });
      
      fetchContent();
      setSelectedItems([]);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const ContentTable = ({ items }) => (
    <Table variant="simple">
      <Thead>
        <Tr>
          <Th>Content</Th>
          <Th>Author</Th>
          <Th>Status</Th>
          <Th>Votes</Th>
          <Th>Actions</Th>
        </Tr>
      </Thead>
      <Tbody>
        {items.map((item) => (
          <Tr key={item.id}>
            <Td maxW="400px" isTruncated>
              <Text noOfLines={2}>
                {item.title || item.content}
              </Text>
            </Td>
            <Td>{item.username}</Td>
            <Td>
              <Badge colorScheme={item.status === 'archived' ? 'yellow' : 'green'}>
                {item.status || 'active'}
              </Badge>
            </Td>
            <Td>{item.votes}</Td>
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
                    as={RouterLink}
                    to={`/${item.type}/${item.id}`}
                    icon={<FiEye />}
                  >
                    View
                  </MenuItem>
                  <MenuItem
                    icon={<FiArchive />}
                    onClick={() => handleBatchArchive([item])}
                  >
                    Archive
                  </MenuItem>
                  <MenuItem
                    icon={<FiTrash2 />}
                    color="red.500"
                    onClick={() => {
                      setSelectedItems([item]);
                      onOpen();
                    }}
                  >
                    Delete
                  </MenuItem>
                </MenuList>
              </Menu>
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between">
          <Text fontSize="2xl" fontWeight="bold">Content Management</Text>
          <HStack>
            <Select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              w="150px"
            >
              <option value="all">All Content</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </Select>
            <Input
              placeholder="Search content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              w="200px"
            />
          </HStack>
        </HStack>

        {selectedItems.length > 0 && (
          <HStack justify="space-between" bg={bgColor} p={4} borderRadius="md">
            <Text>{selectedItems.length} items selected</Text>
            <HStack>
              <Button
                size="sm"
                colorScheme="yellow"
                onClick={handleBatchArchive}
              >
                Archive Selected
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={onOpen}
              >
                Delete Selected
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedItems([])}
              >
                Clear Selection
              </Button>
            </HStack>
          </HStack>
        )}

        <Tabs>
          <TabList>
            <Tab>Questions ({questions.length})</Tab>
            <Tab>Answers ({answers.length})</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <ContentTable items={questions} />
            </TabPanel>
            <TabPanel>
              <ContentTable items={answers} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete Content</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={undefined} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" ml={3} onClick={() => {
                handleBatchDelete();
                onClose();
              }}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
} 