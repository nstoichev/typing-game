import React from 'react';
import PropTypes from 'prop-types';
import styles from './ActionButtons.module.css';

const ActionButtons = ({ onRestart, onGenerate }) => {
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
    </div>
  );
};

ActionButtons.propTypes = {
  onRestart: PropTypes.func.isRequired,
  onGenerate: PropTypes.func.isRequired
};

export default ActionButtons; 