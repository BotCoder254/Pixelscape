import { useState } from 'react';
import { Box, VStack, Text, HStack, Avatar, Button, useColorModeValue, Flex, Badge, Tooltip } from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import ReactMarkdown from 'react-markdown';
import { TimeAgo } from '../utils/TimeAgo';
import VoteButtons from '../shared/VoteButtons';
import { useAuth } from '../../contexts/AuthContext';
import ReportButton from '../shared/ReportButton';
import CommentSection from '../comments/CommentSection';

export default function AnswerList({ answers, questionId, questionAuthorId, onVote, onAcceptAnswer, acceptedAnswerId }) {
  const bgColor = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const { currentUser } = useAuth();
  
  // Sort answers: accepted answer first, then by votes
  const sortedAnswers = [...answers].sort((a, b) => {
    if (a.id === acceptedAnswerId) return -1;
    if (b.id === acceptedAnswerId) return 1;
    return b.votes - a.votes;
  });

  return (
    <VStack spacing={4} align="stretch" mt={8}>
      <Flex justify="space-between" align="center">
        <Text fontSize="xl" fontWeight="bold">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </Text>
        <Text fontSize="sm" color="gray.500">
          Sorted by {acceptedAnswerId ? 'accepted answer and ' : ''}most votes
        </Text>
      </Flex>
      
      {sortedAnswers.map((answer) => (
        <Box
          key={answer.id}
          p={6}
          borderWidth={1}
          borderRadius="lg"
          bg={bgColor}
          borderColor={answer.id === acceptedAnswerId ? 'green.200' : borderColor}
          boxShadow={answer.id === acceptedAnswerId ? 'md' : 'sm'}
          position="relative"
          _hover={{ boxShadow: 'md' }}
          transition="all 0.2s"
        >
          {answer.id === acceptedAnswerId && (
            <Badge
              colorScheme="green"
              position="absolute"
              top={-3}
              right={4}
              px={2}
              py={1}
              borderRadius="full"
            >
              Accepted Answer
            </Badge>
          )}
          
          <HStack align="start" spacing={4}>
            <VStack spacing={4}>
              <VoteButtons
                votes={answer.votes}
                itemId={answer.id}
                itemType="answer"
                onVote={onVote}
                userVote={answer.userVote}
              />
              
              {currentUser && currentUser.uid !== answer.userId && (
                <ReportButton
                  itemId={answer.id}
                  itemType="answer"
                  contentPreview={answer.content.substring(0, 100)}
                />
              )}
              
              {currentUser?.uid === questionAuthorId && answer.id !== acceptedAnswerId && (
                <Tooltip label="Accept this answer" placement="left">
                  <Button
                    size="sm"
                    colorScheme="green"
                    variant="outline"
                    onClick={() => onAcceptAnswer(answer.id)}
                    leftIcon={<CheckCircleIcon />}
                  >
                    Accept
                  </Button>
                </Tooltip>
              )}
            </VStack>
            
            <VStack align="stretch" flex={1} spacing={4}>
              <Box className="markdown-content">
                <ReactMarkdown>{answer.content}</ReactMarkdown>
              </Box>
              
              <Flex 
                justify="space-between" 
                align="center"
                mt={4}
                pt={4}
                borderTop="1px"
                borderColor={borderColor}
              >
                <HStack spacing={2}>
                  <Avatar
                    size="sm"
                    src={answer.userAvatar}
                    name={answer.username}
                  />
                  <VStack align="start" spacing={0}>
                    <Text fontSize="sm" fontWeight="medium">
                      {answer.username}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      reputation: {answer.userReputation || 0}
                    </Text>
                  </VStack>
                </HStack>
                <Text fontSize="sm" color="gray.500">
                  answered <TimeAgo date={answer.createdAt?.toDate()} />
                </Text>
              </Flex>
              
              <CommentSection
                comments={answer.comments || []}
                parentId={answer.id}
                parentType="answer"
              />
            </VStack>
          </HStack>
        </Box>
      ))}
    </VStack>
  );
} 