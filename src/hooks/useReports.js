import { useState } from 'react';
import { collection, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useToast } from '@chakra-ui/react';

export function useReports() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const createReport = async (data) => {
    setLoading(true);
    try {
      await addDoc(collection(db, 'reports'), {
        ...data,
        status: 'pending',
        createdAt: serverTimestamp()
      });

      toast({
        title: "Report submitted",
        description: "A moderator will review your report",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit report",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (reportId, action) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'reports', reportId), {
        status: action,
        resolvedAt: serverTimestamp()
      });

      toast({
        title: "Report handled",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to handle report",
        status: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return { createReport, handleReport, loading };
} 