import React from 'react';
import SourceSelector from './SourceSelector';
import styles from './Settings.module.css';

const Settings = ({ onSourceChange, currentSource, showKeyboard, onToggleKeyboard }) => {
  return (
    <div className={styles.settings}>
      <h2>Settings</h2>
      <div className={styles.settingRow}>
        <SourceSelector 
          onSourceChange={onSourceChange}
          currentSource={currentSource}
        />
      </div>
      <div className={styles.settingRow}>
        <label className={styles.settingLabel}>
          <input
            type="checkbox"
            checked={showKeyboard}
            onChange={(e) => onToggleKeyboard(e.target.checked)}
          />
          Show Virtual Keyboard
        </label>
      </div>
    </div>
  );
};

export default Settings; 