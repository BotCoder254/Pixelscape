import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Tag,
  TagLabel,
  TagCloseButton,
  HStack,
  Text,
  useColorModeValue,
  Container,
  Heading,
  Alert,
  AlertIcon,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react';
import { FaPlus } from 'react-icons/fa';
import MarkdownEditor from '../shared/MarkdownEditor';
import { Icons } from '../shared/Icons';
import { useAppState } from '../../hooks/useAppState';
import { ACTIVITY_TYPES } from '../../utils/activityTypes';

export default function QuestionForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState('');
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { logUserActivity } = useAppState();
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleAddTag = () => {
    if (tag && !tags.includes(tag.toLowerCase()) && tags.length < 5) {
      setTags([...tags, tag.toLowerCase()]);
      setTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and description are required",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
      return;
    }
    
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'questions'), {
        title: title.trim(),
        description: description.trim(),
        tags,
        userId: currentUser.uid,
        username: currentUser.displayName,
        userAvatar: currentUser.photoURL,
        createdAt: serverTimestamp(),
        votes: 0,
        views: 0,
        answers: [],
        lastActivity: serverTimestamp()
      });

      // Log activity
      await logUserActivity(ACTIVITY_TYPES.QUESTION.CREATE, {
        questionId: docRef.id,
        title: title.trim(),
        tags
      });

      toast({
        title: "Question Posted",
        description: "Your question has been successfully posted",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });

      navigate(`/question/${docRef.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top-right"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="4xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>Ask a Question</Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            Get help from the community by asking a clear, well-formatted question
          </Text>
        </Box>

        <Alert status="info" borderRadius="md">
          <AlertIcon />
          <Text fontSize="sm">
            Tips: Be specific, include relevant details, and format your question using markdown
          </Text>
        </Alert>

        <Box 
          as="form" 
          onSubmit={handleSubmit}
          bg={bgColor}
          borderWidth={1}
          borderRadius="lg"
          borderColor={borderColor}
          boxShadow="sm"
          p={6}
        >
          <VStack spacing={6}>
            <FormControl isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's your programming question? Be specific."
                size="lg"
                disabled={loading}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <MarkdownEditor
                value={description}
                onChange={setDescription}
                placeholder="Provide more details about your question..."
                minH="400px"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Tags</FormLabel>
              <InputGroup size="md">
                <Input
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Add relevant tags (e.g., javascript, react, node.js)"
                  disabled={loading || tags.length >= 5}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    icon={<FaPlus />}
                    onClick={handleAddTag}
                    disabled={loading || tags.length >= 5}
                    aria-label="Add tag"
                  />
                </InputRightElement>
              </InputGroup>
              <Text fontSize="sm" color="gray.500" mt={2}>
                Up to 5 tags can be added
              </Text>
            </FormControl>

            <Box>
              <HStack wrap="wrap" spacing={2}>
                {tags.map((tag, index) => (
                  <Tag
                    key={index}
                    size="md"
                    borderRadius="full"
                    variant="solid"
                    colorScheme="blue"
                    className="hover-transform"
                  >
                    <TagLabel>{tag}</TagLabel>
                    <TagCloseButton onClick={() => removeTag(tag)} />
                  </Tag>
                ))}
              </HStack>
            </Box>

            <Button 
              type="submit" 
              colorScheme="blue" 
              size="lg"
              width="full"
              isLoading={loading}
              loadingText="Posting..."
              leftIcon={<Icons.Markdown boxSize={5} />}
            >
              Post Your Question
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
} 
