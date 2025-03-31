import { db } from '../firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs,  // Added missing import
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp 
} from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

// Create a new meeting
export const createMeeting = async (userId, meetingName = 'Untitled Meeting') => {
  try {
    const meetingId = uuidv4();
    
    // Add meeting to Firestore
    await addDoc(collection(db, 'meetings'), {
      meetingId,
      name: meetingName,
      hostId: userId,
      createdAt: serverTimestamp(),
      active: true
    });
    
    return meetingId;
  } catch (error) {
    console.error('Error creating meeting:', error);
    throw error;
  }
};

// Get meeting details
export const getMeeting = async (meetingId) => {
  try {
    // Query for the meeting
    const meetingsRef = collection(db, 'meetings');
    const q = query(meetingsRef, where('meetingId', '==', meetingId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      throw new Error('Meeting not found');
    }
    
    // Return the first matching document
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };
  } catch (error) {
    console.error('Error getting meeting:', error);
    throw error;
  }
};

// End a meeting
export const endMeeting = async (meetingId) => {
  try {
    // Query for the meeting
    const meetingsRef = collection(db, 'meetings');
    const q = query(meetingsRef, where('meetingId', '==', meetingId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      throw new Error('Meeting not found');
    }
    
    // Update the meeting to mark it as inactive
    const meetingDocRef = doc(db, 'meetings', snapshot.docs[0].id);
    await updateDoc(meetingDocRef, {
      active: false,
      endedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error ending meeting:', error);
    throw error;
  }
};

// Track user joining a meeting
export const joinMeeting = async (userId, userName, meetingId) => {
  try {
    // Add a record of the user joining
    await addDoc(collection(db, 'meetingParticipants'), {
      userId,
      userName,
      meetingId,
      joinedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error tracking join meeting:', error);
    throw error;
  }
};

// Get user's recent meetings
export const getUserMeetings = async (userId) => {
  try {
    // Query for meetings hosted by the user
    const meetingsRef = collection(db, 'meetings');
    const q = query(meetingsRef, where('hostId', '==', userId));
    const snapshot = await getDocs(q);
    
    // Return the meetings
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting user meetings:', error);
    throw error;
  }
};