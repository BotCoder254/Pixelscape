import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc, increment, arrayUnion } from 'firebase/firestore';
import { db } from '../../firebase/config';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  VStack,
  HStack,
  Text,
  Avatar,
  Tag,
  Divider,
  useColorModeValue,
  Skeleton,
  useToast
} from '@chakra-ui/react';
import { TimeAgo } from '../utils/TimeAgo';
import AnswerList from '../answers/AnswerList';
import AnswerForm from '../answers/AnswerForm';
import VoteButtons from '../shared/VoteButtons';
import { useAuth } from '../../contexts/AuthContext';
import ReportButton from '../shared/ReportButton';
import CommentSection from '../comments/CommentSection';
import { useAppState } from '../../hooks/useAppState';
import { ACTIVITY_TYPES } from '../../utils/activityTypes';

export default function QuestionDetail() {
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { currentUser } = useAuth();
  const toast = useToast();
  const [acceptedAnswerId, setAcceptedAnswerId] = useState(null);
  const { logUserActivity } = useAppState();
  
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const fetchAnswers = async () => {
    const answersQuery = query(collection(db, 'answers'), where('questionId', '==', id));
    const answersSnapshot = await getDocs(answersQuery);
    const answersList = answersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setAnswers(answersList);
  };

  useEffect(() => {
    async function fetchQuestion() {
      try {
        const questionDoc = await getDoc(doc(db, 'questions', id));
        if (questionDoc.exists()) {
          const questionData = questionDoc.data();
          setQuestion({
            id: questionDoc.id,
            ...questionData
          });
          setAcceptedAnswerId(questionData.acceptedAnswerId || null);
          await fetchAnswers();
        }
      } catch (error) {
        console.error('Error fetching question:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [id]);

  const handleVote = async (itemId, itemType, voteType) => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to vote",
        status: "error",
        duration: 3000,
      });
      return;
    }

    const voteValue = voteType === 'up' ? 1 : -1;
    const itemRef = doc(db, itemType === 'question' ? 'questions' : 'answers', itemId);

    try {
      await updateDoc(itemRef, {
        votes: increment(voteValue)
      });

      // Log activity
      await logUserActivity(
        itemType === 'question' ? ACTIVITY_TYPES.QUESTION.VOTE : ACTIVITY_TYPES.ANSWER.VOTE,
        {
          itemId,
          voteType,
          voteValue
        }
      );

      if (itemType === 'question') {
        setQuestion(prev => ({
          ...prev,
          votes: prev.votes + voteValue
        }));
      } else {
        setAnswers(prev =>
          prev.map(answer =>
            answer.id === itemId
              ? { ...answer, votes: answer.votes + voteValue }
              : answer
          )
        );
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register vote",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleAcceptAnswer = async (answerId) => {
    if (!currentUser || currentUser.uid !== question.userId) {
      toast({
        title: "Error",
        description: "Only the question author can accept answers",
        status: "error",
        duration: 3000,
      });
      return;
    }

    try {
      await updateDoc(doc(db, 'questions', id), {
        acceptedAnswerId: answerId
      });

      // Update answer author's reputation
      const answerDoc = await getDoc(doc(db, 'answers', answerId));
      if (answerDoc.exists()) {
        const answerData = answerDoc.data();
        await updateDoc(doc(db, 'users', answerData.userId), {
          reputation: increment(15)
        });

        // Log activity
        await logUserActivity(ACTIVITY_TYPES.ANSWER.ACCEPT, {
          answerId,
          questionId: id,
          answerAuthorId: answerData.userId
        });
      }

      setAcceptedAnswerId(answerId);
      toast({
        title: "Success",
        description: "Answer marked as accepted",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept answer",
        status: "error",
        duration: 3000,
      });
    }
  };

  if (loading) {
    return (
      <VStack spacing={4} align="stretch">
        <Skeleton height="200px" />
        <Skeleton height="100px" />
      </VStack>
    );
  }

  if (!question) {
    return <Text>Question not found</Text>;
  }

  return (
    <Box>
      <Box
        p={6}
        borderWidth={1}
        borderRadius="lg"
        bg={bgColor}
        borderColor={borderColor}
        boxShadow="lg"
      >
        <HStack align="start" spacing={4}>
          <VStack spacing={4}>
            <VoteButtons
              votes={question.votes}
              itemId={question.id}
              itemType="question"
              onVote={handleVote}
              userVote={question.userVote}
            />
            {currentUser && currentUser.uid !== question.userId && (
              <ReportButton
                itemId={question.id}
                itemType="question"
                contentPreview={question.title}
              />
            )}
          </VStack>
          
          <VStack align="stretch" spacing={6} flex={1}>
            <Box>
              <Text fontSize="2xl" fontWeight="bold">
                {question.title}
              </Text>
              <HStack mt={2} spacing={2}>
                {question.tags.map((tag, index) => (
                  <Tag key={index} colorScheme="blue">
                    {tag}
                  </Tag>
                ))}
              </HStack>
            </Box>

            <Divider />

            <Box className="markdown-content">
              <ReactMarkdown>{question.description}</ReactMarkdown>
            </Box>

            <Divider />

            <HStack justify="space-between">
              <HStack spacing={2}>
                <Avatar
                  size="sm"
                  src={question.userAvatar}
                  name={question.username}
                />
                <Text fontSize="sm">{question.username}</Text>
              </HStack>
              <Text fontSize="sm" color="gray.500">
                asked <TimeAgo date={question.createdAt?.toDate()} />
              </Text>
            </HStack>
          </VStack>
        </HStack>

        <CommentSection
          comments={question.comments || []}
          parentId={question.id}
          parentType="question"
        />
      </Box>

      <AnswerList
        answers={answers}
        questionId={id}
        questionAuthorId={question.userId}
        onVote={handleVote}
        onAcceptAnswer={handleAcceptAnswer}
        acceptedAnswerId={acceptedAnswerId}
      />

      <AnswerForm
        questionId={id}
        onAnswerAdded={fetchAnswers}
      />
    </Box>
  );
} 