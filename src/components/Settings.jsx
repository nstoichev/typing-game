import React from 'react';
import SourceSelector from './SourceSelector';

const Settings = ({ onSourceChange, currentSource }) => {
  return (
    <div className="settings">
      <h2>Settings</h2>
      <SourceSelector 
        onSourceChange={onSourceChange}
        currentSource={currentSource}
      />
    </div>
  );
};

export default Settings; 