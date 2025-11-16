import React from 'react';

interface ProgressProps {
  value: number;
  className?: string;
}

export function Progress({ value, className = '' }: ProgressProps) {
  return (
    <div className={`w-full bg-[#334155] rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className="bg-[#429ebd] h-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}