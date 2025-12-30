import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './CustomTextModal.css';

// Maximum character limit for custom text
const MAX_TEXT_LENGTH = 3000;

// Valid characters that can be typed on a keyboard (matching VALID_TYPING_KEYS from useTypingGame)
// Characters: a-z, A-Z, 0-9, space, and: , . ; ' " ! ? - _ = + [ ] { } \ | ` ~ @ # $ % ^ & * ( ) / < >
const VALID_CHARS_REGEX = /^[a-zA-Z0-9\s.,;'"!?\-_=+\[\]{}|\\`~@#$%^&*()\/<>]*$/;

// Filter out invalid characters from text
const filterInvalidChars = (text) => {
  return text.split('').filter(char => {
    // Allow newlines
    if (char === '\n') return true;
    // Check if character matches valid pattern (test single character)
    return /^[a-zA-Z0-9\s.,;'"!?\-_=+\[\]{}|\\`~@#$%^&*()\/<>]$/.test(char);
  }).join('');
};

const CustomTextModal = ({ isOpen, onClose, onStart, initialValue = '' }) => {
  const [customText, setCustomText] = useState(initialValue);
  const [error, setError] = useState('');

  // Update local state when initialValue changes (when modal opens with existing text)
  useEffect(() => {
    if (isOpen) {
      setCustomText(initialValue);
      setError('');
    }
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    let newValue = e.target.value;
    let errorMessage = '';
    
    // Enforce character limit
    if (newValue.length > MAX_TEXT_LENGTH) {
      newValue = newValue.slice(0, MAX_TEXT_LENGTH);
      errorMessage = `Text limit reached (${MAX_TEXT_LENGTH} characters). Additional characters were removed.`;
    }
    
    // Filter invalid characters
    const filteredValue = filterInvalidChars(newValue);
    if (filteredValue !== newValue && !errorMessage) {
      errorMessage = 'Invalid characters (emojis, special symbols) were removed. Only keyboard-typable characters are allowed.';
    }
    
    setError(errorMessage);
    setCustomText(filteredValue);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    
    // Filter invalid characters from pasted text
    let filteredText = filterInvalidChars(pastedText);
    
    // Enforce character limit
    const currentLength = customText.length;
    const remainingSpace = MAX_TEXT_LENGTH - currentLength;
    
    if (filteredText.length > remainingSpace) {
      filteredText = filteredText.slice(0, remainingSpace);
      setError(`Text limit reached (${MAX_TEXT_LENGTH} characters). Pasted text was truncated.`);
    } else if (pastedText !== filteredText) {
      setError('Invalid characters (emojis, special symbols) were removed from pasted text.');
    } else {
      setError('');
    }
    
    // Insert filtered text at cursor position
    const textarea = e.target;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = customText.slice(0, start) + filteredText + customText.slice(end);
    setCustomText(newText);
    
    // Restore cursor position after state update
    setTimeout(() => {
      textarea.setSelectionRange(start + filteredText.length, start + filteredText.length);
    }, 0);
  };

  const handleStart = () => {
    const trimmedText = customText.trim();
    if (trimmedText) {
      // Final validation before starting
      const filteredText = filterInvalidChars(trimmedText);
      if (filteredText.length > MAX_TEXT_LENGTH) {
        setError(`Text exceeds maximum length of ${MAX_TEXT_LENGTH} characters.`);
        return;
      }
      
      if (filteredText !== trimmedText) {
        setError('Text contains invalid characters. Please remove them before starting.');
        return;
      }
      
      onStart(trimmedText);
      // Don't clear the textarea - keep it for next time
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    // Stop propagation to prevent typing game from processing these keys
    e.stopPropagation();
    
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const characterCount = customText.length;
  const isAtLimit = characterCount >= MAX_TEXT_LENGTH;
  const hasError = error !== '';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content custom-text-modal" onClick={(e) => e.stopPropagation()}>
        <h2>Enter Custom Text</h2>
        <textarea
          className={`custom-text-textarea ${hasError ? 'error' : ''}`}
          value={customText}
          onChange={handleChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyDown}
          onKeyUp={(e) => e.stopPropagation()}
          placeholder="Type or paste your text here..."
          rows={10}
          autoFocus
        />
        <div className="custom-text-info">
          <div className={`character-count ${isAtLimit ? 'at-limit' : ''}`}>
            {characterCount} / {MAX_TEXT_LENGTH} characters
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
        <div className="modal-actions">
          <button className="button" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="button button--success" 
            onClick={handleStart}
            disabled={!customText.trim() || hasError}
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
};

CustomTextModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  initialValue: PropTypes.string
};

export default CustomTextModal;

