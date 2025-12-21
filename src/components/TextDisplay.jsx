import React from 'react';
import styles from './TextDisplay.module.css';
import { useAuth } from '../contexts/AuthContext';

const LoadingAnimation = () => (
  <div className={styles['loading-container']}>
    <div className={styles['loading-dots']}>
      <div className={styles['loading-dot']}></div>
      <div className={styles['loading-dot']}></div>
      <div className={styles['loading-dot']}></div>
    </div>
  </div>
);

const TextDisplay = ({ currentChunk, nextChunk, typedText, isLoading }) => {
  const { userData } = useAuth();
  const highlightMode = userData?.highlightMode || 'letters';

  const renderText = (text, isPreview = false) => {
    if (!text) return null;
    
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
      
      // Check if this is the current word (including the space)
      const isCurrentWord = typedText.length >= wordStart && 
                           typedText.length <= wordStart + wordLength;
      
      // Check if the word has any wrong characters
      const hasWrongChars = chars.some((char, charIndex) => {
        const absoluteIndex = wordStart + charIndex;
        return absoluteIndex < typedText.length && typedText[absoluteIndex] !== char;
      });

      // Check if the word is completely typed and correct
      const isCompleteAndCorrect = wordStart + wordLength <= typedText.length && !hasWrongChars;
      
      // Only apply success class in words highlight mode
      const showSuccess = highlightMode === 'words' && isCompleteAndCorrect;
      
      const wordElement = (
        <span key={wordIndex} className={`${styles.word} ${isCurrentWord ? styles.active : ''} ${hasWrongChars ? styles.wrong : ''} ${showSuccess ? styles.success : ''}`}>
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
      <div className={`${styles['text-display']} ${styles[`highlight-${highlightMode}`]}`}>
        {isLoading ? <LoadingAnimation /> : renderText(currentChunk)}
      </div>
      {!isLoading && nextChunk && (
        <div className={styles['text-preview']}>
          {renderText(nextChunk, true)}
        </div>
      )}
    </>
  );
};

export default TextDisplay; 