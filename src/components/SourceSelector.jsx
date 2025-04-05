import React from 'react';
import styles from './SourceSelector.module.css';

const SourceSelector = ({ onSourceChange, currentSource }) => {
  const sources = [
    { id: 'random', label: 'Random Text' },
    { id: 'wikipedia', label: 'Wikipedia' }
  ];

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

export default SourceSelector; 