import React, { useState, useEffect } from 'react';
import '../styles/Practice.css';
import ResultsModal from '../components/ResultsModal';
import Settings from '../components/Settings';
import ActionButtons from '../components/ActionButtons';
import TextDisplay from '../components/TextDisplay';
import VirtualKeyboard from '../components/VirtualKeyboard';
import { useTypingGame } from '../hooks/useTypingGame';

const Practice = () => {
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showFingerLayout, setShowFingerLayout] = useState(false);
  const {
    currentChunk,
    nextChunk,
    typedText,
    isComplete,
    stats,
    initializeText,
    countdown,
    setCountdown,
    isActive,
    setIsActive
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
      <Settings 
        showKeyboard={showKeyboard}
        onToggleKeyboard={setShowKeyboard}
        showFingerLayout={showFingerLayout}
        onToggleFingerLayout={setShowFingerLayout}
        hideSourceSelector={true}
        showSourceSelector={false}
      />
      <div className="countdown-display">
        {countdown === 60 ? 'Start typing!' : countdown > 0 ? `${countdown} seconds` : 'Time\'s up!'}
      </div>
      <TextDisplay
        currentChunk={currentChunk}
        nextChunk={nextChunk}
        typedText={typedText}
      />
      {showKeyboard && (
        <VirtualKeyboard 
          nextKey={getNextKey()} 
          showFingerLayout={showFingerLayout}
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