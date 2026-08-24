import React from 'react';

export const ImagePlaceholderBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Deep Navy Slate Background */}
      <div className="absolute inset-0 bg-[#0A101D] opacity-95" />

      {/* Ambient Gradient Blows */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px]" />
      <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[160px]" />
      <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[150px]" />

      {/* Grid line texture */}
      <div 
        className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:24px_24px]"
      />
    </div>
  );
};
