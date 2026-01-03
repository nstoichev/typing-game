import React, { useEffect } from 'react';
import ResultsModal from '../components/ResultsModal';
import ActionButtons from '../components/ActionButtons';
import TextDisplay from '../components/TextDisplay';
import VirtualKeyboard from '../components/VirtualKeyboard';
import VirtualHands from '../components/VirtualHands';
import { useTypingGame } from '../hooks/useTypingGame';

const Practice = ({ showKeyboard, showFingerLayout, showHands }) => {
  const {
    currentChunk,
    nextChunk,
    typedText,
    isComplete,
    stats,
    initializeText,
    countdown,
    setCountdown,
    setIsActive,
    wordWPMs,
    currentChunkStartWordIndex,
    getRemainingWordChars
  } = useTypingGame('random');

  // Initialize countdown to 60 seconds
  useEffect(() => {
    setCountdown(60);
  }, [setCountdown]);

  const handleGenerate = () => {
    // Reset everything
    initializeText();
    setCountdown(60);
    setIsActive(false);
  };

  const getNextKey = () => {
    if (!currentChunk) return '';
    const typedLength = typedText.length;
    return currentChunk[typedLength] || '';
  };

  return (
    <div className="typing-container">
      <div className="countdown-display">
        {countdown === 60 ? 'Start typing!' : countdown > 0 ? `${countdown} seconds` : 'Time\'s up!'}
      </div>
      <TextDisplay
        currentChunk={currentChunk}
        nextChunk={nextChunk}
        typedText={typedText}
        wordWPMs={wordWPMs}
        currentChunkStartWordIndex={currentChunkStartWordIndex}
      />
      {showKeyboard && (
        <VirtualKeyboard 
          nextKey={getNextKey()} 
          showFingerLayout={showFingerLayout}
          showHands={showHands}
          remainingWordChars={getRemainingWordChars()}
        />
      )}
      {showKeyboard && showHands && (
        <VirtualHands 
          nextKey={getNextKey()} 
          showHands={showHands}
        />
      )}
      <ActionButtons
        onGenerate={handleGenerate}
        isPracticeMode={true}
      />
      {isComplete && stats && (
        <ResultsModal 
          stats={stats} 
          onTryAgain={handleGenerate} 
          onGenerate={handleGenerate}
          isPracticeMode={true}
        />
      )}
    </div>
  );
};

export default Practice; 