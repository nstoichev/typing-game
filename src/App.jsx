import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import ResultsModal from './components/ResultsModal'
import Settings from './components/Settings'
import ActionButtons from './components/ActionButtons'
import TextDisplay from './components/TextDisplay'
import VirtualKeyboard from './components/VirtualKeyboard'
import Navigation from './components/Navigation'
import Practice from './pages/Practice'
import { useTypingGame } from './hooks/useTypingGame'
import { useState } from 'react'

function Home() {
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
      {isComplete && stats && (
        <ResultsModal stats={stats} onTryAgain={handleTryAgain} onGenerate={handleGenerate} />
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice" element={<Practice />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
