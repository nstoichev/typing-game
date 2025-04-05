import { useState, useEffect, useCallback } from 'react'
import './App.css'
import ResultsModal from './components/ResultsModal'

function App() {
  const [text, setText] = useState('')
  const [currentChunk, setCurrentChunk] = useState('')
  const [nextChunk, setNextChunk] = useState('')
  const [typedText, setTypedText] = useState('')
  const [wrongWords, setWrongWords] = useState([])
  const [isComplete, setIsComplete] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const [stats, setStats] = useState(null)
  const [currentChunkStartIndex, setCurrentChunkStartIndex] = useState(0)
  const [startTime, setStartTime] = useState(null)

  const CHUNK_SIZE = 100
  const CHUNK_BUFFER = 20 // Additional buffer to prevent word splitting

  const getChunkWithWordBoundary = (text, startIndex) => {
    const maxEndIndex = startIndex + CHUNK_SIZE + CHUNK_BUFFER
    const endIndex = Math.min(maxEndIndex, text.length)
    
    // Find the last space within our chunk range
    let lastSpaceIndex = text.lastIndexOf(' ', endIndex)
    
    // If we can't find a space within our range, just take the whole text
    if (lastSpaceIndex <= startIndex) {
      lastSpaceIndex = endIndex
    }
    
    return {
      chunk: text.slice(startIndex, lastSpaceIndex + 1), // Include the space
      endIndex: lastSpaceIndex + 1
    }
  }

  useEffect(() => {
    const hardcodedText = "The quick brown fox jumps over the lazy dog. This is a test sentence to demonstrate typing speed and accuracy." +
      "The quick brown fox jumps over the lazy dog. This is a test sentence to demonstrate typing speed and accuracy."
    
    setText(hardcodedText)
    const firstChunk = getChunkWithWordBoundary(hardcodedText, 0)
    setCurrentChunk(firstChunk.chunk)
    const secondChunk = getChunkWithWordBoundary(hardcodedText, firstChunk.endIndex)
    setNextChunk(secondChunk.chunk)
    setCurrentChunkStartIndex(0)
  }, [])

  const handleKeyDown = useCallback((e) => {
    if (!isActive) {
      setIsActive(true)
      setStartTime(Date.now())
    }

    if (e.key.length === 1) {
      const newTypedText = typedText + e.key
      setTypedText(newTypedText)
      
      // Check if we need to move to the next chunk
      if (newTypedText.length === currentChunk.length) {
        const nextChunkStart = currentChunkStartIndex + currentChunk.length
        const nextChunk = getChunkWithWordBoundary(text, nextChunkStart)
        const nextNextChunk = getChunkWithWordBoundary(text, nextChunk.endIndex)
        
        setCurrentChunk(nextChunk.chunk)
        setNextChunk(nextNextChunk.chunk)
        setCurrentChunkStartIndex(nextChunkStart)
        setTypedText('')
      }

      if (e.key !== text[currentChunkStartIndex + typedText.length]) {
        // Find the current word being typed
        const lastSpaceIndex = text.lastIndexOf(' ', currentChunkStartIndex + typedText.length)
        const nextSpaceIndex = text.indexOf(' ', currentChunkStartIndex + typedText.length)
        const currentWord = text.slice(
          lastSpaceIndex === -1 ? currentChunkStartIndex : lastSpaceIndex + 1,
          nextSpaceIndex === -1 ? currentChunkStartIndex + currentChunk.length : nextSpaceIndex
        )
        setWrongWords(prev => [...prev, currentWord])
      }
    }
  }, [text, typedText, currentChunk, isActive, currentChunkStartIndex])

  const renderText = (text, isPreview = false) => {
    // For preview chunks, just return plain text
    if (isPreview) {
      return text.split('').map((char, index) => (
        <span key={index}>{char}</span>
      ))
    }

    return text.split('').map((char, index) => {
      const isTyped = index < typedText.length
      const isWrong = isTyped && typedText[index] !== char
      const isCurrent = index === typedText.length

      let className = ''
      if (isTyped) {
        className = isWrong ? 'wrong' : 'typed'
      } else if (isCurrent) {
        className = 'current'
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      )
    })
  }

  const handleTryAgain = () => {
    setTypedText('')
    setWrongWords([])
    setIsComplete(false)
    setIsActive(false)
    setStats(null)
    setStartTime(null)
    const firstChunk = getChunkWithWordBoundary(text, 0)
    setCurrentChunk(firstChunk.chunk)
    const secondChunk = getChunkWithWordBoundary(text, firstChunk.endIndex)
    setNextChunk(secondChunk.chunk)
    setCurrentChunkStartIndex(0)
  }

  useEffect(() => {
    if (currentChunkStartIndex + typedText.length === text.length && text.length > 0) {
      const endTime = Date.now()
      const timeInMinutes = (endTime - startTime) / 60000
      const words = text.split(' ').length
      const wpm = Math.round(words / timeInMinutes)
      const accuracy = Math.round(((text.length - wrongWords.length) / text.length) * 100)
      
      setStats({
        wpm,
        accuracy,
        wrongWords: [...new Set(wrongWords)]
      })
      setIsComplete(true)
    }
  }, [typedText, text, wrongWords, currentChunkStartIndex, startTime])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <div className="typing-container">
      <div className="text-display">
        {renderText(currentChunk)}
      </div>
      {nextChunk && (
        <div className="text-preview">
          {renderText(nextChunk, true)}
        </div>
      )}
      {isComplete && stats && (
        <ResultsModal stats={stats} onTryAgain={handleTryAgain} />
      )}
    </div>
  )
}

export default App
