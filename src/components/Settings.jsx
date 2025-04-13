import React, { useState, useRef, useEffect } from 'react';
import SourceSelector from './SourceSelector';
import SettingsIcon from './SettingsIcon';
import styles from './Settings.module.css';
import PropTypes from 'prop-types';

const Settings = ({ 
  onSourceChange, 
  currentSource, 
  showKeyboard, 
  onToggleKeyboard,
  showFingerLayout,
  onToggleFingerLayout,
  showHands,
  onToggleHands,
  hideSourceSelector,
  showSourceSelector = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.settingsContainer} ref={settingsRef}>
      <button 
        className={`${styles.settingsButton} ${isOpen ? styles.rotate : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Settings"
      >
        <SettingsIcon className={styles.gearIcon} />
      </button>
      {isOpen && (
        <div className={styles.settingsPanel}>
          {showSourceSelector && (
            <div className={styles.settingRow}>
              <SourceSelector 
                onSourceChange={onSourceChange}
                currentSource={currentSource}
                hide={hideSourceSelector}
              />
            </div>
          )}
          <div className={styles.settingRow}>
            <label className={styles.settingLabel}>
              <input
                type="checkbox"
                checked={showKeyboard}
                onChange={(e) => onToggleKeyboard(e.target.checked)}
                className={styles.customCheckbox}
              />
              <span className={styles.checkmark}></span>
              Show Virtual Keyboard
            </label>
          </div>
          {showKeyboard && (
            <>
              <div className={styles.settingRow}>
                <label className={`${styles.settingLabel} ${styles.indented}`}>
                  <input
                    type="checkbox"
                    checked={showFingerLayout}
                    onChange={(e) => onToggleFingerLayout(e.target.checked)}
                    className={styles.customCheckbox}
                  />
                  <span className={styles.checkmark}></span>
                  Show Fingers Layout
                </label>
              </div>
              <div className={styles.settingRow}>
                <label className={`${styles.settingLabel} ${styles.indented}`}>
                  <input
                    type="checkbox"
                    checked={showHands}
                    onChange={(e) => onToggleHands(e.target.checked)}
                    className={styles.customCheckbox}
                  />
                  <span className={styles.checkmark}></span>
                  Show Virtual Hands
                </label>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

Settings.propTypes = {
  onSourceChange: PropTypes.func,
  currentSource: PropTypes.string,
  showKeyboard: PropTypes.bool.isRequired,
  onToggleKeyboard: PropTypes.func.isRequired,
  showFingerLayout: PropTypes.bool.isRequired,
  onToggleFingerLayout: PropTypes.func.isRequired,
  showHands: PropTypes.bool.isRequired,
  onToggleHands: PropTypes.func.isRequired,
  hideSourceSelector: PropTypes.bool,
  showSourceSelector: PropTypes.bool
};

export default Settings;