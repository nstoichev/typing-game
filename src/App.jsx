import './App.css'
import ResultsModal from './components/ResultsModal'
import Settings from './components/Settings'
import ActionButtons from './components/ActionButtons'
import GameButtons from './components/GameButtons'
import TextDisplay from './components/TextDisplay'
import VirtualKeyboard from './components/VirtualKeyboard'
import { useTypingGame } from './hooks/useTypingGame'
import { useState } from 'react'

function App() {
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showFingerLayout, setShowFingerLayout] = useState(false);
  const {
    currentChunk,
    nextChunk,
    typedText,
    isComplete,
    stats,
    textSource,
    handleRestart,
    handleTryAgain,
    initializeText,
    setTextSource,
    countdown,
    setCountdown
  } = useTypingGame()

  const handleSourceChange = (source) => {
    setTextSource(source)
  }

  const handleGenerate = () => {
    initializeText()
  }

  const handleOneMinuteGame = (seconds) => {
    setCountdown(seconds); // Set countdown to null for freestyle mode or 60 for one minute mode
  }

  const getNextKey = () => {
    if (!currentChunk) return '';
    const typedLength = typedText.length;
    return currentChunk[typedLength] || '';
  }

  return (
    <div className="typing-container">
      <Settings 
        onSourceChange={handleSourceChange}
        currentSource={textSource}
        showKeyboard={showKeyboard}
        onToggleKeyboard={setShowKeyboard}
        showFingerLayout={showFingerLayout}
        onToggleFingerLayout={setShowFingerLayout}
        hideSourceSelector={countdown !== null}
      />
      {countdown !== null && (
        <div className="countdown-display">
          {countdown === 60 ? 'Start typing!' : `${countdown} seconds`}
        </div>
      )}
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
        onRestart={handleRestart}
        onGenerate={handleGenerate}
      />
      <GameButtons
        onOneMinuteGame={handleOneMinuteGame}
        disabled={textSource !== 'random'}
        isOneMinuteMode={countdown !== null}
      />
      {isComplete && stats && (
        <ResultsModal stats={stats} onTryAgain={handleTryAgain} onGenerate={handleGenerate} />
      )}
    </div>
  )
}

export default App
