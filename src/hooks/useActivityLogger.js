import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/config';

export function useActivityLogger() {
  const logActivity = async (data) => {
    try {
      await addDoc(collection(db, 'activityLogs'), {
        ...data,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  const getUserActivity = async (userId, limit = 10) => {
    try {
      const q = query(
        collection(db, 'activityLogs'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limit)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching user activity:', error);
      return [];
    }
  };

  return { logActivity, getUserActivity };
} 