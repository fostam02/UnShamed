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

  return (
    <img
      src="/images/logo.png"
      alt="UnShamed Logo"
      className={`${sizeClasses[size]} ${className}`}
      onError={(e) => {
        console.log("Logo fallback to placeholder");
        e.currentTarget.src = "/images/placeholder.svg";
      }}
    />
  );
}