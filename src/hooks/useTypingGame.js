import { useState, useEffect, useCallback } from 'react';
import words from '../jsons/words.json';

const CHUNK_SIZE = 100;
const CHUNK_BUFFER = 20;
const MAX_WIKI_ATTEMPTS = 5;

export const useTypingGame = () => {
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
  const [textBuffer, setTextBuffer] = useState('');

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
        throw new Error('Could not find valid Wikipedia text after maximum attempts');
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

  const handleKeyDown = useCallback((e) => {
    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
      if (countdown === 60) {
        const timer = setInterval(() => {
          setCountdown(prev => {
            if (prev <= 0) {
              clearInterval(timer);
              return null;
            }
            return prev - 1;
          });
        }, 1000);
      }
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
      }
      return;
    }

    if (e.key.length === 1) {
      const newTypedText = typedText + e.key;
      setTypedText(newTypedText);
      
      const currentChar = text[currentChunkStartIndex + typedText.length];
      if (e.key !== currentChar) {
        setWrongChars(prev => prev + 1);
      }
      
      if (newTypedText.length === currentChunk.length) {
        const nextChunkStart = currentChunkStartIndex + currentChunk.length;
        
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

      if (e.key !== text[currentChunkStartIndex + typedText.length]) {
        const lastSpaceIndex = text.lastIndexOf(' ', currentChunkStartIndex + typedText.length);
        const nextSpaceIndex = text.indexOf(' ', currentChunkStartIndex + typedText.length);
        const currentWord = text.slice(
          lastSpaceIndex === -1 ? currentChunkStartIndex : lastSpaceIndex + 1,
          nextSpaceIndex === -1 ? currentChunkStartIndex + currentChunk.length : nextSpaceIndex
        );
        if (currentWord.trim() && !wrongWords.includes(currentWord)) {
          setWrongWords(prev => [...prev, currentWord]);
        }
      }
    }
  }, [text, typedText, currentChunk, isActive, currentChunkStartIndex, countdown]);

  const handleTryAgain = () => {
    setTypedText('');
    setWrongWords([]);
    setWrongChars(0);
    setIsComplete(false);
    setIsActive(false);
    setStats(null);
    setStartTime(null);
    const firstChunk = getChunkWithWordBoundary(text, 0);
    setCurrentChunk(firstChunk.chunk);
    const secondChunk = getChunkWithWordBoundary(text, firstChunk.endIndex);
    setNextChunk(secondChunk.chunk);
    setCurrentChunkStartIndex(0);
  };

  const handleRestart = () => {
    handleTryAgain();
  };

  useEffect(() => {
    initializeText();
  }, [textSource]);

  useEffect(() => {
    const calculateStats = (timeInMinutes) => {
      const totalTypedText = text.slice(0, currentChunkStartIndex) + typedText;
      const textLength = totalTypedText.length;
      const wpm = Math.round((textLength / 5) / timeInMinutes);
      const accuracy = Math.round(((textLength - wrongChars) / textLength) * 100);
      
      setStats({
        wpm,
        accuracy,
        wrongWords: [...new Set(wrongWords)]
      });
      setIsComplete(true);
    };

    // Normal mode - when completing the entire text
    if (currentChunkStartIndex + typedText.length === text.length && text.length > 0 && countdown === null) {
      const endTime = Date.now();
      const timeInMinutes = (endTime - startTime) / 60000;
      calculateStats(timeInMinutes);
    }
    // Countdown mode - when timer reaches 0
    else if (countdown === 0 && !isComplete) {
      calculateStats(1); // Exactly 1 minute for countdown mode
      setIsActive(false);
    }
  }, [typedText, text, wrongWords, currentChunkStartIndex, startTime, countdown, isComplete, wrongChars]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const initializeText = async () => {
    let newText;
    if (textSource === 'wikipedia') {
      newText = await fetchWikipediaText();
    } else {
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
    setTypedText('');
    setWrongWords([]);
    setWrongChars(0);
    setIsComplete(false);
    setIsActive(false);
    setStats(null);
    setStartTime(null);
  };

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
    setTextSource,
    isActive,
    countdown,
    setCountdown
  };
}; 