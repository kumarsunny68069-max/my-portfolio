import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';

export default function DomainSelectorModal({ theme }) {
  const isOpen = useStore((state) => state.isDomainSelectorOpen);
  const activeDomain = useStore((state) => state.activeDomain);
  const setDomainSelectorOpen = useStore((state) => state.setDomainSelectorOpen);
  const setActiveDomain = useStore((state) => state.setActiveDomain);
  const setDomainWorldPosition = useStore((state) => state.setDomainWorldPosition);

  const closeAll = () => {
    setDomainSelectorOpen(false);
    setActiveDomain(null);
    setDomainWorldPosition(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.5 }}
          className={`project-modal-overlay theme-${theme}`}
        >
          <motion.div
            initial={{ scale: 0.9, y: 100, opacity: 0 }}
            animate={{ 
               scale: activeDomain ? 0.8 : 1, 
               y: activeDomain ? -100 : 0, 
               opacity: activeDomain ? 0 : 1,
               pointerEvents: activeDomain ? 'none' : 'auto'
            }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ duration: activeDomain ? 0.3 : 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="domain-selector-container glass-panel"
          >
             <button className="close-btn" onClick={closeAll}>✕ CLOSE</button>
             
             <div className="split-view">
                <div className="split-pane pane-ai" onClick={() => setActiveDomain('ai')}>
                   <h2>AI & AUTOMATION</h2>
                   <p>Generative AI, Custom GPTs, Python, Autonomous Agents.</p>
                   <button className="theme-switch" style={{fontSize: '0.8rem'}}>VIEW AI PROJECTS</button>
                </div>
                <div className="split-divider"></div>
                <div className="split-pane pane-video" onClick={() => setActiveDomain('video')}>
                   <h2>VIDEO EDITING & MOTION</h2>
                   <p>Premiere Pro, After Effects, DaVinci Resolve workflows.</p>
                   <button className="theme-switch" style={{fontSize: '0.8rem'}}>VIEW VIDEO REELS</button>
                </div>
             </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
