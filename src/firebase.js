import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB7MlXKy-dTExwiahxZdD8QrxdjVy4iC7Q",
  authDomain: "zoom-clone-5c8eb.firebaseapp.com",
  projectId: "zoom-clone-5c8eb",
  storageBucket: "zoom-clone-5c8eb.firebasestorage.app",
  messagingSenderId: "936084399101",
  appId: "1:936084399101:web:8685492ec08b4fd7b1ef94",
  measurementId: "G-9QRFFT8HY0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { auth, db, analytics };