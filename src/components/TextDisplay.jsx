import React from 'react';
import styles from './TextDisplay.module.css';

const TextDisplay = ({ currentChunk, nextChunk, typedText }) => {
  const renderText = (text, isPreview = false) => {
    if (isPreview) {
      return text.split('').map((char, index) => (
        <span key={index}>{char}</span>
      ));
    }

    return text.split('').map((char, index) => {
      const isTyped = index < typedText.length;
      const isWrong = isTyped && typedText[index] !== char;
      const isCurrent = index === typedText.length;

      let className = '';
      if (isTyped) {
        className = isWrong ? styles.wrong : styles.typed;
      } else if (isCurrent) {
        className = styles.current;
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  return (
    <>
      <div className={styles['text-display']}>
        {renderText(currentChunk)}
      </div>
      {nextChunk && (
        <div className={styles['text-preview']}>
          {renderText(nextChunk, true)}
        </div>
      )}
    </>
  );
};

export default TextDisplay; 