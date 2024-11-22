import { useState } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Button,
  VStack,
  Textarea,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  useColorModeValue
} from '@chakra-ui/react';
import { useAppState } from '../../hooks/useAppState';
import { ACTIVITY_TYPES } from '../../utils/activityTypes';

export default function AnswerForm({ questionId, onAnswerAdded }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const toast = useToast();
  const { logUserActivity } = useAppState();
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Answer content is required",
        status: "error",
        duration: 3000,
      });
      return;
    }
    
    setLoading(true);
    try {
      // Add answer document
      const answerRef = await addDoc(collection(db, 'answers'), {
        questionId,
        content: content.trim(),
        userId: currentUser.uid,
        username: currentUser.displayName,
        userAvatar: currentUser.photoURL,
        createdAt: serverTimestamp(),
        votes: 0
      });

      // Update question with answer reference
      await updateDoc(doc(db, 'questions', questionId), {
        answers: arrayUnion(answerRef.id),
        lastActivity: serverTimestamp()
      });

      // Log activity
      await logUserActivity(ACTIVITY_TYPES.ANSWER.CREATE, {
        answerId: answerRef.id,
        questionId,
        preview: content.trim().substring(0, 100)
      });

      toast({
        title: "Success",
        description: "Your answer has been posted",
        status: "success",
        duration: 3000,
      });

      setContent('');
      if (onAnswerAdded) {
        onAnswerAdded();
      }
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

  return (
    <Box 
      mt={8}
      p={6} 
      borderWidth={1} 
      borderRadius="lg"
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="lg"
    >
      <form onSubmit={handleSubmit}>
        <VStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold" alignSelf="start">
            Your Answer
          </Text>
          
          <Tabs isFitted variant="enclosed" width="100%">
            <TabList mb="1em">
              <Tab>Write</Tab>
              <Tab>Preview</Tab>
            </TabList>
            <TabPanels>
              <TabPanel p={0}>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your answer here... Markdown is supported"
                  minH="200px"
                  disabled={loading}
                />
              </TabPanel>
              <TabPanel>
                <Box 
                  minH="200px" 
                  p={4} 
                  borderWidth={1} 
                  borderRadius="md"
                  className="markdown-preview"
                >
                  {content ? (
                    <ReactMarkdown>{content}</ReactMarkdown>
                  ) : (
                    <Text color="gray.500">Preview will appear here...</Text>
                  )}
                </Box>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <Button 
            type="submit" 
            colorScheme="blue" 
            width="full"
            isLoading={loading}
          >
            Post Answer
          </Button>
        </VStack>
      </form>
    </Box>
  );
} 