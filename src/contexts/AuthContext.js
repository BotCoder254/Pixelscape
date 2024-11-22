import { createContext, useContext, useState, useEffect } from 'react';

import { 

  auth,

  db,

  storage,

  googleProvider

} from '../firebase/config';

import { 

  createUserWithEmailAndPassword,

  signInWithEmailAndPassword,

  signInWithPopup,

  signOut,

  updateProfile,

  sendPasswordResetEmail,

  updateEmail,

  updatePassword

} from 'firebase/auth';

import { 

  doc, 

  setDoc, 

  getDoc, 

  updateDoc 

} from 'firebase/firestore';

import { 

  ref, 

  uploadBytes, 

  getDownloadURL 

} from 'firebase/storage';



const AuthContext = createContext(null);



export function useAuth() {

  const context = useContext(AuthContext);

  if (!context) {

    throw new Error('useAuth must be used within an AuthProvider');

  }

  return context;

}



export function AuthProvider({ children }) {

  const [currentUser, setCurrentUser] = useState(null);

  const [userRole, setUserRole] = useState('user');

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    const unsubscribe = auth.onAuthStateChanged(async (user) => {

      setCurrentUser(user);

      if (user) {

        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (userDoc.exists()) {

          setUserRole(userDoc.data().role);

        }

      }

      setLoading(false);

    });



    return unsubscribe;

  }, []);



  async function signup(email, password, username) {

    try {

      const result = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(result.user, { displayName: username });

      

      // Create user document in Firestore

      await setDoc(doc(db, 'users', result.user.uid), {

        username,

        email,

        role: 'user',

        bio: '',

        avatarUrl: '',

        createdAt: new Date().toISOString(),

        reputation: 0

      });

      

      return result;

    } catch (error) {

      throw error;

    }

  }



  async function updateUserProfile(data) {

    const user = auth.currentUser;

    const updates = {};

    

    if (data.username) {

      await updateProfile(user, { displayName: data.username });

      updates.username = data.username;

    }

    

    if (data.bio) updates.bio = data.bio;

    

    if (data.avatar) {

      const fileRef = ref(storage, `avatars/${user.uid}`);

      await uploadBytes(fileRef, data.avatar);

      const avatarUrl = await getDownloadURL(fileRef);

      await updateProfile(user, { photoURL: avatarUrl });

      updates.avatarUrl = avatarUrl;

    }

    

    if (Object.keys(updates).length > 0) {

      await updateDoc(doc(db, 'users', user.uid), updates);

    }

  }



  async function resetPassword(email) {

    return sendPasswordResetEmail(auth, email);

  }



  async function updateUserEmail(email) {

    try {

      await updateEmail(auth.currentUser, email);

      await updateDoc(doc(db, 'users', auth.currentUser.uid), { email });

    } catch (error) {

      throw error;

    }

  }



  async function updateUserPassword(newPassword) {

    return updatePassword(auth.currentUser, newPassword);

  }



  async function login(email, password) {

    return signInWithEmailAndPassword(auth, email, password);

  }



  async function googleSignIn() {

    try {

      const result = await signInWithPopup(auth, googleProvider);

      

      // Check if user document exists, if not create it

      const userDoc = await getDoc(doc(db, 'users', result.user.uid));

      if (!userDoc.exists()) {

        await setDoc(doc(db, 'users', result.user.uid), {

          username: result.user.displayName,

          email: result.user.email,

          role: 'user',

          bio: '',

          avatarUrl: result.user.photoURL,

          createdAt: new Date().toISOString(),

          reputation: 0

        });

      }

      

      return result;

    } catch (error) {

      throw error;

    }

  }



  function logout() {

    return signOut(auth);

  }



  const value = {

    currentUser,

    userRole,

    signup,

    login,

    googleSignIn,

    logout,

    resetPassword,

    updateUserProfile,

    updateUserEmail,

    updateUserPassword

  };



  return (

    <AuthContext.Provider value={value}>

      {!loading && children}

    </AuthContext.Provider>

  );

} 
