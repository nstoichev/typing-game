import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc,
  updateDoc,
  serverTimestamp,
  arrayUnion
} from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  async function signup(email, password, displayName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's profile with display name
      await updateProfile(userCredential.user, {
        displayName: displayName
      });
      
      return userCredential;
    } catch (error) {
      throw error;
    }
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        return userCredential;
      })
      .catch((error) => {
        console.error('Login error:', error);
        throw error;
      });
  }

  function googleSignIn() {
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  }

  function logout() {
    return signOut(auth)
      .then(() => {
        // Logout successful
      })
      .catch((error) => {
        console.error('Logout error:', error);
        throw error;
      });
  }

  // Function to save test results
  async function saveTestResults(stats) {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      const testData = {
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        timestamp: new Date().toISOString()
      };

      // Check if this exact test result was already saved in the last minute
      const recentTests = userDoc.data()?.recentTests || [];
      const lastTest = recentTests[recentTests.length - 1];
      const now = new Date();
      const lastTestTime = lastTest ? new Date(lastTest.timestamp) : null;
      
      // If we have a recent test with the same stats, skip saving
      if (lastTestTime && 
          now - lastTestTime < 60000 && // Less than 1 minute ago
          lastTest.wpm === testData.wpm && 
          lastTest.accuracy === testData.accuracy) {
        console.log('Duplicate test result detected, skipping save');
        return;
      }

      if (!userDoc.exists()) {
        // Create new user document if it doesn't exist
        await setDoc(userRef, {
          bestWPM: stats.wpm,
          totalTests: 1,
          averageWPM: stats.wpm,
          averageAccuracy: stats.accuracy,
          recentTests: [testData],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        const data = userDoc.data();
        const totalTests = (data.totalTests || 0) + 1;
        const averageWPM = ((data.averageWPM || 0) * (totalTests - 1) + stats.wpm) / totalTests;
        const averageAccuracy = ((data.averageAccuracy || 0) * (totalTests - 1) + stats.accuracy) / totalTests;
        
        await updateDoc(userRef, {
          bestWPM: Math.max(stats.wpm, data.bestWPM || 0),
          totalTests,
          averageWPM,
          averageAccuracy,
          recentTests: arrayUnion(testData),
          updatedAt: serverTimestamp()
        });
      }
      
      // Update local state
      setUserData(prev => ({
        ...prev,
        bestWPM: Math.max(stats.wpm, prev?.bestWPM || 0),
        totalTests: (prev?.totalTests || 0) + 1,
        averageWPM: ((prev?.averageWPM || 0) * (prev?.totalTests || 0) + stats.wpm) / ((prev?.totalTests || 0) + 1),
        averageAccuracy: ((prev?.averageAccuracy || 0) * (prev?.totalTests || 0) + stats.accuracy) / ((prev?.totalTests || 0) + 1),
        recentTests: [...(prev?.recentTests || []), testData].slice(-5) // Keep only last 5 tests
      }));
      
      console.log('Test results saved:', stats);
    } catch (error) {
      console.error('Error saving test results:', error);
      throw error;
    }
  }

  // Function to get user data
  async function getUserData() {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData(data);
        console.log('User data loaded:', data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  useEffect(() => {
    console.log('Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('Auth state changed:', user ? `User logged in: ${user.displayName || user.email}` : 'No user');
      setCurrentUser(user);
      if (user) {
        await getUserData();
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return () => {
      console.log('Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const value = {
    currentUser,
    userData,
    setUserData,
    signup,
    login,
    googleSignIn,
    logout,
    saveTestResults
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
} 