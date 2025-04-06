import React from 'react';
import PropTypes from 'prop-types';
import styles from './ActionButtons.module.css';

const ActionButtons = ({ onRestart, onGenerate, onOneMinuteGame }) => {
  const handleMouseUp = (e) => {
    e.target.blur();
  };

  return (
    <div className={styles.actionButtons}>
      <button 
        className={styles.button} 
        onClick={onRestart}
        onMouseUp={handleMouseUp}
      >
        Restart
      </button>
      <button 
        className={styles.button} 
        onClick={onGenerate}
        onMouseUp={handleMouseUp}
      >
        Generate New Text
      </button>
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

ActionButtons.propTypes = {
  onRestart: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired,
  onOneMinuteGame: PropTypes.func.isRequired
};

export default ActionButtons; 