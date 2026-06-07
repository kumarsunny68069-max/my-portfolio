import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import Scene from './components/Scene';
import LoadingScreen from './components/LoadingScreen';
import CustomCursor from './components/CustomCursor';
import MatrixRain from './components/MatrixRain';

function App() {
  const [theme, setTheme] = useState('cyan'); // 'cyan', 'crimson', or 'matrix'
  const [isHacked, setIsHacked] = useState(false);

  useEffect(() => {
    let keyBuffer = '';
    const secretCode = 'HACK';

    const handleKeyDown = (e) => {
      // Ignore keys if modifying
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      
      keyBuffer += e.key.toUpperCase();
      if (keyBuffer.length > secretCode.length) {
        keyBuffer = keyBuffer.slice(-secretCode.length);
      }
      
      if (keyBuffer === secretCode && !isHacked) {
        setIsHacked(true);
        setTheme('matrix');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHacked]);

  return (
    <>
      <CustomCursor theme={theme} />
      <LoadingScreen />
      {isHacked && <MatrixRain />}
      
      <div className={`canvas-container theme-${theme}`}>
        <Canvas camera={{ position: [0, 0, 7], fov: 45 }}>
          <color attach="background" args={['#020205']} />
          <Suspense fallback={null}>
            <ScrollControls pages={5} damping={0.2}>
              <Scene theme={theme} setTheme={setTheme} isHacked={isHacked} />
            </ScrollControls>
          </Suspense>
        </Canvas>
      </div>
    </>
  );
}

export default App;
