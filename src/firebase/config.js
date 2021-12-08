import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCXkxAqrXPt7mO9KM--PSz6dUxmvqXWkKM',
  authDomain: 'site-29403.firebaseapp.com',
  projectId: 'site-29403',
  storageBucket: 'site-29403.appspot.com',
  messagingSenderId: '497504103596',
  appId: '1:497504103596:web:2dc1cab73e5bab32164309',
};

// initialize firebase
const app = initializeApp(firebaseConfig);

// initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
