import { VStack, IconButton, Text } from '@chakra-ui/react';
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons';

export default function VoteButtons({ votes, itemId, itemType, onVote, userVote }) {
  return (
    <VStack spacing={1}>
      <IconButton
        icon={<ChevronUpIcon />}
        variant={userVote === 'up' ? 'solid' : 'ghost'}
        colorScheme={userVote === 'up' ? 'green' : 'gray'}
        aria-label="Upvote"
        onClick={() => onVote(itemId, itemType, 'up')}
        size="sm"
      />
      <Text 
        fontWeight="bold"
        color={votes > 0 ? 'green.500' : votes < 0 ? 'red.500' : 'gray.500'}
      >
        {votes}
      </Text>
      <IconButton
        icon={<ChevronDownIcon />}
        variant={userVote === 'down' ? 'solid' : 'ghost'}
        colorScheme={userVote === 'down' ? 'red' : 'gray'}
        aria-label="Downvote"
        onClick={() => onVote(itemId, itemType, 'down')}
        size="sm"
      />
    </VStack>
  );
} 