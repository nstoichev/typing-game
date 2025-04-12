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
      {currentUser && (
        <div className="user-info">
          <span>Welcome, {currentUser.displayName || currentUser.email}</span>
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
      )}      
      <ul>
        <li><NavLink to="/" end>Freestyle</NavLink></li>
        <li><NavLink to="/practice">Speed test</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navigation; 