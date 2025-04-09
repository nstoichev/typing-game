import React from 'react';
import PropTypes from 'prop-types';
import styles from './ActionButtons.module.css';

const ActionButtons = ({ onRestart, onGenerate, isPracticeMode = false }) => {
  const handleMouseUp = (e) => {
    e.target.blur();
  };

  return (
    <div className={styles.actionButtons}>
      {!isPracticeMode && (
        <button 
          className={styles.button} 
          onClick={onRestart}
          onMouseUp={handleMouseUp}
        >
          Restart
        </button>
      )}
      <button 
        className={styles.button} 
        onClick={onGenerate}
        onMouseUp={handleMouseUp}
      >
        {isPracticeMode ? 'Reset' : 'Generate New Text'}
      </button>
    </div>
  );
};

ActionButtons.propTypes = {
  onRestart: PropTypes.func,
  onGenerate: PropTypes.func.isRequired,
  isPracticeMode: PropTypes.bool
};

export default ActionButtons; 