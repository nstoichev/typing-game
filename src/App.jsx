import { useState, useEffect, useRef } from 'react'
import ResultsModal from './components/ResultsModal'
import './App.css'

function App() {
  const [fullText, setFullText] = useState('This is a sample text for typing practice. You can replace this with any longer text later. The goal is to type this text as accurately and quickly as possible. Your performance will be measured in words per minute (WPM) and accuracy percentage. Good luck! Your performance will be measured in words per minute (WPM) and accuracy percentage. Good luck!')
  const [userInput, setUserInput] = useState('')
  const [startTime, setStartTime] = useState(null)
  const [isComplete, setIsComplete] = useState(false)
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0, wrongWords: [] })
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0)
  const textareaRef = useRef(null)
  const timerRef = useRef(null)

  // Split text into chunks of approximately 150 characters, ensuring we don't split words
  const splitTextIntoChunks = (text) => {
    const chunks = []
    const targetChunkSize = 150
    let currentIndex = 0

    while (currentIndex < text.length) {
      let chunkEnd = currentIndex + targetChunkSize
      
      // If we're not at the end of the text, find the next space to avoid splitting words
      if (chunkEnd < text.length) {
        while (chunkEnd < text.length && text[chunkEnd] !== ' ') {
          chunkEnd++
        }
      } else {
        chunkEnd = text.length
      }

      chunks.push(text.slice(currentIndex, chunkEnd))
      currentIndex = chunkEnd
    }

    return chunks
  }

  const chunks = useRef(splitTextIntoChunks(fullText))

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startTimer = () => {
    if (!isTimerRunning) {
      setIsTimerRunning(true)
      const start = Date.now() - elapsedTime
      timerRef.current = setInterval(() => {
        setElapsedTime(Date.now() - start)
      }, 10)
    }
  }

  const stopTimer = () => {
    if (isTimerRunning) {
      setIsTimerRunning(false)
      clearInterval(timerRef.current)
    }
  }

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleDisplayClick = () => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }

  const calculateStats = (input) => {
    const words = fullText.split(' ').length
    const timeInMinutes = elapsedTime / 60000
    const wpm = Math.round(words / timeInMinutes)
    
    // Calculate accuracy and wrong words
    let wrongChars = 0
    const wrongWords = []
    let currentWord = ''
    let currentWordStart = 0
    
    for (let i = 0; i < fullText.length; i++) {
      if (fullText[i] === ' ' || i === fullText.length - 1) {
        // End of word
        if (i === fullText.length - 1) {
          currentWord += fullText[i]
        }
        if (input.slice(currentWordStart, i + 1) !== fullText.slice(currentWordStart, i + 1)) {
          wrongWords.push(currentWord)
        }
        currentWord = ''
        currentWordStart = i + 1
      } else {
        currentWord += fullText[i]
        if (input[i] !== fullText[i]) {
          wrongChars++
        }
      }
    }
    
    const accuracy = Math.round(((fullText.length - wrongChars) / fullText.length) * 100)
    
    return {
      wpm,
      accuracy,
      wrongWords
    }
  }

  const handleInputChange = (e) => {
    const input = e.target.value
    setUserInput(input)

    // Start timer only when user starts typing
    if (input.length === 1) {
      setStartTime(Date.now())
      startTimer()
    }

    // Check if we need to load the next chunk
    if (currentChunkIndex < chunks.current.length - 1) {
      const currentChunk = chunks.current[currentChunkIndex]
      const previousChunksLength = chunks.current.slice(0, currentChunkIndex).join('').length
      if (input.length >= previousChunksLength + currentChunk.length) {
        setCurrentChunkIndex(prev => prev + 1)
      }
    }

    if (input.length === fullText.length) {
      stopTimer()
      const newStats = calculateStats(input)
      setStats(newStats)
      setIsComplete(true)
    }
  }

  const handleInputBlur = () => {
    stopTimer()
  }

  const handleTryAgain = () => {
    setUserInput('')
    setStartTime(null)
    setElapsedTime(0)
    setIsComplete(false)
    setIsTimerRunning(false)
    setCurrentChunkIndex(0)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    textareaRef.current.focus()
  }

  const renderText = (text, isPreview = false) => {
    const currentChunk = chunks.current[currentChunkIndex]
    const previousChunksLength = chunks.current.slice(0, currentChunkIndex).join('').length
    const userInputInChunk = userInput.slice(
      previousChunksLength,
      previousChunksLength + currentChunk.length
    )

    return text.split('').map((char, index) => {
      let className = ''
      if (!isPreview) {
        if (index < userInputInChunk.length) {
          className = userInputInChunk[index] === char ? 'typed' : 'wrong'
        } else if (index === userInputInChunk.length && userInput.length < fullText.length) {
          className = 'current'
        }
      }
      return (
        <span key={index} className={className}>
          {char}
        </span>
      )
    })
  }

  return (
    <div className="typing-container">
      <div className="timer">{formatTime(elapsedTime)}</div>
      <textarea
        ref={textareaRef}
        className="typing-input"
        value={userInput}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder="Start typing..."
      />      
      <div className="text-display" onClick={handleDisplayClick}>
        {renderText(chunks.current[currentChunkIndex])}
      </div>
      {currentChunkIndex < chunks.current.length - 1 && (
        <div className="text-preview">
          {renderText(chunks.current[currentChunkIndex + 1], true)}
        </div>
      )}
      {isComplete && (
        <ResultsModal
          stats={stats}
          onTryAgain={handleTryAgain}
        />
      )}
    </div>
  )
}

export default App
