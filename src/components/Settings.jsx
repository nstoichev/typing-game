import React from 'react';
import SourceSelector from './SourceSelector';
import styles from './Settings.module.css';

const Settings = ({ onSourceChange, currentSource }) => {
  return (
    <div className={styles.settings}>
      <h2>Settings</h2>
      <SourceSelector 
        onSourceChange={onSourceChange}
        currentSource={currentSource}
      />
    </div>
  );
};

export default Settings; 