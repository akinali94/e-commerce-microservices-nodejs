import React from 'react';
import '../../styles/global.css';

const PlatformIndicator = ({ platform }) => {
  const platformClass = platform ? `${platform.toLowerCase()}-platform` : 'local';
  
  return (
    <div className={platformClass}>
      <span className="platform-flag">
        {platform || 'local'}
      </span>
    </div>
  );
};

export default PlatformIndicator;