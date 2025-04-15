import React from 'react';
import PropTypes from 'prop-types';
import styles from './ActionButtons.module.css';

const ActionButtons = ({ onRestart, onGenerate, isPracticeMode = false, isLoading = false }) => {
  const handleMouseUp = (e) => {
    e.target.blur();
  };

  return (
    <div className={styles.actionButtons}>
      {!isPracticeMode && (
        <button 
          className="button"
          onClick={onRestart}
          onMouseUp={handleMouseUp}
          disabled={isLoading}
        >
          Restart
        </button>
      )}
      <button 
        className="button"
        onClick={onGenerate}
        onMouseUp={handleMouseUp}
        disabled={isLoading}
      >
        {isPracticeMode ? 'Reset' : 'Generate New Text'}
      </button>
    </div>
  );
};

ActionButtons.propTypes = {
  onRestart: PropTypes.func,
  onGenerate: PropTypes.func.isRequired,
  isPracticeMode: PropTypes.bool,
  isLoading: PropTypes.bool
};

export default ActionButtons; 