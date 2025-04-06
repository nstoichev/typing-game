import React from 'react';
import PropTypes from 'prop-types';
import styles from './GameButtons.module.css';

const GameButtons = ({ onOneMinuteGame }) => {
  const handleMouseUp = (e) => {
    e.target.blur();
  };

  return (
    <div className={styles.gameButtons}>
      <button 
        className={styles.button} 
        onClick={onOneMinuteGame}
        onMouseUp={handleMouseUp}
      >
        1 Minute Game
      </button>
    </div>
  );
};

GameButtons.propTypes = {
  onOneMinuteGame: PropTypes.func.isRequired
};

export default GameButtons; 