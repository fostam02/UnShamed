import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  };

  const [imgSrc, setImgSrc] = React.useState('/images/logo.png');
  const [hasError, setHasError] = React.useState(false);

  const handleError = () => {
    console.log("Logo fallback to placeholder");
    setImgSrc('/images/placeholder.svg');
    setHasError(true);
  };

  return (
    <img
      src={imgSrc}
      alt="UnShamed Logo"
      className={`${sizeClasses[size]} ${className} ${hasError ? 'rounded-full' : ''}`}
      onError={handleError}
    />
  );
}