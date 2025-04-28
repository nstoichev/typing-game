import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTeams } from '../contexts/TeamsContext';
import { useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import './ResultsModal.css';

const ResultsModal = ({ stats, onTryAgain, onGenerate, isPracticeMode = false }) => {
  const { saveTestResults } = useAuth();
  const { currentTeam } = useTeams();
  const location = useLocation();
  const MAX_WRONG_WORDS = 20;
  const wrongWords = stats.wrongWords.slice(0, MAX_WRONG_WORDS);
  const hasMoreWords = stats.wrongWords.length > MAX_WRONG_WORDS;
  const hasSavedRef = React.useRef(false);

  React.useEffect(() => {
    if (stats && !hasSavedRef.current) {
      hasSavedRef.current = true;
      // Only save team stats if we're on the practice page
      const teamId = location.pathname === '/practice' ? currentTeam?.id : null;
      saveTestResults(stats, teamId).catch(error => {
        hasSavedRef.current = false; // Reset the flag if save fails
      });
    }
  }, [stats, saveTestResults, currentTeam, location.pathname]);

  return (
    <div className="modal-overlay">
      <div className="stats-modal">
        <h2>Typing Results</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{stats?.wpm || 0}</div>
            <div className="stat-label">WPM</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats?.accuracy?.toFixed(1) || 0}%</div>
            <div className="stat-label">Accuracy</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{stats.wrongWords.length}</div>
            <div className="stat-label">Mistakes</div>
          </div>
        </div>
        {stats.wrongWords.length > 0 && (
          <div className="mistakes-section">
            <h3>Words to Practice</h3>
            {!hasMoreWords && (
              <div className="wrong-words-list">
                {wrongWords.map((word, index) => (
                  <span key={index} className="wrong-word">{word}</span>
                ))}
              </div>
            )}
            {hasMoreWords && (
              <div className="funny-message">
                <p>We stopped counting at 20! You're really going for the world record in typos! 🏆</p>
              </div>
            )}
          </div>
        )}
        <div className="action-buttons">
          {!isPracticeMode && (
            <button className="action-button" onClick={onTryAgain}>
              Restart
            </button>
          )}
          <button className="action-button" onClick={onGenerate}>
            {isPracticeMode ? 'Reset' : 'Generate New Text'}
          </button>
        </div>
      </div>
    </div>
  );
};

ResultsModal.propTypes = {
  stats: PropTypes.shape({
    wpm: PropTypes.number,
    accuracy: PropTypes.number,
    wrongWords: PropTypes.array.isRequired
  }).isRequired,
  onTryAgain: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired,
  isPracticeMode: PropTypes.bool
};

export default ResultsModal; 