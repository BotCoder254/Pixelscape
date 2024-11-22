import {
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
  Button
} from '@chakra-ui/react';
import { FiMoreVertical, FiEdit2, FiTrash2, FiFlag, FiLock } from 'react-icons/fi';
import { useRolePermissions } from '../../hooks/useRolePermissions';
import { useState } from 'react';

export default function ModeratorActions({ 
  item,
  onDelete,
  onEdit,
  onFlag,
  onLock
}) {
  const { can } = useRolePermissions();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [action, setAction] = useState(null);

  const handleAction = async (actionType) => {
    if (!can('canModerateContent')) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to perform this action",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setAction(actionType);
    onOpen();
  };

  const confirmAction = async () => {
    try {
      switch (action) {
        case 'delete':
          await onDelete();
          break;
        case 'flag':
          await onFlag();
          break;
        case 'lock':
          await onLock();
          break;
        default:
          break;
      }
      onClose();
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
    <>
      <Menu>
        <MenuButton
          as={IconButton}
          icon={<FiMoreVertical />}
          variant="ghost"
          size="sm"
        />
        <MenuList>
          {can('canEditAnyContent') && (
            <MenuItem icon={<FiEdit2 />} onClick={onEdit}>
              Edit
            </MenuItem>
          )}
          {can('canDeleteAnyContent') && (
            <MenuItem 
              icon={<FiTrash2 />} 
              onClick={() => handleAction('delete')}
              color="red.500"
            >
              Delete
            </MenuItem>
          )}
          {can('canModerateContent') && (
            <>
              <MenuItem 
                icon={<FiFlag />} 
                onClick={() => handleAction('flag')}
              >
                Flag as Inappropriate
              </MenuItem>
              <MenuItem 
                icon={<FiLock />} 
                onClick={() => handleAction('lock')}
              >
                Lock Thread
              </MenuItem>
            </>
          )}
        </MenuList>
      </Menu>

      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={undefined}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>
              Confirm Action
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to {action} this content?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={undefined} onClick={onClose}>
                Cancel
              </Button>
              <Button 
                colorScheme={action === 'delete' ? 'red' : 'blue'} 
                ml={3} 
                onClick={confirmAction}
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
} 