import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { ScrollControls } from '@react-three/drei';
import Scene from './components/Scene';
import UI from './components/UI';
import CustomCursor from './components/CustomCursor';
import LoadingScreen from './components/LoadingScreen';
import MatrixRain from './components/MatrixRain';
import DomainSelectorModal from './components/DomainSelectorModal';
import DomainContentModal from './components/DomainContentModal';
import AIAssistant from './components/AIAssistant';
import { useStore } from './store';

function App() {
  const [theme, setTheme] = useState('cyan'); // 'cyan', 'crimson', or 'matrix'
  const isHacked = theme === 'matrix';
  const isMobile = window.innerWidth < 768;
  const activeProject = useStore((state) => state.activeProject);

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
      <LoadingScreen />
      {isHacked && <MatrixRain />}
      <div className={`canvas-container theme-${theme}`}>
        <Canvas dpr={[1, isMobile ? 1 : 1.5]} camera={{ position: [0, 0, 7], fov: 45 }}>
          <color attach="background" args={isHacked ? ['#001100'] : ['#020205']} />
          <React.Suspense fallback={null}>
            <ScrollControls pages={5} damping={0.2}>
              <Scene theme={theme} setTheme={setTheme} isHacked={isHacked} />
            </ScrollControls>
          </React.Suspense>
        </Canvas>
      </div>
      <DomainSelectorModal theme={theme} />
      <DomainContentModal theme={theme} />
      <AIAssistant />
      <CustomCursor theme={theme} isHacked={isHacked} />
    </>
  );
}

export default App;
