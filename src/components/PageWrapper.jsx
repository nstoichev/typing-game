import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';
import './PageWrapper.css';

const PageWrapper = ({ children }) => {
  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      backgroundColor: 'var(--accent-color)',
      borderRadius: '3px',
      ...style
    };
    return <div style={thumbStyle} {...props} />;
  };

  return (
    <Scrollbars
      className="page-wrapper"
      renderThumbVertical={renderThumb}
      autoHide
      autoHideTimeout={1000}
      autoHideDuration={200}
    >
      {children}
    </Scrollbars>
  );
};

export default PageWrapper; 