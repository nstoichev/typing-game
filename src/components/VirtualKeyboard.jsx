import React from 'react';
import styles from './VirtualKeyboard.module.css';

const fingerColors = {
  leftPinky: '#FF69B4',    // Pink
  rightPinky: '#FF69B4',   // Pink
  leftRing: '#FFB6C1',     // Light Pink
  rightRing: '#FFB6C1',    // Light Pink
  leftMiddle: '#98FB98',   // Pale Green
  rightMiddle: '#98FB98',  // Pale Green
  leftIndex: '#87CEEB',    // Sky Blue
  rightIndex: '#87CEEB',   // Sky Blue
  leftThumb: '#DDA0DD',    // Plum
  rightThumb: '#DDA0DD'    // Plum
};

const getFingerForKey = (key) => {
  const fingerMap = {
    // Left pinky
    '`': 'leftPinky', '~': 'leftPinky', '1': 'leftPinky', '!': 'leftPinky',
    'Tab': 'leftPinky', 'q': 'leftPinky', 'Q': 'leftPinky',
    'CapsLock': 'leftPinky', 'a': 'leftPinky', 'A': 'leftPinky',
    'ShiftLeft': 'leftPinky', 'z': 'leftPinky', 'Z': 'leftPinky',
    'ControlLeft': 'leftPinky',

    // Left ring
    '2': 'leftRing', '@': 'leftRing',
    'w': 'leftRing', 'W': 'leftRing',
    's': 'leftRing', 'S': 'leftRing',
    'x': 'leftRing', 'X': 'leftRing',

    // Left middle
    '3': 'leftMiddle', '#': 'leftMiddle',
    'e': 'leftMiddle', 'E': 'leftMiddle',
    'd': 'leftMiddle', 'D': 'leftMiddle',
    'c': 'leftMiddle', 'C': 'leftMiddle',

    // Left index
    '4': 'leftIndex', '$': 'leftIndex',
    '5': 'leftIndex', '%': 'leftIndex',
    'r': 'leftIndex', 'R': 'leftIndex',
    't': 'leftIndex', 'T': 'leftIndex',
    'f': 'leftIndex', 'F': 'leftIndex',
    'g': 'leftIndex', 'G': 'leftIndex',
    'v': 'leftIndex', 'V': 'leftIndex',
    'b': 'leftIndex', 'B': 'leftIndex',

    // Left thumb
    'Space': 'leftThumb',
    'AltLeft': 'leftThumb',
    'WindowLeft': 'leftThumb',

    // Right thumb
    'AltRight': 'rightThumb',
    'WindowRight': 'rightThumb',

    // Right index
    '6': 'rightIndex', '^': 'rightIndex',
    '7': 'rightIndex', '&': 'rightIndex',
    'y': 'rightIndex', 'Y': 'rightIndex',
    'u': 'rightIndex', 'U': 'rightIndex',
    'h': 'rightIndex', 'H': 'rightIndex',
    'j': 'rightIndex', 'J': 'rightIndex',
    'n': 'rightIndex', 'N': 'rightIndex',
    'm': 'rightIndex', 'M': 'rightIndex',

    // Right middle
    '8': 'rightMiddle', '*': 'rightMiddle',
    'i': 'rightMiddle', 'I': 'rightMiddle',
    'k': 'rightMiddle', 'K': 'rightMiddle',
    ',': 'rightMiddle', '<': 'rightMiddle',

    // Right ring
    '9': 'rightRing', '(': 'rightRing',
    'o': 'rightRing', 'O': 'rightRing',
    'l': 'rightRing', 'L': 'rightRing',
    '.': 'rightRing', '>': 'rightRing',

    // Right pinky
    '0': 'rightPinky', ')': 'rightPinky',
    '-': 'rightPinky', '_': 'rightPinky',
    '=': 'rightPinky', '+': 'rightPinky',
    'Backspace': 'rightPinky',
    'p': 'rightPinky', 'P': 'rightPinky',
    '[': 'rightPinky', '{': 'rightPinky',
    ']': 'rightPinky', '}': 'rightPinky',
    '\\': 'rightPinky', '|': 'rightPinky',
    ';': 'rightPinky', ':': 'rightPinky',
    "'": 'rightPinky', '"': 'rightPinky',
    'Enter': 'rightPinky',
    '/': 'rightPinky', '?': 'rightPinky',
    'ShiftRight': 'rightPinky',
    'ControlRight': 'rightPinky'
  };

  return fingerMap[key] || null;
};

