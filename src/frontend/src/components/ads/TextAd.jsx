import React from 'react';

const TextAd = ({ ad }) => {
  if (!ad) return null;
  
  return (
    <div className="container py-3 px-lg-5 py-lg-5">
      <div role="alert">
        <strong>Ad</strong>
        <a href={ad.redirectUrl} rel="nofollow noopener noreferrer" target="_blank">
          {ad.text}
        </a>
      </div>
    </div>
  );
};

export default TextAd;