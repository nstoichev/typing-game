import React from 'react';
import styles from './VirtualKeyboard.module.css';

const VirtualKeyboard = ({ nextKey }) => {
  const keyboardLayout = [
    // Numbers row
    [
      { key: '`', display: '`' },
      { key: '1', display: '1' },
      { key: '2', display: '2' },
      { key: '3', display: '3' },
      { key: '4', display: '4' },
      { key: '5', display: '5' },
      { key: '6', display: '6' },
      { key: '7', display: '7' },
      { key: '8', display: '8' },
      { key: '9', display: '9' },
      { key: '0', display: '0' },
      { key: '-', display: '-' },
      { key: '=', display: '=' },
      { key: 'Backspace', display: '⌫', wide: true }
    ],
    // QWERTY row
    [
      { key: 'Tab', display: '⇥', wide: true },
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
      { key: '[', display: '[' },
      { key: ']', display: ']' },
      { key: '\\', display: '\\' }
    ],
    // Home row
    [
      { key: 'CapsLock', display: '⇪', wide: true },
      { key: 'a', display: 'A' },
      { key: 's', display: 'S' },
      { key: 'd', display: 'D' },
      { key: 'f', display: 'F' },
      { key: 'g', display: 'G' },
      { key: 'h', display: 'H' },
      { key: 'j', display: 'J' },
      { key: 'k', display: 'K' },
      { key: 'l', display: 'L' },
      { key: ';', display: ';' },
      { key: "'", display: "'" },
      { key: 'Enter', display: '⏎', wide: true }
    ],
    // Shift row
    [
      { key: 'ShiftLeft', display: '⇧', wide: true },
      { key: 'z', display: 'Z' },
      { key: 'x', display: 'X' },
      { key: 'c', display: 'C' },
      { key: 'v', display: 'V' },
      { key: 'b', display: 'B' },
      { key: 'n', display: 'N' },
      { key: 'm', display: 'M' },
      { key: ',', display: ',' },
      { key: '.', display: '.' },
      { key: '/', display: '/' },
      { key: 'ShiftRight', display: '⇧', wide: true }
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
          {row.map((keyObj) => (
            <div
              key={keyObj.key}
              className={`${styles.key} 
                ${keyObj.wide ? styles.wideKey : ''} 
                ${keyObj.extraWide ? styles.spaceKey : ''} 
                ${keyObj.key.toLowerCase() === nextKey.toLowerCase() ? styles.highlight : ''}`}
            >
              {keyObj.display}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default VirtualKeyboard; 