import { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  arrayUnion,
  query,
  getDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const TeamsContext = createContext();

export function useTeams() {
  return useContext(TeamsContext);
}

export function TeamsProvider({ children }) {
  const [teams, setTeams] = useState([]);
  const [currentTeam, setCurrentTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  // Function to create a new team
  const createTeam = async (teamName) => {
    try {
      // Validate team name
      const trimmedName = teamName.trim();
      
      if (trimmedName.length < 3) {
        throw new Error('Team name must be at least 3 characters long');
      }
      
      if (trimmedName.length > 50) {
        throw new Error('Team name cannot exceed 50 characters');
      }
      
      // Only allow alphanumeric characters, spaces, and basic punctuation
      if (!/^[a-zA-Z0-9\s.,!?'"-]+$/.test(trimmedName)) {
        throw new Error('Team name can only contain letters, numbers, spaces, and basic punctuation');
      }

      const teamRef = await addDoc(collection(db, 'teams'), {
        name: trimmedName,
        createdAt: new Date(),
        members: [{
          id: currentUser.uid,
          name: currentUser.displayName || currentUser.email,
          bestWPM: 0,
          totalTests: 0,
          averageWPM: 0
        }],
        totalTests: 0,
        averageWPM: 0,
        bestWPM: 0
      });

      const newTeam = {
        id: teamRef.id,
        name: trimmedName,
        members: [{
          id: currentUser.uid,
          name: currentUser.displayName || currentUser.email,
          bestWPM: 0,
          totalTests: 0,
          averageWPM: 0
        }],
        totalTests: 0,
        averageWPM: 0,
        bestWPM: 0
      };

      setTeams(prev => [...prev, newTeam]);
      setCurrentTeam(newTeam);
      return teamRef.id;
    } catch (error) {
      console.error('Error creating team:', error);
      throw error;
    }
  };

  // Function to join a team
  const joinTeam = async (teamId) => {
    try {
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      
      if (!teamDoc.exists()) {
        throw new Error('Team not found');
      }

      const teamData = teamDoc.data();
      const isAlreadyMember = teamData.members.some(member => member.id === currentUser.uid);

      if (!isAlreadyMember) {
        await updateDoc(teamRef, {
          members: arrayUnion({
            id: currentUser.uid,
            name: currentUser.displayName || currentUser.email,
            bestWPM: 0,
            totalTests: 0,
            averageWPM: 0
          })
        });

        await fetchUserTeams();
      }
    } catch (error) {
      console.error('Error joining team:', error);
      throw error;
    }
  };

  // Function to update team stats
  const updateTeamStats = async (teamId, stats) => {
    try {
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      
      if (!teamDoc.exists()) {
        throw new Error('Team not found');
      }

      const teamData = teamDoc.data();
      const memberIndex = teamData.members.findIndex(member => member.id === currentUser.uid);
      
      if (memberIndex === -1) {
        throw new Error('User is not a member of this team');
      }

      const updatedMembers = [...teamData.members];
      const member = updatedMembers[memberIndex];
      
      // Update member stats
      member.totalTests = (member.totalTests || 0) + 1;
      member.averageWPM = ((member.averageWPM || 0) * (member.totalTests - 1) + stats.wpm) / member.totalTests;
      member.bestWPM = Math.max(member.bestWPM || 0, stats.wpm);

      // Update team stats
      const totalTests = teamData.totalTests + 1;
      const averageWPM = ((teamData.averageWPM || 0) * (teamData.totalTests || 0) + stats.wpm) / totalTests;
      const bestWPM = Math.max(teamData.bestWPM || 0, stats.wpm);

      await updateDoc(teamRef, {
        members: updatedMembers,
        totalTests,
        averageWPM,
        bestWPM
      });

      const updatedTeam = {
        ...teamData,
        id: teamId,
        members: updatedMembers,
        totalTests,
        averageWPM,
        bestWPM
      };

      setTeams(prev => prev.map(team => 
        team.id === teamId ? updatedTeam : team
      ));
      setCurrentTeam(prev => prev?.id === teamId ? updatedTeam : prev);
    } catch (error) {
      console.error('Error updating team stats:', error);
      throw error;
    }
  };

  // Function to fetch user's teams
  const fetchUserTeams = async () => {
    if (!currentUser) {
      setTeams([]);
      setLoading(false);
      return;
    }

    try {
      const teamsQuery = query(collection(db, 'teams'));
      const querySnapshot = await getDocs(teamsQuery);
      
      const userTeams = await Promise.all(querySnapshot.docs.map(async doc => {
        const teamData = doc.data();
        
        // Get member stats from recentTests
        const memberStats = {};
        if (teamData.stats?.recentTests) {
          teamData.stats.recentTests.forEach(test => {
            if (!memberStats[test.userId]) {
              memberStats[test.userId] = {
                totalTests: 0,
                totalWPM: 0,
                bestWPM: 0
              };
            }
            const stats = memberStats[test.userId];
            stats.totalTests++;
            stats.totalWPM += test.wpm;
            stats.bestWPM = Math.max(stats.bestWPM, test.wpm);
          });
        }

        // Convert members array to proper format with stats and names
        const members = Array.isArray(teamData.members) 
          ? teamData.members.map(member => {
              const userId = typeof member === 'string' ? member : member.id;
              
              // If member is an object, use its existing stats
              const existingStats = typeof member === 'object' ? {
                bestWPM: member.bestWPM || 0,
                totalTests: member.totalTests || 0,
                averageWPM: member.averageWPM || 0
              } : null;

              // Use existing stats if available, otherwise calculate from recentTests
              const stats = existingStats || memberStats[userId] || {
                totalTests: 0,
                totalWPM: 0,
                bestWPM: 0
              };

              return {
                id: userId,
                name: member.name || 'Unknown',
                bestWPM: stats.bestWPM,
                totalTests: stats.totalTests,
                averageWPM: stats.averageWPM || (stats.totalTests > 0 ? stats.totalWPM / stats.totalTests : 0)
              };
            })
          : [];

        // Calculate team stats from members
        const teamStats = members.reduce((acc, member) => {
          acc.totalTests += member.totalTests;
          acc.totalWPM += member.averageWPM * member.totalTests;
          acc.bestWPM = Math.max(acc.bestWPM, member.bestWPM);
          return acc;
        }, { totalTests: 0, totalWPM: 0, bestWPM: 0 });

        const averageWPM = teamStats.totalTests > 0 ? teamStats.totalWPM / teamStats.totalTests : 0;

        return {
          id: doc.id,
          name: teamData.name,
          members,
          averageWPM,
          totalTests: teamStats.totalTests,
          bestWPM: teamStats.bestWPM,
          stats: {
            averageAccuracy: teamData.stats?.averageAccuracy || 0,
            averageWPM,
            bestWPM: teamStats.bestWPM,
            recentTests: teamData.stats?.recentTests || [],
            totalTests: teamStats.totalTests
          },
          createdAt: teamData.createdAt
        };
      }));

      const filteredTeams = userTeams.filter(team => 
        team.members.some(member => member.id === currentUser.uid)
      );

      setTeams(filteredTeams);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  // Function to leave a team
  const leaveTeam = async (teamId) => {
    try {
      const teamRef = doc(db, 'teams', teamId);
      const teamDoc = await getDoc(teamRef);
      
      if (!teamDoc.exists()) {
        throw new Error('Team not found');
      }

      const teamData = teamDoc.data();
      const memberToRemove = teamData.members.find(member => member.id === currentUser.uid);

      if (!memberToRemove) {
        throw new Error('You are not a member of this team');
      }

      // If user is the only member, delete the team instead
      if (teamData.members.length === 1) {
        await deleteDoc(teamRef);
        setTeams(prev => prev.filter(team => team.id !== teamId));
        if (currentTeam?.id === teamId) {
          setCurrentTeam(null);
        }
        return;
      }

      // Remove the user from members array
      const remainingMembers = teamData.members.filter(member => member.id !== currentUser.uid);

      // Recalculate team stats from remaining members (same logic as fetchUserTeams)
      const teamStats = remainingMembers.reduce((acc, member) => {
        const memberTests = member.totalTests || 0;
        const memberAvgWPM = member.averageWPM || 0;
        acc.totalTests += memberTests;
        acc.totalWPM += memberAvgWPM * memberTests;
        acc.bestWPM = Math.max(acc.bestWPM, member.bestWPM || 0);
        return acc;
      }, { totalTests: 0, totalWPM: 0, bestWPM: 0 });

      const averageWPM = teamStats.totalTests > 0 ? teamStats.totalWPM / teamStats.totalTests : 0;

      // Update the team document
      await updateDoc(teamRef, {
        members: remainingMembers,
        totalTests: teamStats.totalTests,
        averageWPM: averageWPM,
        bestWPM: teamStats.bestWPM
      });

      // Update local state - remove team from user's teams list
      setTeams(prev => prev.filter(team => team.id !== teamId));
      if (currentTeam?.id === teamId) {
        setCurrentTeam(null);
      }
    } catch (error) {
      console.error('Error leaving team:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUserTeams();
  }, [currentUser]);

  // Reset currentTeam when user changes
  useEffect(() => {
    if (!currentUser) {
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
    fetchUserTeams,
    leaveTeam
  };

  return (
    <TeamsContext.Provider value={value}>
      {children}
    </TeamsContext.Provider>
  );
}