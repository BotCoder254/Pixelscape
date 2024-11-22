import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  limit, 
  doc, 
  serverTimestamp, 
  updateDoc,
  setDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { useActivityLogger } from './useActivityLogger';

export function useAppState() {
  const auth = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    totalQuestions: 0,
    totalAnswers: 0,
    pendingReports: 0,
    userGrowth: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [userStatus, setUserStatus] = useState({});
  const { logActivity } = useActivityLogger();

  // Handle user status
  useEffect(() => {
    if (!auth.currentUser) return;

    // Set user as online
    const updateUserStatus = async (status) => {
      const userStatusRef = doc(db, 'userStatus', auth.currentUser.uid);
      await setDoc(userStatusRef, {
        userId: auth.currentUser.uid,
        status,
        lastSeen: serverTimestamp()
      }, { merge: true });
    };

    // Update status when component mounts
    updateUserStatus('online');

    // Update status when user closes/leaves the page
    const handleUnload = () => {
      updateUserStatus('offline');
    };

    window.addEventListener('beforeunload', handleUnload);

    // Set up presence monitoring
    let presenceInterval = setInterval(() => {
      updateUserStatus('online');
    }, 5 * 60 * 1000); // Update every 5 minutes

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      clearInterval(presenceInterval);
      updateUserStatus('offline');
    };
  }, [auth.currentUser]);

  // Monitor statistics
  useEffect(() => {
    if (!auth.currentUser) return;

    const unsubscribers = [];

    // Monitor users
    const usersQuery = query(collection(db, 'users'));
    unsubscribers.push(
      onSnapshot(usersQuery, (snapshot) => {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        
        const users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const newUsers = users.filter(user => 
          new Date(user.createdAt) > thirtyDaysAgo
        );

        setStats(prev => ({
          ...prev,
          totalUsers: users.length,
          newUsers: newUsers.length,
          userGrowth: ((newUsers.length / users.length) * 100).toFixed(1)
        }));
      })
    );

    // Monitor active users
    const activeUsersQuery = query(
      collection(db, 'userStatus'),
      where('status', '==', 'online')
    );
    unsubscribers.push(
      onSnapshot(activeUsersQuery, (snapshot) => {
        setStats(prev => ({
          ...prev,
          activeUsers: snapshot.size
        }));
      })
    );

    // Monitor questions and answers
    const questionsQuery = query(collection(db, 'questions'), orderBy('createdAt', 'desc'));
    const answersQuery = query(collection(db, 'answers'), orderBy('createdAt', 'desc'));
    
    unsubscribers.push(
      onSnapshot(questionsQuery, (snapshot) => {
        setStats(prev => ({
          ...prev,
          totalQuestions: snapshot.size
        }));
      })
    );

    unsubscribers.push(
      onSnapshot(answersQuery, (snapshot) => {
        setStats(prev => ({
          ...prev,
          totalAnswers: snapshot.size
        }));
      })
    );

    // Monitor reports
    const reportsQuery = query(
      collection(db, 'reports'),
      where('status', '==', 'pending')
    );
    unsubscribers.push(
      onSnapshot(reportsQuery, (snapshot) => {
        setStats(prev => ({
          ...prev,
          pendingReports: snapshot.size
        }));
      })
    );

    // Monitor recent activity
    const activityQuery = query(
      collection(db, 'activityLogs'),
      orderBy('timestamp', 'desc'),
      limit(20)
    );
    unsubscribers.push(
      onSnapshot(activityQuery, (snapshot) => {
        const activities = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setRecentActivity(activities);
      })
    );

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
      if (auth.currentUser) {
        const userStatusRef = doc(db, 'userStatus', auth.currentUser.uid);
        updateDoc(userStatusRef, {
          status: 'offline',
          lastSeen: serverTimestamp()
        });
      }
    };
  }, [auth.currentUser]);

  // Log user activity
  const logUserActivity = async (action, details) => {
    if (auth.currentUser) {
      await logActivity({
        userId: auth.currentUser.uid,
        username: auth.currentUser.displayName,
        action,
        details,
        timestamp: new Date()
      });
    }
  };

  return {
    stats,
    recentActivity,
    userStatus,
    logUserActivity
  };
} 


