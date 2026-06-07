import React, { useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

export default function LoadingScreen() {
  const { progress, active } = useProgress();
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (!active && progress === 100) {
      const timeout = setTimeout(() => setShow(false), 800); // 800ms delay to let scene render fully
      return () => clearTimeout(timeout);
    }
  }, [active, progress]);

  if (!show) return null;

  return (
    <div className={`loading-screen ${!active && progress === 100 ? 'fade-out' : ''}`}>
      <div className="loading-content">
        <h1 className="loading-logo">SUNNY.DEV</h1>
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="loading-text">INITIALIZING SCENE... {Math.round(progress)}%</p>
      </div>
    </div>
  );
}
