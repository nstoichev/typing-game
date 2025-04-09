import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  return (
    <nav className="navigation">
      <ul>
        <li><NavLink to="/" end>Freestyle</NavLink></li>
        <li><NavLink to="/practice">Speed test</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navigation; 