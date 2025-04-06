import React from 'react';
import styles from './SourceSelector.module.css';
import PropTypes from 'prop-types';

const SourceSelector = ({ onSourceChange, currentSource, hide }) => {
  const sources = [
    { id: 'random', label: 'Random Text' },
    { id: 'wikipedia', label: 'Wikipedia' }
  ];

  if (hide) {
    return null;
  }

  return (
    <div className={styles.sourceSelector}>
      <h3>Text Source</h3>
      <div className={styles.radioGroup}>
        {sources.map(source => (
          <label key={source.id} className={styles.radioLabel}>
            <input
              type="radio"
              name="textSource"
              value={source.id}
              checked={currentSource === source.id}
              onChange={(e) => onSourceChange(e.target.value)}
            />
            {source.label}
          </label>
        ))}
      </div>
    </div>
  );
};

SourceSelector.propTypes = {
  onSourceChange: PropTypes.func.isRequired,
  currentSource: PropTypes.string.isRequired,
  hide: PropTypes.bool
};

export default SourceSelector; 