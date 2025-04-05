import { useState, useEffect, useCallback } from 'react'
import './App.css'
import ResultsModal from './components/ResultsModal'
import Settings from './components/Settings'
import ActionButtons from './components/ActionButtons'
import words from './jsons/words.json'

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
  const [textSource, setTextSource] = useState('random')

  const CHUNK_SIZE = 100
  const CHUNK_BUFFER = 20
  const MAX_WIKI_ATTEMPTS = 5

  const isValidText = (text) => {
    // Only allow basic ASCII characters, spaces, and common punctuation
    return /^[a-zA-Z0-9\s.,!?'"-]+$/.test(text);
  };

  const fetchWikipediaText = async (attempt = 1) => {
    try {
      const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/summary');
      const data = await response.json();
      const extract = data.extract;
      
      if (isValidText(extract)) {
        return extract;
      } else if (attempt < MAX_WIKI_ATTEMPTS) {
        return fetchWikipediaText(attempt + 1);
      } else {
        throw new Error('Could not find valid Wikipedia text after maximum attempts');
      }
    } catch (error) {
      console.error('Error fetching Wikipedia text:', error);
      return generateRandomText();
    }
  };

  const generateRandomText = () => {
    const wordCounts = new Map()
    let result = ''
    let lastWord = ''
    let totalLength = 0
    const targetLength = 300

    while (totalLength < targetLength) {
      const randomIndex = Math.floor(Math.random() * words.length)
      const word = words[randomIndex]
      
      if (word === lastWord || (wordCounts.get(word) || 0) >= 2) {
        continue
      }

      result += word + ' '
      totalLength += word.length + 1
      
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1)
      lastWord = word
    }

    return result.trim()
  }

  const getChunkWithWordBoundary = (text, startIndex) => {
    const maxEndIndex = startIndex + CHUNK_SIZE + CHUNK_BUFFER
    const endIndex = Math.min(maxEndIndex, text.length)
    
    let lastSpaceIndex = text.lastIndexOf(' ', endIndex)
    
    if (lastSpaceIndex <= startIndex) {
      lastSpaceIndex = endIndex
    }
    
    return {
      chunk: text.slice(startIndex, lastSpaceIndex + 1),
      endIndex: lastSpaceIndex + 1
    }
  }

  const initializeText = async () => {
    let newText;
    if (textSource === 'wikipedia') {
      newText = await fetchWikipediaText();
    } else {
      newText = generateRandomText();
    }
    
    setText(newText);
    const firstChunk = getChunkWithWordBoundary(newText, 0);
    setCurrentChunk(firstChunk.chunk);
    const secondChunk = getChunkWithWordBoundary(newText, firstChunk.endIndex);
    setNextChunk(secondChunk.chunk);
    setCurrentChunkStartIndex(0);
    setTypedText('');
    setWrongWords([]);
    setIsComplete(false);
    setIsActive(false);
    setStats(null);
    setStartTime(null);
  };

  useEffect(() => {
    initializeText();
  }, [textSource]);

  const handleSourceChange = (source) => {
    setTextSource(source);
  };

  const handleKeyDown = useCallback((e) => {
    if (!isActive) {
      setIsActive(true)
      setStartTime(Date.now())
    }

    if (e.key === 'Backspace') {
      if (typedText.length > 0) {
        const newTypedText = typedText.slice(0, -1)
        setTypedText(newTypedText)
        
        // Check if the backspace fixed a wrong word
        const lastTypedChar = text[currentChunkStartIndex + newTypedText.length]
        if (lastTypedChar === typedText[typedText.length - 1]) {
          setWrongWords(prev => prev.slice(0, -1))
        }
      }
      return
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
        // Only add the word if it's not a space and not already in the wrong words list
        if (currentWord.trim() && !wrongWords.includes(currentWord)) {
          setWrongWords(prev => [...prev, currentWord])
        }
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

  const handleRestart = () => {
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

  const handleGenerate = () => {
    initializeText()
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
      <Settings 
        onSourceChange={handleSourceChange}
        currentSource={textSource}
      />
      <div className="text-display">
        {renderText(currentChunk)}
      </div>
      {nextChunk && (
        <div className="text-preview">
          {renderText(nextChunk, true)}
        </div>
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
