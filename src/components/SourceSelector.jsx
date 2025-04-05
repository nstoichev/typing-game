import React from 'react';

const SourceSelector = ({ onSourceChange, currentSource }) => {
  const sources = [
    { id: 'random', label: 'Random Text' },
    { id: 'wikipedia', label: 'Wikipedia' }
  ];

  return (
    <div className="source-selector">
      <h3>Text Source</h3>
      <div className="radio-group">
        {sources.map(source => (
          <label key={source.id} className="radio-label">
            <input
              type="radio"
              name="textSource"
              value={source.id}
              checked={currentSource === source.id}
              onChange={(e) => onSourceChange(e.target.value)}
            />
            {source.label}
          </label>
        ))}
      </div>
    </div>
  );
};

export default SourceSelector; 