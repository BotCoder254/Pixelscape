import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  HStack,
  Text,
  Input,
  Button,
  Avatar,
  useColorModeValue,
  Divider,
  useToast,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { TimeAgo } from '../utils/TimeAgo';
import { useAuth } from '../../contexts/AuthContext';
import { useComments } from '../../hooks/useComments';
import { FiMoreVertical, FiTrash2 } from 'react-icons/fi';
import { useAppState } from '../../hooks/useAppState';
import { ACTIVITY_TYPES } from '../../utils/activityTypes';

export default function CommentSection({ comments: initialComments, parentId, parentType }) {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const { addComment, deleteComment, fetchComments } = useComments();
  const { logUserActivity } = useAppState();
  const toast = useToast();
  
  const bgColor = useColorModeValue('gray.50', 'gray.700');

  useEffect(() => {
    const loadComments = async () => {
      const fetchedComments = await fetchComments(parentId);
      setComments(fetchedComments);
    };
    loadComments();
  }, [parentId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      const commentData = {
        parentId,
        parentType,
        content: newComment.trim(),
        userId: currentUser.uid,
        username: currentUser.displayName,
        userAvatar: currentUser.photoURL,
      };

      const commentId = await addComment(commentData);

      // Log activity
      await logUserActivity(ACTIVITY_TYPES.COMMENT.CREATE, {
        commentId,
        parentId,
        parentType,
        content: newComment.trim().substring(0, 100)
      });

      const updatedComments = await fetchComments(parentId);
      setComments(updatedComments);
      setNewComment('');

      toast({
        title: "Success",
        description: "Comment added successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      
      // Log activity
      await logUserActivity(ACTIVITY_TYPES.COMMENT.DELETE, {
        commentId,
        parentId,
        parentType
      });

      setComments(comments.filter(comment => comment.id !== commentId));
      
      toast({
        title: "Success",
        description: "Comment deleted successfully",
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete comment",
        status: "error",
        duration: 3000,
      });
    }
  };

  return (
    <Box mt={4}>
      <Divider mb={4} />
      <VStack align="stretch" spacing={4}>
        {comments.map((comment) => (
          <Box
            key={comment.id}
            p={2}
            bg={bgColor}
            borderRadius="md"
            position="relative"
          >
            <HStack justify="space-between">
              <HStack>
                <Avatar size="xs" src={comment.userAvatar} name={comment.username} />
                <Text fontSize="sm" fontWeight="medium">{comment.username}</Text>
                <Text fontSize="sm" color="gray.500">
                  <TimeAgo date={comment.createdAt?.toDate()} />
                </Text>
              </HStack>
              {(currentUser?.uid === comment.userId || currentUser?.role === 'admin') && (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<FiMoreVertical />}
                    variant="ghost"
                    size="xs"
                  />
                  <MenuList>
                    <MenuItem
                      icon={<FiTrash2 />}
                      color="red.500"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              )}
            </HStack>
            <Text mt={2} fontSize="sm">
              {comment.content}
            </Text>
          </Box>
        ))}

        {currentUser && (
          <form onSubmit={handleSubmit} style={{ width: '100%' }}>
            <HStack>
              <Input
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                size="sm"
                disabled={loading}
              />
              <Button 
                type="submit" 
                size="sm" 
                colorScheme="blue"
                isLoading={loading}
              >
                Comment
              </Button>
            </HStack>
          </form>
        )}
      </VStack>
    </Box>
  );
} 