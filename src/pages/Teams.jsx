import React, { useState, useEffect } from 'react';
import { useTeams } from '../contexts/TeamsContext';
import { useAuth } from '../contexts/AuthContext';
import styles from './Teams.module.css';

const Teams = () => {
  const { teams = [], createTeam, joinTeam, setCurrentTeam, loading } = useTeams();
  const { currentUser } = useAuth();
  const [newTeamName, setNewTeamName] = useState('');
  const [joinTeamId, setJoinTeamId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [copiedTeamId, setCopiedTeamId] = useState(null);

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await createTeam(newTeamName);
      setNewTeamName('');
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating team:', error);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    try {
      await joinTeam(joinTeamId);
      setJoinTeamId('');
      setShowJoinForm(false);
    } catch (error) {
      console.error('Error joining team:', error);
    }
  };

  const handleCopyTeamId = (teamId) => {
    navigator.clipboard.writeText(teamId);
    setCopiedTeamId(teamId);
    setTimeout(() => setCopiedTeamId(null), 2000);
  };

  if (!currentUser) {
    return <div className={styles.loading}>Please log in to access teams</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Loading teams...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.teamActions}>
        <button 
          className={styles.actionButton}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create New Team'}
        </button>
        <button 
          className={styles.actionButton}
          onClick={() => setShowJoinForm(!showJoinForm)}
        >
          {showJoinForm ? 'Cancel' : 'Join Team'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateTeam} className={styles.form}>
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Team name"
            required
          />
          <button type="submit" className={styles.submitButton}>Create Team</button>
        </form>
      )}

      {showJoinForm && (
        <form onSubmit={handleJoinTeam} className={styles.form}>
          <input
            type="text"
            value={joinTeamId}
            onChange={(e) => setJoinTeamId(e.target.value)}
            placeholder="Enter Team ID"
            required
          />
          <button type="submit" className={styles.submitButton}>Join Team</button>
        </form>
      )}

      <div className={styles.teamsGrid}>
        {teams.length === 0 ? (
          <div className={styles.noTeams}>
            <p>You haven't joined any teams yet.</p>
            <p>Create a new team or join an existing one to get started!</p>
          </div>
        ) : (
          teams.map(team => (
            <div key={team.id} className={styles.teamCard}>
              <div className={styles.teamHeader}>
                <h2>{team.name}</h2>
                <div className={styles.teamId}>
                  <span>ID: {team.id}</span>
                  <button 
                    className={styles.copyButton}
                    onClick={() => handleCopyTeamId(team.id)}
                  >
                    {copiedTeamId === team.id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className={styles.teamStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Average WPM</span>
                  <span className={styles.statValue}>{team.stats.averageWPM.toFixed(1)}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Accuracy</span>
                  <span className={styles.statValue}>{team.stats.averageAccuracy.toFixed(1)}%</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Total Tests</span>
                  <span className={styles.statValue}>{team.stats.totalTests}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Best WPM</span>
                  <span className={styles.statValue}>{team.stats.bestWPM}</span>
                </div>
              </div>
              <button 
                className={styles.selectButton}
                onClick={() => setCurrentTeam(team)}
              >
                Select Team
              </button>
              {team.recentTests && team.recentTests.length > 0 && (
                <div className={styles.recentTests}>
                  <h3>Recent Activity</h3>
                  {team.recentTests.map((test, index) => (
                    <div key={index} className={styles.testItem}>
                      <span>{test.userName}</span>
                      <span>{test.wpm} WPM</span>
                      <span>{test.accuracy}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Teams; 