const VirtualKeyboard = ({ nextKey, showFingerLayout }) => {
  // Helper function to determine which Shift key to highlight
  const getShiftSide = (letter) => {
    const leftHandKeys = 'qwertasdfgzxcvb1234567';
    return leftHandKeys.includes(letter.toLowerCase()) ? 'ShiftRight' : 'ShiftLeft';
  };

  // Helper function to check if a key should be highlighted
  const shouldHighlight = (keyObj, nextKey) => {
    if (!nextKey) return false;
    
    // Handle space character
    if (nextKey === ' ' && keyObj.key === 'Space') return true;
    
    // Direct match (case insensitive)
    if (keyObj.key.toLowerCase() === nextKey.toLowerCase()) return true;
    
    // Check if shift should be highlighted for capitals or special chars
    if (keyObj.key === 'ShiftLeft' || keyObj.key === 'ShiftRight') {
      // For capital letters
      if (nextKey === nextKey.toUpperCase() && nextKey !== nextKey.toLowerCase()) {
        return keyObj.key === getShiftSide(nextKey);
      }
      // For special characters that need shift
      if (keyObj.shiftChar && keyObj.shiftChar === nextKey) {
        return keyObj.key === getShiftSide(keyObj.key);
      }
    }

    return false;
  };

  // Split display into primary and secondary characters
  const splitDisplay = (display) => {
    if (!display.includes(' ')) return { primary: display, secondary: '' };
    const [first, second] = display.split(' ');
    return { primary: first, secondary: second };
  };

  const keyboardLayout = [
    // Numbers row
    [
      { key: '`', display: '~\n`', shiftChar: '~' },
      { key: '1', display: '!\n1', shiftChar: '!' },
      { key: '2', display: '@\n2', shiftChar: '@' },
      { key: '3', display: '#\n3', shiftChar: '#' },
      { key: '4', display: '$\n4', shiftChar: '$' },
      { key: '5', display: '%\n5', shiftChar: '%' },
      { key: '6', display: '^\n6', shiftChar: '^' },
      { key: '7', display: '&\n7', shiftChar: '&' },
      { key: '8', display: '*\n8', shiftChar: '*' },
      { key: '9', display: '(\n9', shiftChar: '(' },
      { key: '0', display: ')\n0', shiftChar: ')' },
      { key: '-', display: '_\n-', shiftChar: '_' },
      { key: '=', display: '+\n=', shiftChar: '+' },
      { key: 'Backspace', display: '⌫', wide: true }
    ],
    // QWERTY row
    [
      { key: 'Tab', display: 'Tab\n⇥', wide: true },
      { key: 'q', display: 'Q' },
      { key: 'w', display: 'W' },
      { key: 'e', display: 'E' },
      { key: 'r', display: 'R' },
      { key: 't', display: 'T' },
      { key: 'y', display: 'Y' },
      { key: 'u', display: 'U' },
      { key: 'i', display: 'I' },
      { key: 'o', display: 'O' },
      { key: 'p', display: 'P' },
      { key: '[', display: '{\n[', shiftChar: '{' },
      { key: ']', display: '}\n]', shiftChar: '}' },
      { key: '\\', display: '|\n\\', shiftChar: '|', wide: true }
    ],
    // Home row
    [
      { key: 'CapsLock', display: 'CapsLock\n⇪', wide: true },
      { key: 'a', display: 'A' },
      { key: 's', display: 'S' },
      { key: 'd', display: 'D' },
      { key: 'f', display: 'F' },
      { key: 'g', display: 'G' },
      { key: 'h', display: 'H' },
      { key: 'j', display: 'J' },
      { key: 'k', display: 'K' },
      { key: 'l', display: 'L' },
      { key: ';', display: ':\n;', shiftChar: ':' },
      { key: "'", display: '"\n\'', shiftChar: '"' },
      { key: 'Enter', display: 'Enter\n⏎', wide: true }
    ],
    // Shift row
    [
      { key: 'ShiftLeft', display: 'Shift\n⇧', wide: true },
      { key: 'z', display: 'Z' },
      { key: 'x', display: 'X' },
      { key: 'c', display: 'C' },
      { key: 'v', display: 'V' },
      { key: 'b', display: 'B' },
      { key: 'n', display: 'N' },
      { key: 'm', display: 'M' },
      { key: ',', display: '<\n,', shiftChar: '<' },
      { key: '.', display: '>\n.', shiftChar: '>' },
      { key: '/', display: '?\n/', shiftChar: '?' },
      { key: 'ShiftRight', display: 'Shift\n⇧', wide: true }
    ],
    // Bottom row
    [
      { key: 'ControlLeft', display: 'Ctrl', wide: true },
      { key: 'WindowLeft', display: '⊞', wide: false },
      { key: 'AltLeft', display: 'Alt', wide: false },
      { key: 'Space', display: ' ', extraWide: true },
      { key: 'AltRight', display: 'Alt', wide: false },
      { key: 'WindowRight', display: '⊞', wide: false },
      { key: 'ControlRight', display: 'Ctrl', wide: true }
    ]
  ];

  return (
    <div className={styles.keyboard}>
      {keyboardLayout.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.keyboardRow}>
          {row.map((keyObj) => {
            const { primary, secondary } = splitDisplay(keyObj.display);
            const finger = getFingerForKey(keyObj.key);
            const fingerColor = showFingerLayout && finger ? fingerColors[finger] : undefined;
            
            return (
              <div
                key={keyObj.key}
                className={`${styles.key} 
                  ${keyObj.wide ? styles.wideKey : ''} 
                  ${keyObj.extraWide ? styles.spaceKey : ''} 
                  ${shouldHighlight(keyObj, nextKey) ? styles.highlight : ''}`}
                style={fingerColor ? { backgroundColor: fingerColor } : undefined}
              >
                {primary.includes('\n') ? (
                  <div className={styles.dualChar}>
                    {primary.split('\n').map((char, i) => (
                      <span key={i} className={i === 0 ? styles.topChar : styles.bottomChar}>
                        {char}
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className={styles.singleChar}>{primary}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard; 