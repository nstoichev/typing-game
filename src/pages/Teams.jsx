import React, { useState } from 'react';
import { useTeams } from '../contexts/TeamsContext';
import { useAuth } from '../contexts/AuthContext';
import styles from './Teams.module.css';

const Teams = () => {
  const { teams = [], createTeam, joinTeam, currentTeam, setCurrentTeam, loading } = useTeams();
  const { currentUser } = useAuth();
  const [newTeamName, setNewTeamName] = useState('');
  const [joinTeamId, setJoinTeamId] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [copiedTeamId, setCopiedTeamId] = useState(null);
  const [error, setError] = useState('');

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      setError('Team name cannot be empty');
      return;
    }
    try {
      await createTeam(newTeamName.trim());
      setNewTeamName('');
      setShowCreateForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!joinTeamId.trim()) {
      setError('Team ID cannot be empty');
      return;
    }
    try {
      await joinTeam(joinTeamId.trim());
      setJoinTeamId('');
      setShowJoinForm(false);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCopyTeamId = (teamId) => {
    navigator.clipboard.writeText(teamId);
    setCopiedTeamId(teamId);
    setTimeout(() => setCopiedTeamId(null), 2000);
  };

  const handleSelectTeam = (team) => {
    setCurrentTeam(team);
  };

  if (!currentUser) {
    return <div className={styles.loading}>Please log in to access teams</div>;
  }

  if (loading) {
    return <div className={styles.loading}>Loading teams...</div>;
  }

  return (
    <div className="container">
      <div className={styles.teamActions}>
        <button 
          className={`button ${showCreateForm ? 'button--danger' : ''}`}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm ? 'Cancel' : 'Create New Team'}
        </button>
        <button 
          className={`button ${showJoinForm ? 'button--danger' : ''}`}
          onClick={() => setShowJoinForm(!showJoinForm)}
        >
          {showJoinForm ? 'Cancel' : 'Join Team'}
        </button>
      </div>

      {showCreateForm && (
        <form onSubmit={handleCreateTeam} className="form">
          <input
            type="text"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            placeholder="Team name"
            required
          />
          <button type="submit" className="button">Create Team</button>
        </form>
      )}

      {showJoinForm && (
        <form onSubmit={handleJoinTeam} className="form">
          <input
            type="text"
            value={joinTeamId}
            onChange={(e) => setJoinTeamId(e.target.value)}
            placeholder="Enter Team ID"
            required
          />
          <button type="submit" className="button">Join Team</button>
        </form>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.teamsGrid}>
        {teams.length === 0 ? (
          <div className={styles.noTeams}>
            <p>You haven't joined any teams yet.</p>
            <p>Create a new team or join an existing one to get started!</p>
          </div>
        ) : (
          teams.map(team => (
            <div 
              key={team.id} 
              className={`${styles.teamCard} ${currentTeam?.id === team.id ? styles.active : ''}`}
              onClick={() => handleSelectTeam(team)}
            >
              <div className={styles.teamHeader}>
                <h2>{team.name}</h2>
                <div className={styles.teamId}>
                  <span>ID: {team.id}</span>
                  <button 
                    className="button-form"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopyTeamId(team.id);
                    }}
                  >
                    {copiedTeamId === team.id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className={styles.teamStats}>
                <div className={styles.statItem}>
                  <span className="label-text">Average WPM</span>
                  <span className={styles.statValue}>{team.averageWPM?.toFixed(1) || '0.0'}</span>
                </div>
                <div className={styles.statItem}>
                  <span className="label-text">Total Tests</span>
                  <span className={styles.statValue}>{team.totalTests || 0}</span>
                </div>
                <div className={styles.statItem}>
                  <span className="label-text">Best WPM</span>
                  <span className={styles.statValue}>{team.bestWPM?.toFixed(1) || '0.0'}</span>
                </div>
              </div>
              <button 
                className="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTeam(team);
                }}
              >
                {currentTeam?.id === team.id ? 'Selected' : 'Select Team'}
              </button>
            </div>
          ))
        )}
      </div>

      {currentTeam && (
        <div className={styles.teamDetails}>
          <h2>{currentTeam.name} Members</h2>
          <div className={styles.membersTable}>
            <table>
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Best WPM</th>
                  <th>Average WPM</th>
                  <th>Total Tests</th>
                </tr>
              </thead>
              <tbody>
                {currentTeam.members
                  ?.sort((a, b) => b.bestWPM - a.bestWPM)
                  .map((member, index) => (
                    <tr 
                      key={member.id || index}
                      className={member.id === currentUser.uid ? styles.currentUser : ''}
                    >
                      <td>{member.name}</td>
                      <td>{member.bestWPM?.toFixed(1) || '0.0'}</td>
                      <td>{member.averageWPM?.toFixed(1) || '0.0'}</td>
                      <td>{member.totalTests || 0}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Teams; 