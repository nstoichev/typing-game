import React from 'react';
import PropTypes from 'prop-types';
import styles from './GameButtons.module.css';

const GameButtons = ({ onOneMinuteGame, disabled, isOneMinuteMode }) => {
  const handleMouseUp = (e) => {
    e.target.blur();
  };

  const handleFreestyle = () => {
    onOneMinuteGame(null); // Pass null to indicate freestyle mode
  };

  return (
    <div className={styles.gameButtons}>
      <button 
        className={`${styles.button} ${!isOneMinuteMode ? styles.active : ''}`} 
        onClick={handleFreestyle}
        onMouseUp={handleMouseUp}
        disabled={disabled}
      >
        Freestyle
      </button>
      <button 
        className={`${styles.button} ${isOneMinuteMode ? styles.active : ''}`} 
        onClick={() => onOneMinuteGame(60)}
        onMouseUp={handleMouseUp}
        disabled={disabled}
      >
        1 Minute Game
      </button>
    </div>
  );
};

GameButtons.propTypes = {
  onOneMinuteGame: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  isOneMinuteMode: PropTypes.bool
};

export default GameButtons; 