import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ResultsModal from './components/ResultsModal'
import ActionButtons from './components/ActionButtons'
import TextDisplay from './components/TextDisplay'
import VirtualKeyboard from './components/VirtualKeyboard'
import Navigation from './components/Navigation'
import Practice from './pages/Practice'
import Account from './pages/Account'
import { useTypingGame } from './hooks/useTypingGame'
import { useState } from 'react'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import Auth from './components/Auth'

// Protected Route component
function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/auth" />;
}

function Home({ 
  showKeyboard, 
  showFingerLayout, 
  showHands, 
  currentChunk, 
  nextChunk, 
  typedText, 
  isComplete, 
  stats, 
  handleRestart, 
  handleTryAgain, 
  initializeText, 
  countdown 
}) {
  const getNextKey = () => {
    if (!currentChunk) return '';
    const typedLength = typedText.length;
    return currentChunk[typedLength] || '';
  }

  return (
    <div className="typing-container">
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
          showHands={showHands}
        />
      )}
      <ActionButtons
        onRestart={handleRestart}
        onGenerate={initializeText}
      />
      {isComplete && stats && (
        <ResultsModal stats={stats} onTryAgain={handleTryAgain} onGenerate={initializeText} />
      )}
    </div>
  )
}

function App() {
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showFingerLayout, setShowFingerLayout] = useState(false);
  const [showHands, setShowHands] = useState(false);
  
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
    countdown
  } = useTypingGame();

  const handleSourceChange = (source) => {
    setTextSource(source);
  };

  return (
    <Router>
      <AuthProvider>
        <Navigation 
          onSourceChange={handleSourceChange}
          currentSource={textSource}
          showKeyboard={showKeyboard}
          onToggleKeyboard={setShowKeyboard}
          showFingerLayout={showFingerLayout}
          onToggleFingerLayout={setShowFingerLayout}
          showHands={showHands}
          onToggleHands={setShowHands}
          hideSourceSelector={countdown !== null}
        />
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home 
                  showKeyboard={showKeyboard}
                  showFingerLayout={showFingerLayout}
                  showHands={showHands}
                  currentChunk={currentChunk}
                  nextChunk={nextChunk}
                  typedText={typedText}
                  isComplete={isComplete}
                  stats={stats}
                  handleRestart={handleRestart}
                  handleTryAgain={handleTryAgain}
                  initializeText={initializeText}
                  countdown={countdown}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/practice"
            element={
              <ProtectedRoute>
                <Practice 
                  showKeyboard={showKeyboard}
                  showFingerLayout={showFingerLayout}
                  showHands={showHands}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App
