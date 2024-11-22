import { useState } from 'react';
import { doc, updateDoc, increment, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useToast } from '@chakra-ui/react';

export function useVotes() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleVote = async (itemId, itemType, voteType, userId) => {
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to vote",
        status: "error",
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      const itemRef = doc(db, itemType === 'question' ? 'questions' : 'answers', itemId);
      const userVoteRef = doc(db, 'userVotes', userId);
      const voteValue = voteType === 'up' ? 1 : -1;
      const voteKey = `${itemType}_${itemId}`;

      // Update item votes
      await updateDoc(itemRef, {
        votes: increment(voteValue)
      });

      // Track user's vote
      await updateDoc(userVoteRef, {
        [voteKey]: voteType,
        votedItems: arrayUnion(itemId)
      });

      // Update user reputation
      const authorId = itemType === 'question' ? question.userId : answer.userId;
      await updateDoc(doc(db, 'users', authorId), {
        reputation: increment(voteType === 'up' ? 10 : -2)
      });

      toast({
        title: "Success",
        description: `Vote ${voteType === 'up' ? 'up' : 'down'} registered`,
        status: "success",
        duration: 2000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to register vote",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return { handleVote, loading };
} 