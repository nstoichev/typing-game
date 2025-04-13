import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTeams } from '../contexts/TeamsContext';
import Settings from './Settings';
import './Navigation.css';

const Navigation = ({ 
  onSourceChange,
  currentSource,
  showKeyboard,
  onToggleKeyboard,
  showFingerLayout,
  onToggleFingerLayout,
  showHands,
  onToggleHands,
  hideSourceSelector
}) => {
  const { currentUser, logout } = useAuth();
  const { currentTeam, setCurrentTeam } = useTeams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDisableTeam = () => {
    setCurrentTeam(null);
  };

  // Determine if we're on the practice page
  const isPracticePage = location.pathname === '/practice';

  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link 
            to="/" 
            className={location.pathname === '/' ? 'active' : ''}
          >
            Freestyle
          </Link>
        </li>
        <li>
          <Link 
            to="/practice" 
            className={location.pathname === '/practice' ? 'active' : ''}
          >
            Speed test
          </Link>
        </li>
        {currentUser && (
          <li>
            <Link 
              to="/teams" 
              className={location.pathname === '/teams' ? 'active' : ''}
            >
              Teams
            </Link>
          </li>
        )}
      </ul>

      <div className="right-container">
        <div className="user-info">
          {currentUser ? (
            <>
              <span className="user-name">
                {currentUser.displayName || currentUser.email}
              </span>
              {currentTeam && (
                <div className="team-info">
                  <span>Team: {currentTeam.name}</span>
                  <button onClick={handleDisableTeam} className="disable-team-button">
                    Disable Team
                  </button>
                </div>
              )}
              <Link to="/account" className="account-link">
                Account
              </Link>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="login-button">
              Login
            </Link>
          )}
        </div>

        <Settings
          onSourceChange={onSourceChange}
          currentSource={currentSource}
          showKeyboard={showKeyboard}
          onToggleKeyboard={onToggleKeyboard}
          showFingerLayout={showFingerLayout}
          onToggleFingerLayout={onToggleFingerLayout}
          showHands={showHands}
          onToggleHands={onToggleHands}
          hideSourceSelector={hideSourceSelector}
          showSourceSelector={!isPracticePage}
        />
      </div>
    </nav>
  );
};

export default Navigation; 