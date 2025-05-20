
import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useToast } from "@/hooks/use-toast";

interface Request {
  id: string;
  userId: string;
  timestamp: Timestamp;
  [key: string]: any;
}

export const useRequestsData = (admin: any, collectionName: string) => {
  const [requests, setRequests] = useState<Request[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (!admin) return;
    
    try {
      const q = query(
        collection(db, collectionName),
        orderBy("timestamp", "desc")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedRequests = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Request[];
        setRequests(fetchedRequests);
      }, (error) => {
        console.error(`Error fetching ${collectionName}:`, error);
        toast({
          title: "Error",
          description: `Could not load ${collectionName}`,
          variant: "destructive",
        });
      });
      
      return () => unsubscribe();
    } catch (error) {
      console.error(`Error setting up ${collectionName} listener:`, error);
    }
  }, [admin, collectionName, toast]);

  return requests;
};
