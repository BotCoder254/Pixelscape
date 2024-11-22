import { useState } from 'react';
import { 
  doc, 
  updateDoc, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useToast } from '@chakra-ui/react';

export function useReportManagement() {
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const updateReportStatus = async (reportId, status) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'reports', reportId), {
        status,
        resolvedAt: serverTimestamp()
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update report status",
        status: "error",
        duration: 3000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteReportedContent = async (itemId, itemType) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, itemType + 's', itemId));
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete content",
        status: "error",
        duration: 3000,
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    updateReportStatus,
    deleteReportedContent,
    loading
  };
} 