import { useState } from 'react';
import { 
  collection, 
  addDoc, 
  deleteDoc,
  doc, 
  serverTimestamp, 
  query, 
  where, 
  getDocs, 
  orderBy 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useToast } from '@chakra-ui/react';

export function useComments() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const addComment = async (commentData) => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, 'comments'), {
        ...commentData,
        createdAt: serverTimestamp()
      });

      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      return true;
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async (parentId) => {
    try {
      const q = query(
        collection(db, 'comments'),
        where('parentId', '==', parentId),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        status: "error",
        duration: 3000,
      });
      return [];
    }
  };

  return {
    addComment,
    deleteComment,
    fetchComments,
    loading
  };
} 