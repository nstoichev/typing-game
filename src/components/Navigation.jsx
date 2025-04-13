import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navigation.css';

const Navigation = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/auth');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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
      </ul>
    </nav>
  );
};

export default Navigation; 