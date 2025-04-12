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
      'a': { hand: 'left', finger: 'pinky', x: 0, y: 0 },
      's': { hand: 'left', finger: 'ring', x: 0, y: 0 },
      'd': { hand: 'left', finger: 'middle', x: 0, y: 0 },
      'f': { hand: 'left', finger: 'index', x: 0, y: 0 },
      
      // Right hand home row
      'j': { hand: 'right', finger: 'index', x: 0, y: 0 },
      'k': { hand: 'right', finger: 'middle', x: 0, y: 0 },
      'l': { hand: 'right', finger: 'ring', x: 0, y: 0 },
      ';': { hand: 'right', finger: 'pinky', x: 0, y: 0 },
      
      // Left hand top row
      'q': { hand: 'left', finger: 'pinky', x: -1, y: -1 },
      'w': { hand: 'left', finger: 'ring', x: -1, y: -1 },
      'e': { hand: 'left', finger: 'middle', x: -1, y: -1 },
      'r': { hand: 'left', finger: 'index', x: -1, y: -1 },
      't': { hand: 'left', finger: 'index', x: -1, y: -1 },
      
      // Right hand top row
      'y': { hand: 'right', finger: 'index', x: 1, y: -1 },
      'u': { hand: 'right', finger: 'index', x: 1, y: -1 },
      'i': { hand: 'right', finger: 'middle', x: 1, y: -1 },
      'o': { hand: 'right', finger: 'ring', x: 1, y: -1 },
      'p': { hand: 'right', finger: 'pinky', x: 1, y: -1 },
      
      // Left hand bottom row
      'z': { hand: 'left', finger: 'pinky', x: -1, y: 1 },
      'x': { hand: 'left', finger: 'ring', x: -1, y: 1 },
      'c': { hand: 'left', finger: 'middle', x: -1, y: 1 },
      'v': { hand: 'left', finger: 'index', x: -1, y: 1 },
      'b': { hand: 'left', finger: 'index', x: -1, y: 1 },
      
      // Right hand bottom row
      'n': { hand: 'right', finger: 'index', x: 1, y: 1 },
      'm': { hand: 'right', finger: 'index', x: 1, y: 1 },
      ',': { hand: 'right', finger: 'middle', x: 1, y: 1 },
      '.': { hand: 'right', finger: 'ring', x: 1, y: 1 },
      '/': { hand: 'right', finger: 'pinky', x: 1, y: 1 },
      
      // Special keys
      'ShiftLeft': { hand: 'left', finger: 'pinky', x: -2, y: 1 },
      'ShiftRight': { hand: 'right', finger: 'pinky', x: 2, y: 1 },
      'Space': { hand: 'left', finger: 'thumb', x: 0, y: 2 },
    };

    return positions[key] || null;
  };

  const getActiveFinger = (key) => {
    if (!key) return null;
    
    // Handle space character
    if (key === ' ') return getFingerPosition('Space');
    
    // Handle shift for capital letters
    if (key === key.toUpperCase() && key !== key.toLowerCase()) {
      return getFingerPosition(getShiftSide(key));
    }
    
    return getFingerPosition(key.toLowerCase());
  };

  const activeFinger = getActiveFinger(nextKey);

  return (
    <div className={styles.handsContainer}>
      <div className={styles.leftHand}>
        <div className={styles.palm}></div>
        <div className={`${styles.finger} ${styles.thumb}`}></div>
        <div className={`${styles.finger} ${styles.index} ${activeFinger?.hand === 'left' && activeFinger?.finger === 'index' ? styles.active : ''}`}></div>
        <div className={`${styles.finger} ${styles.middle} ${activeFinger?.hand === 'left' && activeFinger?.finger === 'middle' ? styles.active : ''}`}></div>
        <div className={`${styles.finger} ${styles.ring} ${activeFinger?.hand === 'left' && activeFinger?.finger === 'ring' ? styles.active : ''}`}></div>
        <div className={`${styles.finger} ${styles.pinky} ${activeFinger?.hand === 'left' && activeFinger?.finger === 'pinky' ? styles.active : ''}`}></div>
      </div>
      <div className={styles.rightHand}>
        <div className={styles.palm}></div>
        <div className={`${styles.finger} ${styles.thumb}`}></div>
        <div className={`${styles.finger} ${styles.index} ${activeFinger?.hand === 'right' && activeFinger?.finger === 'index' ? styles.active : ''}`}></div>
        <div className={`${styles.finger} ${styles.middle} ${activeFinger?.hand === 'right' && activeFinger?.finger === 'middle' ? styles.active : ''}`}></div>
        <div className={`${styles.finger} ${styles.ring} ${activeFinger?.hand === 'right' && activeFinger?.finger === 'ring' ? styles.active : ''}`}></div>
        <div className={`${styles.finger} ${styles.pinky} ${activeFinger?.hand === 'right' && activeFinger?.finger === 'pinky' ? styles.active : ''}`}></div>
      </div>
    </div>
  );
};

export default VirtualHands; 