import React from 'react';
import styles from './TextDisplay.module.css';

const TextDisplay = ({ currentChunk, nextChunk, typedText }) => {
  const renderText = (text, isPreview = false) => {
    if (isPreview) {
      // Split text into words and render each word
      return text.split(' ').map((word, wordIndex) => (
        <span key={wordIndex} className={styles.word}>
          {word.split('').map((char, charIndex) => (
            <span key={charIndex}>{char}</span>
          ))}
          {wordIndex < text.split(' ').length - 1 && (
            <span key={`space-${wordIndex}`}> </span>
          )}
        </span>
      ));
    }

    // Split text into words for the main display
    const words = text.split(' ');
    let charCount = 0;

    return words.map((word, wordIndex) => {
      const wordStart = charCount;
      const wordLength = word.length;
      const spaceChar = wordIndex < words.length - 1 ? ' ' : '';
      const chars = (word + spaceChar).split('');
      
      const wordElement = (
        <span key={wordIndex} className={styles.word}>
          {chars.map((char, charIndex) => {
            const absoluteIndex = wordStart + charIndex;
            const isTyped = absoluteIndex < typedText.length;
            const isWrong = isTyped && typedText[absoluteIndex] !== char;
            const isCurrent = absoluteIndex === typedText.length;

            let className = '';
            if (isTyped) {
              className = isWrong ? styles.wrong : styles.typed;
            } else if (isCurrent) {
              className = styles.current;
            }

            return (
              <span key={charIndex} className={className}>
                {char}
              </span>
            );
          })}
        </span>
      );

      charCount += chars.length;
      return wordElement;
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