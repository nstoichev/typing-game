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
  hideSourceSelector,
  onCustomTextStart,
  customTextRef
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
  const isPracticePage = location.pathname === '/speed-test';

  return (
    <nav className="navigation">
      <ul>
        <li>
          <Link 
            to="/" 
            className={`button ${location.pathname === '/' ? 'active' : ''}`}
          >
            Freestyle
          </Link>
        </li>
        <li>
          <Link 
            to="/speed-test" 
            className={`button ${location.pathname === '/speed-test' ? 'active' : ''}`}
          >
            Speed test
          </Link>
        </li>
      </ul>

      <div className="right-container">
        <div className="user-info">
          {currentUser ? (
            <>
              <span className="user-name">
                {currentUser.displayName || currentUser.email}
              </span>
              {currentTeam && (
                <div className={`team-info ${!isPracticePage ? 'team-info--disabled' : ''}`}>
                  <span>Team: {currentTeam.name}</span>
                  <button onClick={handleDisableTeam} className="button button--small button--danger">
                    Disable Team
                  </button>
                </div>
              )}
              <Link 
                to="/account" 
                className={`button ${location.pathname === '/account' ? 'active' : ''}`}
              >
                Account
              </Link>
              {currentUser && (
                  <Link 
                    to="/teams" 
                    className={`button ${location.pathname === '/teams' ? 'active' : ''}`}
                  >
                    Teams
                  </Link>
              )}              
              <button onClick={handleLogout} className="button button--danger">
                Logout
              </button>
            </>
          ) : (
            <Link to="/auth" className="button button--success">
              Login
            </Link>
          )}
        </div>

        {location.pathname !== '/auth' && (
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
            onCustomTextStart={onCustomTextStart || (() => {})}
            customTextRef={customTextRef}
          />
        )}
      </div>
    </nav>
  );
};

export default Navigation; 