import React, { useEffect, useState } from 'react';

export default function CustomCursor({ theme }) {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updatePosition = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      const target = e.target.closest('a, button, input');
      if (target) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  const primaryColor = theme === 'cyan' ? '#00ffff' : '#ff003c';
  const hoverColor = theme === 'cyan' ? '#ff00ff' : '#ffaa00';

  return (
    <>
      <div 
        className={`custom-cursor-dot ${isHovering ? 'hover' : ''}`}
        style={{ 
          left: `${position.x}px`, top: `${position.y}px`, 
          backgroundColor: primaryColor, 
          boxShadow: `0 0 10px ${primaryColor}` 
        }}
      />
      <div 
        className={`custom-cursor-outline ${isHovering ? 'hover' : ''}`}
        style={{ 
          left: `${position.x}px`, top: `${position.y}px`, 
          borderColor: isHovering ? hoverColor : primaryColor, 
          backgroundColor: isHovering ? 'rgba(255,255,255,0.05)' : 'transparent',
          boxShadow: isHovering ? `0 0 15px ${hoverColor}` : 'none'
        }}
      />
    </>
  );
}
