import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  arrayUnion,
  query,
  where
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const TeamsContext = createContext();

export function useTeams() {
  return useContext(TeamsContext);
}

export function TeamsProvider({ children }) {
  const { currentUser } = useAuth();
  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create a new team
  const createTeam = async (teamName) => {
    if (!currentUser) return;
    
    try {
      const teamRef = doc(collection(db, 'teams'));
      const teamData = {
        name: teamName,
        members: [currentUser.uid],
        createdAt: new Date(),
        stats: {
          averageWPM: 0,
          averageAccuracy: 0,
          totalTests: 0,
          bestWPM: 0,
          recentTests: []
        }
      };
      
      await setDoc(teamRef, teamData);
      // After creating the team, fetch the updated list of teams
      await fetchUserTeams();
      return teamRef.id;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  };

  // Join an existing team
  const joinTeam = async (teamId) => {
    if (!currentUser) return;
    
    try {
      const teamRef = doc(db, 'teams', teamId);
      await updateDoc(teamRef, {
        members: arrayUnion(currentUser.uid)
      });
      // After joining the team, fetch the updated list of teams
      await fetchUserTeams();
    } catch (error) {
      console.error('Error joining team:', error);
      throw error;
    }
  };

  // Update team statistics when a member completes a test
  const updateTeamStats = async (teamId, testStats) => {
    try {
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      
      if (teamDoc.exists()) {
        const teamData = teamDoc.data();
        const stats = teamData.stats;
        const totalTests = stats.totalTests + 1;
        
        const updatedStats = {
          averageWPM: ((stats.averageWPM * stats.totalTests) + testStats.wpm) / totalTests,
          averageAccuracy: ((stats.averageAccuracy * stats.totalTests) + testStats.accuracy) / totalTests,
          totalTests: totalTests,
          bestWPM: Math.max(stats.bestWPM, testStats.wpm),
          recentTests: [...stats.recentTests, {
            userId: currentUser.uid,
            userName: currentUser.displayName || currentUser.email,
            wpm: testStats.wpm,
            accuracy: testStats.accuracy,
            timestamp: new Date()
          }].slice(-10) // Keep last 10 tests
        };
        
        await updateDoc(teamRef, {
          stats: updatedStats
        });
        // After updating stats, fetch the updated list of teams
        await fetchUserTeams();
      }
    } catch (error) {
      console.error('Error updating team stats:', error);
      throw error;
    }
  };

  // Fetch teams the current user is a member of
  const fetchUserTeams = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const teamsQuery = query(
        collection(db, 'teams'),
        where('members', 'array-contains', currentUser.uid)
      );
      
      const querySnapshot = await getDocs(teamsQuery);
      const teamsData = [];
      
      querySnapshot.forEach((doc) => {
        teamsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setTeams(teamsData);
    } catch (error) {
      console.error('Error fetching user teams:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchUserTeams();
    } else {
      setTeams([]);
      setCurrentTeam(null);
    }
  }, [currentUser]);

  const value = {
    teams,
    currentTeam,
    setCurrentTeam,
    loading,
    createTeam,
    joinTeam,
    updateTeamStats,
    fetchUserTeams
  };

  return (
    <TeamsContext.Provider value={value}>
      {children}
    </TeamsContext.Provider>
  );
} 