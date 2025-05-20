
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, collection, query, where, orderBy, onSnapshot, Query, QuerySnapshot } from 'firebase/firestore';
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

// Enable better error messages during development
if (process.env.NODE_ENV === 'development') {
  // Uncomment for local emulator if needed
  // connectFirestoreEmulator(db, '127.0.0.1', 8080);
}

// Helper function to log Firestore queries during development
export const logQuery = (collectionName: string, filters: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`Querying ${collectionName} with filters:`, filters);
  }
};

// Improved helper function to create safe queries with progressive fallbacks
export const createSafeQuery = (collectionPath: string, userId: string) => {
  const collectionRef = collection(db, collectionPath);
  
  try {
    // Try full query with ordering first
    console.log(`Creating ordered query for ${collectionPath}`);
    return query(
      collectionRef,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
  } catch (error) {
    console.warn(`Error creating ordered query for ${collectionPath}:`, error);
    console.log(`Falling back to unordered query for ${collectionPath}`);
    
    // Fall back to query without ordering
    return query(
      collectionRef,
      where("userId", "==", userId)
    );
  }
};

// Helper function for messages queries with progressive fallbacks
export const createMessagesQuery = (userId: string) => {
  const messagesRef = collection(db, "messages");
  
  try {
    // Try full query with ordering first
    console.log("Creating ordered messages query");
    return query(
      messagesRef,
      where("recipientId", "==", userId),
      orderBy("timestamp", "desc")
    );
  } catch (error) {
    console.warn("Error creating ordered messages query:", error);
    console.log("Falling back to unordered messages query");
    
    // Fall back to query without ordering
    return query(
      messagesRef,
      where("recipientId", "==", userId)
    );
  }
};

// Safer function to execute a query with fallbacks
export const executeSafeQuery = (
  queryFn: () => Query, 
  onSuccess: (snapshot: QuerySnapshot) => void,
  onError: (error: any) => void
) => {
  // Try the main query first
  try {
    const mainQuery = queryFn();
    return onSnapshot(mainQuery, onSuccess, (error) => {
      console.error("Error with main query:", error);
      
      // If the main query fails, try a simpler fallback
      try {
        // This is a simplified version that we might implement later if needed
        onError(error);
      } catch (fallbackError) {
        onError(fallbackError);
      }
    });
  } catch (setupError) {
    console.error("Error setting up query:", setupError);
    onError(setupError);
    // Return a no-op unsubscribe function
    return () => {};
  }
};

// Helper function to create individual collection queries
export const createCollectionQuery = (collectionName: string, userId: string) => {
  const collectionRef = collection(db, collectionName);
  
  // First try with ordering
  try {
    return {
      query: query(
        collectionRef,
        where("userId", "==", userId),
        orderBy("createdAt", "desc")
      ),
      ordered: true
    };
  } catch (error) {
    console.warn(`Could not create ordered query for ${collectionName}:`, error);
    
    // Fall back to unordered
    return {
      query: query(
        collectionRef,
        where("userId", "==", userId)
      ),
      ordered: false
    };
  }
};

export { auth, googleProvider, db, storage };
export default app;
