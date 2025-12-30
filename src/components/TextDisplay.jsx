import React, { useEffect, useRef } from 'react';
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

const TextDisplay = ({ currentChunk, nextChunk, typedText, isLoading, wordWPMs = {}, currentChunkStartWordIndex = 0 }) => {
  const { userData } = useAuth();
  const highlightMode = userData?.highlightMode || 'letters';
  // Default to true (on) if not set
  const showWordWPM = userData?.showWordWPM !== false;
  const textDisplayRef = useRef(null);
  const prevIsLoadingRef = useRef(isLoading);
  const prevCurrentChunkRef = useRef(currentChunk);

  const renderText = (text, isPreview = false) => {
    if (!text) return null;
    
    if (isPreview) {
      // Split text by newlines first, then by spaces
      const lines = text.split('\n');
      return lines.map((line, lineIndex) => {
        const words = line.split(' ');
        return (
          <div key={lineIndex} className={styles.line}>
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className={styles.word}>
                {word.split('').map((char, charIndex) => (
                  <span key={charIndex}>{char}</span>
                ))}
                {wordIndex < words.length - 1 && (
                  <span key={`space-${wordIndex}`}> </span>
                )}
              </span>
            ))}
            {lineIndex < lines.length - 1 && (
              <span key={`newline-${lineIndex}`} className={styles.newline}>↵</span>
            )}
          </div>
        );
      });
    }

    // Split text by newlines first, then by spaces for the main display
    const lines = text.split('\n');
    let charCount = 0;
    let wordIndex = 0;
    const result = [];

    lines.forEach((line, lineIndex) => {
      // Parse words with their trailing spaces to detect which don't have spaces
      const wordRegex = /(\S+)(\s*)/g;
      let match;
      const wordMatches = [];
      
      while ((match = wordRegex.exec(line)) !== null) {
        wordMatches.push({
          word: match[1],
          trailingSpace: match[2],
          index: match.index
        });
      }
      
      // Skip empty lines
      if (wordMatches.length === 0) {
        if (lineIndex < lines.length - 1) {
          // Empty line with newline
          const newlineIndex = charCount;
          const isNewlineTyped = newlineIndex < typedText.length;
          const isNewlineWrong = isNewlineTyped && typedText[newlineIndex] !== '\n';
          const isNewlineCurrent = newlineIndex === typedText.length;
          const isCurrentNewline = isNewlineCurrent;
          
          let newlineClassName = '';
          if (isNewlineTyped) {
            newlineClassName = isNewlineWrong ? styles.wrong : styles.typed;
          } else if (isNewlineCurrent) {
            newlineClassName = styles.current;
          }
          
          const newlineWordClass = `${styles.word} ${isCurrentNewline ? styles.active : ''} ${isNewlineWrong ? styles.wrong : ''}`;
          
          result.push(
            <div key={`line-${lineIndex}`} className={styles.line}>
              <span key={`newline-${lineIndex}`} className={`${styles.newline} ${newlineWordClass} ${newlineClassName}`}>
                ↵
              </span>
            </div>
          );
          charCount += 1;
        }
        return;
      }
      
      const lineElements = [];
      
      wordMatches.forEach((wordMatch, wIndex) => {
        const word = wordMatch.word;
        const hasTrailingSpace = wordMatch.trailingSpace.length > 0;
        const isLastWordInLine = wIndex === wordMatches.length - 1;
        const isLastLine = lineIndex === lines.length - 1;
        
        // Check if word doesn't have trailing space (except if it's the last word in the entire text)
        const isLastWordInText = isLastWordInLine && isLastLine;
        const hasNoSpace = !hasTrailingSpace && !isLastWordInText;
        
        const wordStart = charCount;
        const wordLength = word.length;
        const spaceChar = hasTrailingSpace ? wordMatch.trailingSpace : (isLastWordInLine ? '' : ' ');
        const chars = (word + spaceChar).split('');
        
        // Calculate the absolute word index in the full text
        const absoluteWordIndex = currentChunkStartWordIndex + wordIndex;
        
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
        
        // Get WPM for this word if it exists and setting is enabled
        const wordWPM = wordWPMs[absoluteWordIndex];
        const showWPM = showWordWPM && wordWPM !== undefined && isCompleteAndCorrect;
        
        // Build className with nospaces class if word doesn't have trailing space
        const wordClassName = `${styles.word} ${isCurrentWord ? styles.active : ''} ${hasWrongChars ? styles.wrong : ''} ${showSuccess ? styles.success : ''} ${hasNoSpace ? styles.nospaces : ''}`.trim();
        
        const wordElement = (
          <span key={`word-${lineIndex}-${wIndex}`} className={wordClassName}>
            {showWPM && (
              <span className={styles['word-wpm']}>
                {wordWPM} wpm
              </span>
            )}
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
        wordIndex++;
        lineElements.push(wordElement);
      });
      
      // Add newline symbol after each line except the last
      if (lineIndex < lines.length - 1) {
        const newlineIndex = charCount;
        const isNewlineTyped = newlineIndex < typedText.length;
        const isNewlineWrong = isNewlineTyped && typedText[newlineIndex] !== '\n';
        const isNewlineCurrent = newlineIndex === typedText.length;
        
        // Check if this is the current "word" (newline)
        const isCurrentNewline = isNewlineCurrent;
        
        let newlineClassName = '';
        if (isNewlineTyped) {
          newlineClassName = isNewlineWrong ? styles.wrong : styles.typed;
        } else if (isNewlineCurrent) {
          newlineClassName = styles.current;
        }
        
        // Add word class for proper styling, and wrong class if it has wrong characters
        const newlineWordClass = `${styles.word} ${isCurrentNewline ? styles.active : ''} ${isNewlineWrong ? styles.wrong : ''}`;
        
        lineElements.push(
          <span key={`newline-${lineIndex}`} className={`${styles.newline} ${newlineWordClass} ${newlineClassName}`}>
            ↵
          </span>
        );
        charCount += 1; // Count the newline character
      }
      
      // Wrap line in a div to display on new line
      result.push(
        <div key={`line-${lineIndex}`} className={styles.line}>
          {lineElements}
        </div>
      );
    });
    
    return result;
  };

  // Reset scroll to top when restarting or loading new text
  useEffect(() => {
    if (!textDisplayRef.current) return;

    const shouldResetScroll = 
      // Reset when typedText becomes empty (restart happened)
      (typedText === '' && currentChunk) ||
      // Reset when new text is loaded (isLoading goes from true to false)
      (prevIsLoadingRef.current === true && isLoading === false) ||
      // Reset when currentChunk changes and typedText is empty (new text generated)
      (prevCurrentChunkRef.current !== currentChunk && typedText === '' && currentChunk);

    if (shouldResetScroll) {
      // Small delay to ensure DOM is updated
      const timeoutId = setTimeout(() => {
        const container = textDisplayRef.current;
        if (container) {
          container.scrollTop = 0;
        }
      }, 10);

      return () => clearTimeout(timeoutId);
    }

    // Update refs for next comparison
    prevIsLoadingRef.current = isLoading;
    prevCurrentChunkRef.current = currentChunk;
  }, [typedText, currentChunk, isLoading]);

  // Auto-scroll to keep active element visible
  useEffect(() => {
    if (isLoading || !textDisplayRef.current || !currentChunk || typedText === '') return;

    // Small delay to ensure DOM is updated
    const timeoutId = setTimeout(() => {
      const container = textDisplayRef.current;
      if (!container) return;

      // Find the active element (current character or active word)
      const currentChar = container.querySelector(`.${styles.current}`);
      const activeWord = container.querySelector(`.${styles.word}.${styles.active}`);
      
      // Prefer current character, fallback to active word
      const activeElement = currentChar || activeWord;
      
      if (activeElement) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        
        // Calculate position relative to visible viewport (not content)
        const elementTopInViewport = elementRect.top - containerRect.top;
        const elementBottomInViewport = elementRect.bottom - containerRect.top;
        const containerHeight = containerRect.height;
        
        // Calculate remaining visible space below the element
        const remainingSpaceBelow = containerHeight - elementBottomInViewport;
        
        // Only scroll if there's very little space remaining below (less than ~30px, roughly one line)
        // This prevents scrolling when there are still multiple visible lines below
        // const minRemainingSpace = 30; // Minimum space we want to keep visible below the element
        const minRemainingSpace = 0; // Minimum space we want to keep visible below the element
        
        if (remainingSpaceBelow < minRemainingSpace) {
          // Calculate how much to scroll: move element to 20px from top of visible area
          const scrollDelta = elementTopInViewport - 20;
          // const scrollDelta = 124;
          // Only scroll if the delta is significant (avoid micro-scrolls)
          if (Math.abs(scrollDelta) > 5) {
            container.scrollTop = container.scrollTop + scrollDelta;
          }
        } else if (elementTopInViewport < 20 && container.scrollTop > 0) {
          // Also scroll if element is too close to the top (but don't scroll if already at top)
          const scrollDelta = elementTopInViewport - 20;
          if (Math.abs(scrollDelta) > 5) {
            container.scrollTop = Math.max(0, container.scrollTop + scrollDelta);
          }
        }
      }
    }, 10);

    return () => clearTimeout(timeoutId);
  }, [typedText, currentChunk, isLoading, styles]);

  return (
    <>
      <div 
        ref={textDisplayRef}
        className={`${styles['text-display']} ${styles[`highlight-${highlightMode}`]}`}
      >
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