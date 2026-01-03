import React from 'react';
import styles from './VirtualHands.module.css';

const VirtualHands = ({ nextKey, showHands }) => {
  if (!showHands) return null;

  // Helper function to determine which Shift key to highlight
  const getShiftSide = (letter) => {
    const leftHandKeys = 'qwertasdfgzxcvb1234567';
    return leftHandKeys.includes(letter.toLowerCase()) ? 'ShiftRight' : 'ShiftLeft';
  };

  // Helper function to get finger position for a key
  const getFingerPosition = (key) => {
    const positions = {
      // Left hand home row
      'a': { hand: 'left', finger: 'pinky' },
      's': { hand: 'left', finger: 'ring' },
      'd': { hand: 'left', finger: 'middle' },
      'f': { hand: 'left', finger: 'index' },
      'g': { hand: 'left', finger: 'index' },
      
      // Right hand home row
      'h': { hand: 'right', finger: 'index' },
      'j': { hand: 'right', finger: 'index' },
      'k': { hand: 'right', finger: 'middle' },
      'l': { hand: 'right', finger: 'ring' },
      ';': { hand: 'right', finger: 'pinky' },
      "'": { hand: 'right', finger: 'pinky' },
      
      // Left hand top row
      'q': { hand: 'left', finger: 'pinky' },
      'w': { hand: 'left', finger: 'ring' },
      'e': { hand: 'left', finger: 'middle' },
      'r': { hand: 'left', finger: 'index' },
      't': { hand: 'left', finger: 'index' },
      
      // Right hand top row
      'y': { hand: 'right', finger: 'index' },
      'u': { hand: 'right', finger: 'index' },
      'i': { hand: 'right', finger: 'middle' },
      'o': { hand: 'right', finger: 'ring' },
      'p': { hand: 'right', finger: 'pinky' },
      '[': { hand: 'right', finger: 'pinky' },
      ']': { hand: 'right', finger: 'pinky' },
      '\\': { hand: 'right', finger: 'pinky' },
      
      // Left hand bottom row
      'z': { hand: 'left', finger: 'pinky' },
      'x': { hand: 'left', finger: 'ring' },
      'c': { hand: 'left', finger: 'middle' },
      'v': { hand: 'left', finger: 'index' },
      'b': { hand: 'left', finger: 'index' },
      
      // Right hand bottom row
      'n': { hand: 'right', finger: 'index' },
      'm': { hand: 'right', finger: 'index' },
      ',': { hand: 'right', finger: 'middle' },
      '.': { hand: 'right', finger: 'ring' },
      '/': { hand: 'right', finger: 'pinky' },
      
      // Number row - left hand
      '`': { hand: 'left', finger: 'pinky' },
      '1': { hand: 'left', finger: 'pinky' },
      '2': { hand: 'left', finger: 'ring' },
      '3': { hand: 'left', finger: 'middle' },
      '4': { hand: 'left', finger: 'index' },
      '5': { hand: 'left', finger: 'index' },
      
      // Number row - right hand
      '6': { hand: 'right', finger: 'index' },
      '7': { hand: 'right', finger: 'index' },
      '8': { hand: 'right', finger: 'middle' },
      '9': { hand: 'right', finger: 'ring' },
      '0': { hand: 'right', finger: 'pinky' },
      '-': { hand: 'right', finger: 'pinky' },
      '=': { hand: 'right', finger: 'pinky' },
      
      // Special keys
      'ShiftLeft': { hand: 'left', finger: 'pinky' },
      'ShiftRight': { hand: 'right', finger: 'pinky' },
      'Space': { hand: 'left', finger: 'thumb' },
      'Enter': { hand: 'right', finger: 'pinky' },
      '\n': { hand: 'right', finger: 'pinky' },
    };

    return positions[key] || null;
  };

  // Map shift characters to their base keys
  const shiftCharToBaseKey = {
    '~': '`', '!': '1', '@': '2', '#': '3', '$': '4', '%': '5',
    '^': '6', '&': '7', '*': '8', '(': '9', ')': '0',
    '_': '-', '+': '=',
    '{': '[', '}': ']', '|': '\\',
    ':': ';', '"': "'",
    '<': ',', '>': '.', '?': '/'
  };

  // Check if a character requires shift
  const requiresShift = (char) => {
    if (!char) return false;
    
    // Capital letters require shift
    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      return true;
    }
    
    // Check if it's a shift-modified character
    return shiftCharToBaseKey.hasOwnProperty(char);
  };

  // Get the base key for a shift character
  const getBaseKey = (char) => {
    // If it's a capital letter, return lowercase
    if (char === char.toUpperCase() && char !== char.toLowerCase()) {
      return char.toLowerCase();
    }
    
    // If it's a shift-modified special character, return base key
    return shiftCharToBaseKey[char] || char;
  };

  // Get active fingers (primary and secondary if shift is needed)
  const getActiveFingers = (key) => {
    if (!key) return { primary: null, secondary: null };
    
    // Handle space character
    if (key === ' ') {
      return { primary: getFingerPosition('Space'), secondary: null };
    }
    
    // Handle Enter/newline
    if (key === '\n' || key === 'Enter') {
      return { primary: getFingerPosition('Enter'), secondary: null };
    }
    
    // Check if shift is required
    if (requiresShift(key)) {
      const baseKey = getBaseKey(key);
      const primaryFinger = getFingerPosition(baseKey);
      const shiftKey = getShiftSide(baseKey);
      const secondaryFinger = getFingerPosition(shiftKey);
      
      return {
        primary: primaryFinger,
        secondary: secondaryFinger
      };
    }
    
    // No shift needed, just return primary finger
    return {
      primary: getFingerPosition(key.toLowerCase()),
      secondary: null
    };
  };

  // Normalize character to CSS class name
  const normalizeKeyForClass = (char) => {
    // Handle letters
    if (/[a-zA-Z]/.test(char)) {
      return char.toLowerCase();
    }
    
    // Handle numbers
    if (/[0-9]/.test(char)) {
      return char;
    }
    
    // Handle special characters
    const specialCharMap = {
      '`': 'tilde', '~': 'tilde',
      '!': 'exclamation',
      '@': 'at',
      '#': 'hash',
      '$': 'dollar',
      '%': 'percent',
      '^': 'caret',
      '&': 'ampersand',
      '*': 'asterisk',
      '(': 'parenleft',
      ')': 'parenright',
      '-': 'minus',
      '_': 'underscore',
      '=': 'equals',
      '+': 'plus',
      '[': 'bracketleft',
      '{': 'braceleft',
      ']': 'bracketright',
      '}': 'braceright',
      '\\': 'backslash',
      '|': 'pipe',
      ';': 'semicolon',
      ':': 'colon',
      "'": 'quote',
      '"': 'quote',
      ',': 'comma',
      '<': 'lessthan',
      '.': 'period',
      '>': 'greaterthan',
      '/': 'slash',
      '?': 'question',
      '\n': 'enter',
      'Enter': 'enter'
    };
    
    return specialCharMap[char] || 'special';
  };

  // Get position class name for the hands container
  const getPositionClass = (key) => {
    if (!key) return 'position-default';
    
    // Handle space
    if (key === ' ') {
      return 'position-space';
    }
    
    // Handle Enter/newline
    if (key === '\n' || key === 'Enter') {
      return 'position-enter';
    }
    
    // Handle shift combinations
    if (requiresShift(key)) {
      const baseKey = getBaseKey(key);
      const shiftSide = getShiftSide(baseKey);
      const shiftSuffix = shiftSide === 'ShiftLeft' ? 'leftshift' : 'rightshift';
      const normalizedKey = normalizeKeyForClass(key);
      
      // Ensure normalizedKey is not undefined
      if (!normalizedKey) {
        return 'position-default';
      }
      
      return `position-${normalizedKey}-${shiftSuffix}`;
    }
    
    // Regular key (no shift)
    const normalizedKey = normalizeKeyForClass(key);
    
    // Ensure normalizedKey is not undefined
    if (!normalizedKey) {
      return 'position-default';
    }
    
    return `position-${normalizedKey}`;
  };

  const { primary: activeFinger, secondary: activeSecondaryFinger } = getActiveFingers(nextKey);
  const positionClass = getPositionClass(nextKey);

  // Helper function to check if a finger should be active
  const isFingerActive = (hand, finger, primaryFinger, secondaryFinger) => {
    return (primaryFinger?.hand === hand && primaryFinger?.finger === finger) ||
           (secondaryFinger?.hand === hand && secondaryFinger?.finger === finger);
  };

  // Render a finger with base, joint, and tip
  // Structure: fingerBase contains fingerJoint, which contains fingerTip
  const renderFinger = (hand, fingerName) => {
    const isActive = isFingerActive(hand, fingerName, activeFinger, activeSecondaryFinger);
    
    return (
      <div className={`${styles.fingerBase} ${styles[fingerName]} ${isActive ? styles.active : ''}`}>
        <div className={styles.fingerJoint}>
          <div className={styles.fingerTip}></div>
        </div>
      </div>
    );
  };

  return (
    <div className={`${styles.handsContainer} ${styles[positionClass]}`}>
      <div className={styles.leftHand}>
        <div className={styles.palm}>
          {renderFinger('left', 'thumb')}
          {renderFinger('left', 'index')}
          {renderFinger('left', 'middle')}
          {renderFinger('left', 'ring')}
          {renderFinger('left', 'pinky')}
        </div>
      </div>
      <div className={styles.rightHand}>
        <div className={styles.palm}>
          {renderFinger('right', 'thumb')}
          {renderFinger('right', 'index')}
          {renderFinger('right', 'middle')}
          {renderFinger('right', 'ring')}
          {renderFinger('right', 'pinky')}
        </div>
      </div>
    </div>
  );
};

export default VirtualHands;
