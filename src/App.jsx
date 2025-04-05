import './App.css'
import ResultsModal from './components/ResultsModal'
import Settings from './components/Settings'
import ActionButtons from './components/ActionButtons'
import TextDisplay from './components/TextDisplay'
import VirtualKeyboard from './components/VirtualKeyboard'
import { useTypingGame } from './hooks/useTypingGame'
import { useState } from 'react'

function App() {
  const [showKeyboard, setShowKeyboard] = useState(true);
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
    setTextSource
  } = useTypingGame()

  const handleSourceChange = (source) => {
    setTextSource(source)
  }

  const handleGenerate = () => {
    initializeText()
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
      />
      <TextDisplay
        currentChunk={currentChunk}
        nextChunk={nextChunk}
        typedText={typedText}
      />
      {showKeyboard && (
        <VirtualKeyboard nextKey={getNextKey()} />
      )}
      <ActionButtons
        onRestart={handleRestart}
        onGenerate={handleGenerate}
      />
      {isComplete && stats && (
        <ResultsModal stats={stats} onTryAgain={handleTryAgain} />
      )}
    </div>
  )
}

export default App
