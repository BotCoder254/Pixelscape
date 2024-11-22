import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  VStack,
  Text,
  Avatar,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useColorModeValue
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit2, FiTrash2, FiLock, FiUnlock } from 'react-icons/fi';
import { collection, query, orderBy, getDocs, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/config';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
  const toast = useToast();

  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const usersList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setUsers(usersList);
    } catch (error) {
      toast({
        title: "Error fetching users",
        description: error.message,
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      toast({
        title: "Success",
        description: "User role updated",
        status: "success",
        duration: 2000,
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

  const handleBanUser = async (userId, isBanned) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isBanned: isBanned
      });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isBanned } : user
      ));
      toast({
        title: "Success",
        description: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
        status: "success",
        duration: 2000,
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

  const handleBatchDelete = async () => {
    try {
      const batch = writeBatch(db);
      selectedUsers.forEach(userId => {
        const userRef = doc(db, 'users', userId);
        batch.delete(userRef);
      });
      await batch.commit();
      
      setUsers(users.filter(user => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
      toast({
        title: "Success",
        description: "Selected users deleted successfully",
        status: "success",
        duration: 2000,
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

  const handleBatchRoleUpdate = async (newRole) => {
    try {
      const batch = writeBatch(db);
      selectedUsers.forEach(userId => {
        const userRef = doc(db, 'users', userId);
        batch.update(userRef, { role: newRole });
      });
      await batch.commit();
      
      setUsers(users.map(user => 
        selectedUsers.includes(user.id) ? { ...user, role: newRole } : user
      ));
      setSelectedUsers([]);
      toast({
        title: "Success",
        description: "Selected users' roles updated successfully",
        status: "success",
        duration: 2000,
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

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        {selectedUsers.length > 0 && (
          <HStack justify="space-between" bg={bgColor} p={4} borderRadius="md">
            <Text>{selectedUsers.length} users selected</Text>
            <HStack>
              <Menu>
                <MenuButton as={Button} size="sm">
                  Batch Actions
                </MenuButton>
                <MenuList>
                  <MenuItem onClick={() => handleBatchRoleUpdate('user')}>
                    Set as Users
                  </MenuItem>
                  <MenuItem onClick={() => handleBatchRoleUpdate('moderator')}>
                    Set as Moderators
                  </MenuItem>
                  <MenuItem onClick={() => handleBatchRoleUpdate('admin')}>
                    Set as Admins
                  </MenuItem>
                  <MenuItem onClick={onDeleteOpen} color="red.500">
                    Delete Selected
                  </MenuItem>
                </MenuList>
              </Menu>
              <Button size="sm" onClick={() => setSelectedUsers([])}>
                Clear Selection
              </Button>
            </HStack>
          </HStack>
        )}

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>User</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <HStack>
                      <Avatar size="sm" src={user.avatarUrl} name={user.username} />
                      <Text>{user.username}</Text>
                    </HStack>
                  </Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge
                      colorScheme={
                        user.role === 'admin' ? 'red' :
                        user.role === 'moderator' ? 'purple' :
                        'blue'
                      }
                    >
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={user.isBanned ? 'red' : 'green'}>
                      {user.isBanned ? 'Banned' : 'Active'}
                    </Badge>
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
                          icon={<FiEdit2 />}
                          onClick={() => {
                            setSelectedUser(user);
                            onEditOpen();
                          }}
                        >
                          Edit User
                        </MenuItem>
                        <MenuItem
                          icon={user.isBanned ? <FiUnlock /> : <FiLock />}
                          onClick={() => handleBanUser(user.id, !user.isBanned)}
                        >
                          {user.isBanned ? 'Unban User' : 'Ban User'}
                        </MenuItem>
                        <MenuItem
                          icon={<FiTrash2 />}
                          color="red.500"
                          onClick={() => {
                            setSelectedUser(user);
                            onDeleteOpen();
                          }}
                        >
                          Delete User
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      {/* Edit User Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit User</ModalHeader>
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    value={selectedUser.username}
                    onChange={(e) => setSelectedUser({
                      ...selectedUser,
                      username: e.target.value
                    })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Role</FormLabel>
                  <Select
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({
                      ...selectedUser,
                      role: e.target.value
                    })}
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </Select>
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onEditClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={() => {
              handleRoleChange(selectedUser.id, selectedUser.role);
              onEditClose();
            }}>
              Save Changes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete User</AlertDialogHeader>
            <AlertDialogBody>
              Are you sure? This action cannot be undone.
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={undefined} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" ml={3} onClick={() => {
                handleBatchDelete();
                onDeleteClose();
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