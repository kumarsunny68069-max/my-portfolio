import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store';

const DOMAIN_DATA = {
  video: {
    title: "VIDEO EDITING & MOTION",
    description: "I craft compelling visual narratives. From fast-paced social media reels to cinematic documentaries, I bring stories to life through precise editing and motion graphics.",
    items: [
       { title: "Cinematic Travel Vlog", tech: "Premiere Pro, Color Grading" },
       { title: "Tech Product Ad", tech: "After Effects, Motion Graphics" },
       { title: "High-Retention Reels", tech: "CapCut, DaVinci Resolve" }
    ]
  },
  ai: {
    title: "AI & AUTOMATION",
    description: "I build intelligent systems and automate complex workflows. By integrating Large Language Models and custom agents, I create software that thinks.",
    items: [
       { title: "Autonomous Research Agent", tech: "Python, LangChain, OpenAI" },
       { title: "Customer Support Chatbot", tech: "Next.js, Pinecone, RAG" },
       { title: "Video Generation Pipeline", tech: "ComfyUI, Stable Diffusion" }
    ]
  }
};

export default function DomainContentModal({ theme }) {
  const activeDomain = useStore((state) => state.activeDomain);
  const setActiveDomain = useStore((state) => state.setActiveDomain);

  const data = activeDomain ? DOMAIN_DATA[activeDomain] : null;

  return (
    <AnimatePresence>
      {activeDomain && (
        <motion.div
          initial={{ opacity: 0, y: '100vh' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100vh' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`project-modal-overlay layer-2 theme-${theme}`}
        >
          <div className="domain-content-container glass-panel">
            <button className="close-btn" onClick={() => setActiveDomain(null)}>
              ← BACK TO SELECTOR
            </button>
            <div className="modal-body">
              <h1 className="modal-title">{data.title}</h1>
              <p className="modal-description">{data.description}</p>
              
              <div className="portfolio-grid">
                 {data.items.map((item, i) => (
                    <div key={i} className="portfolio-card">
                       <h3>{item.title}</h3>
                       <span className="tech-badge">{item.tech}</span>
                    </div>
                 ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
