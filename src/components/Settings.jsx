import React from 'react';
import SourceSelector from './SourceSelector';
import styles from './Settings.module.css';
import PropTypes from 'prop-types';

const Settings = ({ 
  onSourceChange, 
  currentSource, 
  showKeyboard, 
  onToggleKeyboard,
  showFingerLayout,
  onToggleFingerLayout,
  hideSourceSelector
}) => {
  return (
    <div className={styles.settings}>
      <h2>Settings</h2>
      <div className={styles.settingRow}>
        <SourceSelector 
          onSourceChange={onSourceChange}
          currentSource={currentSource}
          hide={hideSourceSelector}
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
      {showKeyboard && (
        <div className={styles.settingRow}>
          <label className={`${styles.settingLabel} ${styles.indented}`}>
            <input
              type="checkbox"
              checked={showFingerLayout}
              onChange={(e) => onToggleFingerLayout(e.target.checked)}
            />
            Show Fingers Layout
          </label>
        </div>
      )}
    </div>
  );
};

Settings.propTypes = {
  onSourceChange: PropTypes.func.isRequired,
  currentSource: PropTypes.string.isRequired,
  showKeyboard: PropTypes.bool.isRequired,
  onToggleKeyboard: PropTypes.func.isRequired,
  showFingerLayout: PropTypes.bool.isRequired,
  onToggleFingerLayout: PropTypes.func.isRequired,
  hideSourceSelector: PropTypes.bool
};

export default Settings; 