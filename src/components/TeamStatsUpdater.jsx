import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTeams } from '../contexts/TeamsContext';
import { useLocation } from 'react-router-dom';

export default function TeamStatsUpdater() {
  const { currentUser, userData } = useAuth();
  const { currentTeam, updateTeamStats } = useTeams();
  const lastTestRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    // Only update team stats if we're on the practice page
    if (location.pathname === '/practice' && currentUser && currentTeam && userData?.recentTests?.length > 0) {
      const latestTest = userData.recentTests[userData.recentTests.length - 1];
      
      // Only update if:
      // 1. This is a new test (not the same as the last one we processed)
      // 2. The test was completed while this team was selected
      if ((!lastTestRef.current || 
          lastTestRef.current.timestamp !== latestTest.timestamp ||
          lastTestRef.current.wpm !== latestTest.wpm ||
          lastTestRef.current.accuracy !== latestTest.accuracy) &&
          latestTest.teamId === currentTeam.id) {
        
        updateTeamStats(currentTeam.id, {
          wpm: latestTest.wpm,
          accuracy: latestTest.accuracy
        });
        
        // Store the test we just processed
        lastTestRef.current = latestTest;
      }
    }
  }, [currentUser, currentTeam, userData?.recentTests, location.pathname]);

  return null;
} 