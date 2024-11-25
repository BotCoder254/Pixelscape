import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBMjKssyRSZJ16EhSdVOFd2XjIkj8_BT-E",
  authDomain: "twitterclone-47ebf.firebaseapp.com",
  databaseURL: "https://twitterclone-47ebf-default-rtdb.firebaseio.com",
  projectId: "twitterclone-47ebf",
  storageBucket: "twitterclone-47ebf.appspot.com",
  messagingSenderId: "700556014223",
  appId: "1:700556014223:web:a0646158ade0b1e55ab6fa"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize services
const firebaseAuth = getAuth(firebaseApp);
const firebaseDb = getFirestore(firebaseApp);
const firebaseStorage = getStorage(firebaseApp);

// Use emulators if in development
if (process.env.NODE_ENV === 'development') {
  try {
    connectAuthEmulator(firebaseAuth, 'http://localhost:9099');
    connectFirestoreEmulator(firebaseDb, 'localhost', 8080);
    connectStorageEmulator(firebaseStorage, 'localhost', 9199);
  } catch (error) {
    console.error('Error connecting to emulators:', error);
  }
}

export { firebaseApp, firebaseAuth as auth, firebaseDb as db, firebaseStorage as storage }; 