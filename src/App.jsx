import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import ResultsModal from './components/ResultsModal'
import ActionButtons from './components/ActionButtons'
import TextDisplay from './components/TextDisplay'
import VirtualKeyboard from './components/VirtualKeyboard'
import Navigation from './components/Navigation'
import Practice from './pages/Practice'
import Account from './pages/Account'
import Teams from './pages/Teams'
import { useTypingGame } from './hooks/useTypingGame'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { TeamsProvider } from './contexts/TeamsContext'
import Auth from './components/Auth'
import TeamStatsUpdater from './components/TeamStatsUpdater'
import SourceSelector from './components/SourceSelector'

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/auth" />;
}

function AppContent() {
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [showFingerLayout, setShowFingerLayout] = useState(false);
  const [showHands, setShowHands] = useState(false);
  const [textSource, setTextSource] = useState('random');
  
  return (
    <div className="app">
      <Navigation 
        showKeyboard={showKeyboard}
        onToggleKeyboard={setShowKeyboard}
        showFingerLayout={showFingerLayout}
        onToggleFingerLayout={setShowFingerLayout}
        showHands={showHands}
        onToggleHands={setShowHands}
        currentSource={textSource}
        onSourceChange={setTextSource}
        hideSourceSelector={false}
      />
      <TeamStatsUpdater />
      <Routes>
        <Route 
          path="/" 
          element={
            <Home 
              showKeyboard={showKeyboard}
              showFingerLayout={showFingerLayout}
              showHands={showHands}
              textSource={textSource}
              onSourceChange={setTextSource}
            />
          } 
        />
        <Route 
          path="/practice" 
          element={
            <Practice 
              showKeyboard={showKeyboard}
              showFingerLayout={showFingerLayout}
              showHands={showHands}
            />
          } 
        />
        <Route path="/auth" element={<Auth />} />
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teams" 
          element={
            <ProtectedRoute>
              <Teams />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </div>
  );
}

function Home({ showKeyboard, showFingerLayout, showHands, textSource, onSourceChange }) {
  const {
    currentChunk,
    nextChunk,
    typedText,
    isComplete,
    stats,
    handleRestart,
    handleTryAgain,
    initializeText,
    setTextSource,
    countdown,
    isLoading
  } = useTypingGame();

  useEffect(() => {
    setTextSource(textSource);
  }, [textSource, setTextSource]);

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
        isLoading={isLoading}
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
        isLoading={isLoading}
      />
      {isComplete && stats && (
        <ResultsModal stats={stats} onTryAgain={handleTryAgain} onGenerate={initializeText} />
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <TeamsProvider>
          <AppContent />
        </TeamsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App
