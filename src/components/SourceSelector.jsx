import React, { useState } from 'react';
import styles from './SourceSelector.module.css';
import PropTypes from 'prop-types';
import CustomTextModal from './CustomTextModal';

const SourceSelector = ({ onSourceChange, currentSource, hide, onCustomTextStart, customTextRef }) => {
  const [isCustomTextModalOpen, setIsCustomTextModalOpen] = useState(false);
  
  const sources = [
    { id: 'random', label: 'Random Text' },
    { id: 'wikipedia', label: 'Wikipedia' },
    { id: 'custom', label: 'Custom Text' }
  ];

  if (hide) {
    return null;
  }

  const handleSourceChange = (value) => {
    onSourceChange(value);
  };

  const handleEnterTextClick = () => {
    setIsCustomTextModalOpen(true);
  };

  const handleCustomTextStart = (text) => {
    onCustomTextStart(text);
    setIsCustomTextModalOpen(false);
  };

  const isCustomSelected = currentSource === 'custom';

  return (
    <>
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
                onChange={(e) => handleSourceChange(e.target.value)}
              />
              {source.label}
            </label>
          ))}
        </div>
        {isCustomSelected && (
          <button 
            className={styles.customTextButton}
            onClick={handleEnterTextClick}
          >
            Enter Text
          </button>
        )}
      </div>
      <CustomTextModal
        isOpen={isCustomTextModalOpen}
        onClose={() => setIsCustomTextModalOpen(false)}
        onStart={handleCustomTextStart}
        initialValue={customTextRef?.current || ''}
      />
    </>
  );
};

SourceSelector.propTypes = {
  onSourceChange: PropTypes.func.isRequired,
  currentSource: PropTypes.string.isRequired,
  hide: PropTypes.bool,
  onCustomTextStart: PropTypes.func
};

export default SourceSelector; 