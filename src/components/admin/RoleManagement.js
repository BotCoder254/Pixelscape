import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Select,
  Button,
  useToast,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  Text,
  HStack,
  Avatar
} from '@chakra-ui/react';
import { collection, query, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { ROLES, ROLE_PERMISSIONS } from '../../utils/roles';
import { useAuth } from '../../contexts/AuthContext';
import { useRolePermissions } from '../../hooks/useRolePermissions';

export default function RoleManagement() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { currentUser } = useAuth();
  const { can } = useRolePermissions();
  const toast = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'users'));
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
    if (!can('canManageRoles')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to manage roles",
        status: "error",
        duration: 3000,
      });
      return;
    }

    // Prevent self-role change
    if (userId === currentUser.uid) {
      toast({
        title: "Error",
        description: "You cannot change your own role",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', userId), {
        role: newRole
      });

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Success",
        description: "User role updated successfully",
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
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case ROLES.ADMIN: return 'red';
      case ROLES.MODERATOR: return 'purple';
      default: return 'blue';
    }
  };

  const getPermissionsList = (role) => {
    return Object.entries(ROLE_PERMISSIONS[role])
      .filter(([_, value]) => value)
      .map(([key]) => key)
      .join(', ');
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="bold">Role Management</Text>
        
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>User</Th>
              <Th>Current Role</Th>
              <Th>Permissions</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>
                  <HStack>
                    <Avatar size="sm" src={user.avatarUrl} name={user.username} />
                    <VStack align="start" spacing={0}>
                      <Text>{user.username}</Text>
                      <Text fontSize="xs" color="gray.500">{user.email}</Text>
                    </VStack>
                  </HStack>
                </Td>
                <Td>
                  <Badge colorScheme={getRoleBadgeColor(user.role)}>
                    {user.role}
                  </Badge>
                </Td>
                <Td>
                  <Text fontSize="sm" noOfLines={2}>
                    {getPermissionsList(user.role)}
                  </Text>
                </Td>
                <Td>
                  <Select
                    value={user.role}
                    onChange={(e) => {
                      setSelectedUser({ ...user, newRole: e.target.value });
                      onOpen();
                    }}
                    isDisabled={user.id === currentUser.uid || loading}
                    size="sm"
                    width="150px"
                  >
                    {Object.values(ROLES).map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </Select>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <AlertDialog
          isOpen={isOpen}
          onClose={onClose}
          leastDestructiveRef={undefined}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>
                Change User Role
              </AlertDialogHeader>
              <AlertDialogBody>
                Are you sure you want to change {selectedUser?.username}'s role from{' '}
                <Badge colorScheme={getRoleBadgeColor(selectedUser?.role)}>
                  {selectedUser?.role}
                </Badge>
                {' '}to{' '}
                <Badge colorScheme={getRoleBadgeColor(selectedUser?.newRole)}>
                  {selectedUser?.newRole}
                </Badge>?
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={undefined} onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="blue"
                  ml={3}
                  isLoading={loading}
                  onClick={() => {
                    handleRoleChange(selectedUser.id, selectedUser.newRole);
                    onClose();
                  }}
                >
                  Confirm
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </VStack>
    </Box>
  );
} 