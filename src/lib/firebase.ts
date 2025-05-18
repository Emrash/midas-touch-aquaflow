
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCEuVKCvx7aORAeWw-TqKa092YzIMDKDLE",
  authDomain: "midastouch-cc5e2.firebaseapp.com",
  projectId: "midastouch-cc5e2",
  storageBucket: "midastouch-cc5e2.firebaseapp.com",
  messagingSenderId: "935986162581",
  appId: "1:935986162581:web:52928c8a8f7ec56aade49c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, googleProvider, db, storage };
export default app;
