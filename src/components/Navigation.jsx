import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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

  // Determine if we're on the practice page
  const isPracticePage = location.pathname === '/practice';

  return (
    <nav className="navigation">
      <ul>
        <li><NavLink to="/" end>Freestyle</NavLink></li>
        <li><NavLink to="/practice">Speed test</NavLink></li> 
        {currentUser && (
          <>
            <li className="user-info">
              <span>Welcome, {currentUser.displayName || currentUser.email}</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </li>          
            <li><NavLink to="/account">Account</NavLink></li>
          </>
        )}
        
        <li>
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
        </li>
      </ul>
    </nav>
  );
};

export default Navigation; 