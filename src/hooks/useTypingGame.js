import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import words from '../jsons/words.json';

const CHUNK_SIZE = 100;
const CHUNK_BUFFER = 20;
const MAX_WIKI_ATTEMPTS = 5;

// List of valid typing keys
const VALID_TYPING_KEYS = new Set([
  // Letters
  'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
  'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
  // Numbers
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  // Punctuation and special characters
  ' ', ',', '.', ';', "'", '"', '!', '?', '-', '_', '=', '+',
  '[', ']', '{', '}', '\\', '|', '`', '~', '@', '#', '$', '%',
  '^', '&', '*', '(', ')', '/', '<', '>'
]);

export const useTypingGame = () => {
  const location = useLocation();
  const [text, setText] = useState('');
  const [currentChunk, setCurrentChunk] = useState('');
  const [nextChunk, setNextChunk] = useState('');
  const [typedText, setTypedText] = useState('');
  const [wrongWords, setWrongWords] = useState([]);
  const [wrongChars, setWrongChars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState(null);
  const [currentChunkStartIndex, setCurrentChunkStartIndex] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [textSource, setTextSource] = useState('random');
  const [countdown, setCountdown] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);
  const initialCountdownRef = useRef(null);
  const [wordWPMs, setWordWPMs] = useState({}); // Map of wordIndex -> WPM
  const wordStartTimesRef = useRef({}); // Map of wordIndex -> start timestamp

  const isValidText = (text) => {
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
        console.warn('Could not find valid Wikipedia text after maximum attempts, falling back to random text');
        return generateRandomText();
      }
    } catch (error) {
      console.error('Error fetching Wikipedia text:', error);
      return generateRandomText();
    }
  };

  const generateRandomText = () => {
    const wordCounts = new Map();
    let result = '';
    let lastWord = '';
    let totalLength = 0;
    const targetLength = 300;

    while (totalLength < targetLength) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const word = words[randomIndex];
      
      if (word === lastWord || (wordCounts.get(word) || 0) >= 2) {
        continue;
      }

      result += word + ' ';
      totalLength += word.length + 1;
      
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
      lastWord = word;
    }

    return result.trim();
  };

  const getChunkWithWordBoundary = (text, startIndex) => {
    // If we're at the start and the entire text can fit in one chunk, return it all
    if (startIndex === 0 && text.length <= CHUNK_SIZE + CHUNK_BUFFER) {
      return {
        chunk: text,
        endIndex: text.length
      };
    }

    const maxEndIndex = startIndex + CHUNK_SIZE + CHUNK_BUFFER;
    const endIndex = Math.min(maxEndIndex, text.length);
    
    // If the remaining text can fit in this chunk, return it all
    if (text.length - startIndex <= CHUNK_SIZE + CHUNK_BUFFER) {
      return {
        chunk: text.slice(startIndex),
        endIndex: text.length
      };
    }
    
    let lastSpaceIndex = text.lastIndexOf(' ', endIndex);
    
    if (lastSpaceIndex <= startIndex) {
      lastSpaceIndex = endIndex;
    }
    
    const chunk = text.slice(startIndex, lastSpaceIndex + 1);
    
    return {
      chunk: chunk,
      endIndex: lastSpaceIndex + 1
    };
  };

  const generateMoreText = () => {
    let newText;
    if (textSource === 'wikipedia') {
      // For Wikipedia, we'll need to fetch new text
      // For now, we'll use random text as fallback
      newText = generateRandomText();
    } else {
      newText = generateRandomText();
    }
    return newText;
  };

  const ensurePreviewText = (currentText, currentPosition) => {
    // If we're in countdown mode and don't have enough text for preview
    if (countdown !== null && currentPosition + CHUNK_SIZE * 2 >= currentText.length) {
      const newText = generateMoreText();
      return currentText + ' ' + newText;
    }
    return currentText;
  };

  // Helper function to get current word boundaries
  const getCurrentWord = useCallback((text, position, chunkStartIndex, chunkLength) => {
    const lastSpaceIndex = text.lastIndexOf(' ', position);
    const nextSpaceIndex = text.indexOf(' ', position);
    return {
      word: text.slice(
        lastSpaceIndex === -1 ? chunkStartIndex : lastSpaceIndex + 1,
        nextSpaceIndex === -1 ? chunkStartIndex + chunkLength : nextSpaceIndex
      ).trim(),
      startPos: lastSpaceIndex === -1 ? chunkStartIndex : lastSpaceIndex + 1,
      endPos: nextSpaceIndex === -1 ? chunkStartIndex + chunkLength : nextSpaceIndex
    };
  }, []);

  const handleKeyDown = useCallback((e) => {
    // Only process events if we're on the home or practice page
    if (location.pathname !== '/' && location.pathname !== '/speed-test') {
      return;
    }

    // Prevent any typing if the game is complete
    if (isComplete) {
      return;
    }

    // Check if the key is a valid typing key
    const key = e.key || '';
    const isValidTypingKey = VALID_TYPING_KEYS.has(key.toLowerCase()) || key === 'Backspace';

    if (!isActive && isValidTypingKey) {
      setIsActive(true);
      setStartTime(Date.now());
      // Start countdown timer if countdown is set
      if (countdown !== null && countdown > 0) {
        // Store initial countdown value for WPM calculation
        initialCountdownRef.current = countdown;
        // Clear any existing timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        timerRef.current = setInterval(() => {
          setCountdown(prev => {
            if (prev === null || prev <= 0) {
              if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
              }
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }

    // Only process the key if it's a valid typing key
    if (!isValidTypingKey) {
      return;
    }

    if (e.key === 'Backspace') {
      if (typedText.length > 0) {
        const newTypedText = typedText.slice(0, -1);
        setTypedText(newTypedText);
        
        const removedChar = typedText[typedText.length - 1];
        const correctChar = text[currentChunkStartIndex + newTypedText.length];
        if (removedChar !== correctChar) {
          setWrongChars(prev => Math.max(0, prev - 1));
        }
        
        // Check if word is now correct after backspace correction
        const currentPosition = currentChunkStartIndex + newTypedText.length;
        const wordInfo = getCurrentWord(text, currentPosition, currentChunkStartIndex, currentChunk.length);
        if (wordInfo.word) {
          // Get the typed portion of the current word
          const typedWordStart = Math.max(0, newTypedText.lastIndexOf(' ') + 1);
          const typedWord = newTypedText.slice(typedWordStart);
          
          // Check if word is complete (at end of word or followed by space in original text)
          const isWordComplete = currentPosition >= wordInfo.endPos - 1;
          
          // Only remove from wrongWords if word is complete and matches expected word
          if (isWordComplete && typedWord.trim() === wordInfo.word && wrongWords.includes(wordInfo.word)) {
            setWrongWords(prev => prev.filter(word => word !== wordInfo.word));
          }
        }
      }
      return;
    }

    if (e.key.length === 1) {
      const newTypedText = typedText + e.key;
      setTypedText(newTypedText);
      
      const currentChar = text[currentChunkStartIndex + typedText.length];
      const isWrong = e.key !== currentChar;
      const currentPosition = currentChunkStartIndex + typedText.length;
      const wordInfo = getCurrentWord(text, currentPosition, currentChunkStartIndex, currentChunk.length);
      
      // Calculate word index in the full text by counting words before this word's start position
      const textBeforeWord = text.slice(0, wordInfo.startPos);
      const wordIndex = textBeforeWord.split(' ').filter(w => w.length > 0).length;
      
      // Track word start time (when first character of word is typed)
      if (wordInfo.word && !wordStartTimesRef.current[wordIndex]) {
        // Check if this is the first character of the word
        // The word starts at wordInfo.startPos, and we're typing at currentPosition
        // If currentPosition equals wordInfo.startPos, we're typing the first character
        const isFirstCharOfWord = currentPosition === wordInfo.startPos;
        if (isFirstCharOfWord) {
          wordStartTimesRef.current[wordIndex] = Date.now();
        }
      }
      
      // Combined check: handle wrong character and wrong word tracking together
      if (isWrong) {
        setWrongChars(prev => prev + 1);
        
        // Add word to wrongWords if not already there
        if (wordInfo.word && !wrongWords.includes(wordInfo.word)) {
          setWrongWords(prev => [...prev, wordInfo.word]);
        }
      } else {
        // Character is correct - check if word is complete and correct
        if (wordInfo.word) {
          // Get the typed portion of the current word (from last space to current position)
          const typedWordStart = Math.max(0, newTypedText.lastIndexOf(' ') + 1);
          const typedWord = newTypedText.slice(typedWordStart);
          
          // Check if word is complete:
          // 1. If we just typed a space (word is complete)
          // 2. If we've reached the end of the expected word
          const isWordComplete = e.key === ' ' || 
            (currentPosition + 1 >= wordInfo.endPos);
          
          if (isWordComplete) {
            // Remove trailing space if present for comparison
            const typedWordWithoutSpace = typedWord.trim();
            // If word is complete and matches expected word, remove from wrongWords
            if (typedWordWithoutSpace === wordInfo.word && wrongWords.includes(wordInfo.word)) {
              setWrongWords(prev => prev.filter(word => word !== wordInfo.word));
            }
            
            // Calculate and store WPM for this word
            const wordStartTime = wordStartTimesRef.current[wordIndex];
            if (wordStartTime && !wordWPMs[wordIndex]) {
              const wordEndTime = Date.now();
              const timeInMinutes = (wordEndTime - wordStartTime) / 60000;
              const wordLength = wordInfo.word.length;
              // WPM = (characters / 5) / time in minutes
              const wordWPM = timeInMinutes > 0 ? Math.round((wordLength / 5) / timeInMinutes) : 0;
              setWordWPMs(prev => ({ ...prev, [wordIndex]: wordWPM }));
            }
          }
        }
      }
      
      if (newTypedText.length === currentChunk.length) {
        const nextChunkStart = currentChunkStartIndex + currentChunk.length;
        
        // Don't move to next chunk if we've reached the end of the text (in freestyle mode)
        // This prevents clearing the display when the test completes
        if (nextChunkStart >= text.length && countdown === null) {
          // We've reached the end, don't advance chunks
          // The completion will be handled by the useEffect that checks for completion
          return;
        }
        
        // Ensure we have enough text for preview
        const updatedText = ensurePreviewText(text, nextChunkStart);
        if (updatedText !== text) {
          setText(updatedText);
        }

        const nextChunk = getChunkWithWordBoundary(updatedText, nextChunkStart);
        const nextNextChunk = getChunkWithWordBoundary(updatedText, nextChunk.endIndex);
        
        setCurrentChunk(nextChunk.chunk);
        setNextChunk(nextNextChunk.chunk);
        setCurrentChunkStartIndex(nextChunkStart);
        setTypedText('');
      }
    }
  }, [text, typedText, currentChunk, isActive, currentChunkStartIndex, countdown, isComplete, wrongWords, location, getCurrentWord]);

  const handleTryAgain = () => {
    // Clear the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    initialCountdownRef.current = null;
    setTypedText('');
    setWrongWords([]);
    setWrongChars(0);
    setIsComplete(false);
    setIsActive(false);
    setStats(null);
    setStartTime(null);
    setWordWPMs({});
    wordStartTimesRef.current = {};
    const firstChunk = getChunkWithWordBoundary(text, 0);
    setCurrentChunk(firstChunk.chunk);
    const secondChunk = getChunkWithWordBoundary(text, firstChunk.endIndex);
    setNextChunk(secondChunk.chunk);
    setCurrentChunkStartIndex(0);
  };

  const handleRestart = () => {
    handleTryAgain();
  };

  const handleSetTextSource = (newSource) => {
    setTextSource(newSource);
  };

  useEffect(() => {
    initializeText();
  }, [textSource]);

  useEffect(() => {
    const calculateStats = (timeInMinutes) => {
      const totalTypedText = text.slice(0, currentChunkStartIndex) + typedText;
      const textLength = totalTypedText.length;
      const correctChars = textLength - wrongChars;
      const wpm = Math.round((correctChars / 5) / timeInMinutes);
      const accuracy = textLength > 0 
      ? Math.round(((textLength - wrongChars) / textLength) * 100)
      : 0;
      
      const stats = {
        wpm,
        accuracy,
        wrongWords: [...new Set(wrongWords)]
      };
      
      setStats(stats);
      setIsComplete(true);
    };

    // Normal mode - when completing the entire text
    if (currentChunkStartIndex + typedText.length === text.length && text.length > 0 && countdown === null) {
      const endTime = Date.now();
      if (!startTime) return;
      const timeInMinutes = (endTime - startTime) / 60000;
      calculateStats(timeInMinutes);
    }
    // Countdown mode - when timer reaches 0
    else if (countdown === 0 && !isComplete) {
      // Use the initial countdown value to calculate time in minutes
      const initialCountdown = initialCountdownRef.current || 60; // Fallback to 60 if not set
      const timeInMinutes = initialCountdown / 60;
      calculateStats(timeInMinutes);
      setIsActive(false);
      initialCountdownRef.current = null; // Reset after calculation
    }
  }, [typedText, text, wrongWords, currentChunkStartIndex, startTime, countdown, isComplete, wrongChars]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  // Clear timer when countdown changes to null or resets
  useEffect(() => {
    if (countdown === null && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      initialCountdownRef.current = null;
    }
  }, [countdown]);

  const initializeText = async () => {
    setIsLoading(true);
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    initialCountdownRef.current = null;

    // Clear existing text while loading
    setText('');
    setCurrentChunk('');
    setNextChunk('');
    setTypedText('');
    setWrongWords([]);
    setWrongChars(0);
    setIsComplete(false);
    setIsActive(false);
    setStats(null);
    setStartTime(null);
    setWordWPMs({});
    wordStartTimesRef.current = {};

    try {
      let newText;
      if (textSource === 'wikipedia') {
        newText = await fetchWikipediaText();
      } else {
        newText = generateRandomText();
      }
      
      // Ensure we have valid text before proceeding
      if (!newText || typeof newText !== 'string') {
        console.error('Invalid text received, falling back to random text');
        newText = generateRandomText();
      }
          
      // For countdown mode, generate more initial text
      if (countdown !== null) {
        const additionalText = generateMoreText();
        newText = newText + ' ' + additionalText;
      }
      
      setText(newText);
      const firstChunk = getChunkWithWordBoundary(newText, 0);
      setCurrentChunk(firstChunk.chunk);
      
      // Ensure we have enough text for preview in countdown mode
      if (countdown !== null) {
        const updatedText = ensurePreviewText(newText, firstChunk.endIndex);
        if (updatedText !== newText) {
          setText(updatedText);
          newText = updatedText;
        }
      }
      
      const secondChunk = getChunkWithWordBoundary(newText, firstChunk.endIndex);
      setNextChunk(secondChunk.chunk);
      setCurrentChunkStartIndex(0);
    } catch (error) {
      console.error('Error initializing text:', error);
      // Fallback to random text if anything goes wrong
      const fallbackText = generateRandomText();
      setText(fallbackText);
      const firstChunk = getChunkWithWordBoundary(fallbackText, 0);
      setCurrentChunk(firstChunk.chunk);
      const secondChunk = getChunkWithWordBoundary(fallbackText, firstChunk.endIndex);
      setNextChunk(secondChunk.chunk);
      setCurrentChunkStartIndex(0);
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate starting word index for current chunk
  const currentChunkStartWordIndex = text.slice(0, currentChunkStartIndex).split(' ').filter(w => w.length > 0).length;

  // Get remaining characters in the current word
  const getRemainingWordChars = useCallback(() => {
    if (!text || !currentChunk) return '';
    
    const currentPosition = currentChunkStartIndex + typedText.length;
    const wordInfo = getCurrentWord(text, currentPosition, currentChunkStartIndex, currentChunk.length);
    
    if (!wordInfo.word) return '';
    
    // Calculate how many characters have been typed in this word
    const wordStartInChunk = wordInfo.startPos - currentChunkStartIndex;
    const typedInWord = Math.max(0, typedText.length - wordStartInChunk);
    
    // Return remaining characters in the word (including the current character)
    return wordInfo.word.slice(typedInWord);
  }, [text, currentChunk, typedText, currentChunkStartIndex, getCurrentWord]);

  return {
    currentChunk,
    nextChunk,
    typedText,
    isComplete,
    stats,
    textSource,
    handleRestart,
    handleTryAgain,
    initializeText,
    setTextSource: handleSetTextSource,
    isActive,
    setIsActive,
    countdown,
    setCountdown,
    isLoading,
    wordWPMs,
    currentChunkStartWordIndex,
    getRemainingWordChars
  };
}; 