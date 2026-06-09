import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';

export default function ProjectModal({ theme }) {
  const activeProject = useStore((state) => state.activeProject);
  const clearActiveProject = useStore((state) => state.clearActiveProject);

  return (
    <AnimatePresence>
      {activeProject && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(10px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.5 }}
          className={`project-modal-overlay theme-${theme}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="project-modal-container"
          >
            <div className="glass-panel modal-panel">
              <button className="close-btn" onClick={clearActiveProject}>
                ✕ CLOSE
              </button>
              <div className="modal-body">
                <h1 className="modal-title">{activeProject.title}</h1>
                <div className="tech-stack">
                  {activeProject.tech.map((t, i) => (
                    <span key={i} className="tech-badge">{t}</span>
                  ))}
                </div>
                <p className="modal-description">{activeProject.description}</p>
                
                <div className="modal-actions">
                  <button className="primary" onClick={() => window.open(activeProject.link, '_blank')}>
                    LAUNCH PROJECT
                  </button>
                  <button className="secondary" onClick={() => window.open('https://github.com', '_blank')}>
                    VIEW SOURCE
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
