import React, { useRef } from 'react';
import { useScroll } from '@react-three/drei';
import { useStore } from '../store';
import { motion } from 'framer-motion';

export default function UI({ theme, setTheme, isHacked }) {
  const scroll = useScroll();
  const setDomainSelectorOpen = useStore((state) => state.setDomainSelectorOpen);
  const audioCtx = useRef(null);

  const playHoverSound = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.current.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.05, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.1);
  };

  const playClickSound = () => {
    if (!audioCtx.current) {
      audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    const osc = audioCtx.current.createOscillator();
    const gain = audioCtx.current.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, audioCtx.current.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioCtx.current.currentTime + 0.2);
    
    gain.gain.setValueAtTime(0.1, audioCtx.current.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.current.currentTime + 0.2);
    
    osc.connect(gain);
    gain.connect(audioCtx.current.destination);
    
    osc.start();
    osc.stop(audioCtx.current.currentTime + 0.2);
  };

  const toggleTheme = () => {
    playClickSound();
    setTheme(theme === 'cyan' ? 'crimson' : 'cyan');
  };

  const scrollToPage = (pageIndex) => {
    playClickSound();
    if (scroll && scroll.el) {
      scroll.el.scrollTo({
        top: pageIndex * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`ui-wrapper theme-${theme}`}>
      {/* SECTION 1: HOME */}
      <section className="section">
        <header>
          <div className="logo" style={{ cursor: 'pointer' }} onClick={() => scrollToPage(0)}>SUNNY.DEV</div>
          <nav>
            <div className="nav-links">
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToPage(1); }} onMouseEnter={playHoverSound}>About</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToPage(3); }} onMouseEnter={playHoverSound}>Projects</a>
              <a href="#" onClick={(e) => { e.preventDefault(); scrollToPage(4); }} onMouseEnter={playHoverSound}>Contact</a>
            </div>
          </nav>
        </header>

        <div className="hero-content" style={{ textAlign: 'center', pointerEvents: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '10vh' }}>
          <motion.div 
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 1, delay: 0.5 }}
             style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
          >
             <div style={{ width: '8px', height: '8px', background: 'var(--theme-primary)', borderRadius: '50%', animation: 'pulseLogo 2s infinite alternate' }}></div>
             <span style={{ fontSize: '0.8rem', letterSpacing: '5px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>System Online</span>
          </motion.div>
          
          <h1 style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', fontWeight: '900', lineHeight: '0.85', margin: '0 0 2rem 0', letterSpacing: '-5px', background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(255,255,255,0.1))' }}>
            SUNNY<br/>KUMAR
          </h1>
          
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
            <p className="subtitle" style={{ letterSpacing: '8px', fontSize: '1.1rem', margin: 0, color: 'white' }}>AI DEVELOPER</p>
            <div style={{ width: '6px', height: '6px', background: 'var(--theme-primary)', borderRadius: '50%', boxShadow: '0 0 15px var(--theme-primary)' }}></div>
            <p className="subtitle" style={{ letterSpacing: '8px', fontSize: '1.1rem', margin: 0, color: 'white' }}>VIDEO EDITOR</p>
          </div>
          
          <div className="theme-switcher" style={{ display: 'flex', gap: '1rem', pointerEvents: 'auto' }}>
            <button className="theme-switch" onClick={() => setTheme('cyan')}>CYAN</button>
            <button className="theme-switch" onClick={() => setTheme('crimson')}>CRIMSON</button>
            <button className="theme-switch" onClick={() => setTheme('matrix')}>MATRIX</button>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT THE DEVELOPER */}
      <section className="section about-section">
        <div className="about-grid">
           {/* LEFT: Identity Card */}
           <div className="identity-card glass-panel">
              <div className="id-header">
                 <span className="badge">VERIFIED CREATOR</span>
                 <span className="status-dot"></span>
              </div>
              <div className="profile-image-container glitch-hover">
                <img 
                  src="/profile.jpg" 
                  alt="Sunny Kumar" 
                  className="profile-image" 
                  onError={(e) => {e.target.src = 'https://via.placeholder.com/200/020205/00ffff?text=ADD+PHOTO'}} 
                />
              </div>
              <h2 className="id-name">SUNNY KUMAR</h2>
              <p className="id-title" style={{ fontSize: '1rem', color: 'var(--theme-primary)' }}>AI Developer × Video Editor</p>
              
              <div className="id-bio">
                 <p>"I merge artificial intelligence with cinematic storytelling. Specializing in AI-driven workflows, generative content, and high-end video production to build next-generation visual experiences."</p>
              </div>

              <div className="id-actions">
                 <button className="theme-switch" style={{flex: 1, fontSize: '0.8rem', padding: '1rem'}} onClick={(e) => { playClickSound(); window.open('https://github.com', '_blank'); }} onMouseEnter={playHoverSound}>GITHUB</button>
                 <button className="theme-switch" style={{flex: 1, fontSize: '0.8rem', padding: '1rem'}} onClick={(e) => { playClickSound(); window.open('https://youtube.com', '_blank'); }} onMouseEnter={playHoverSound}>YOUTUBE</button>
              </div>
           </div>

           {/* RIGHT: Timeline & Skills */}
           <div className="experience-panel">
              <div className="glass-panel timeline-card">
                 <h3>JOURNEY TIMELINE</h3>
                 <div className="timeline">
                    <div className="timeline-item">
                       <div className="timeline-dot"></div>
                       <div className="timeline-content">
                          <h4>2024 - Present</h4>
                          <h5>AI Integration & Generative Workflows</h5>
                          <p>Building automated video pipelines, AI-generated assets (Midjourney/Runway), and intelligent chatbots.</p>
                       </div>
                    </div>
                    <div className="timeline-item">
                       <div className="timeline-dot"></div>
                       <div className="timeline-content">
                          <h4>2022 - 2024</h4>
                          <h5>Professional Video Editing</h5>
                          <p>Crafting high-retention reels, cinematic vlogs, and motion graphics for various clients.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="glass-panel skills-card">
                 <h3>TECHNICAL ARSENAL</h3>
                 <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="skill-category">
                       <h4>AI & AUTOMATION</h4>
                       <div className="tags">
                          <span>LLMs</span><span>Generative AI</span><span>Python</span><span>RAG</span>
                       </div>
                    </div>
                    <div className="skill-category">
                       <h4>VIDEO EDITING</h4>
                       <div className="tags">
                          <span>Premiere Pro</span><span>After Effects</span><span>DaVinci</span><span>CapCut</span>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* SECTION 4: PROJECTS GALLERY */}
      <section className="section" style={{ alignItems: 'center', justifyContent: 'center', paddingTop: '10vh' }}>
        <div style={{ textAlign: 'center', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>
          <h2 style={{ fontSize: '4rem', marginBottom: '1rem', background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FEATURED WORK
          </h2>
          <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto 2rem auto', color: 'rgba(255,255,255,0.8)' }}>
            A dual-collection of AI Automation and Video Production.
          </p>
          <p style={{ marginTop: '0', fontSize: '0.9rem', color: 'var(--theme-primary)', letterSpacing: '3px', textTransform: 'uppercase', animation: 'pulseLogo 2s infinite alternate' }}>
            [ SCROLL DOWN TO AUTO-DIVE ]
          </p>
        </div>
      </section>

      {/* SECTION 5: CONTACT */}
      <section className="section" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel info-card" style={{ width: '500px', maxWidth: '90vw' }}>
          <h2>Get in Touch</h2>
          <p>Available for freelance opportunities and full-time roles.</p>
          <div className="contact-form glass-panel" onClick={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()}>
            <h2>Let's Collaborate</h2>
            <p>Looking for a developer or editor? Drop a message.</p>
            <input type="text" placeholder="Your Name" />
            <input type="email" placeholder="Your Email" />
            <textarea placeholder="Tell me about your project..." rows="4"></textarea>
            <button className="theme-switch" style={{ width: '100%', marginTop: '1rem' }} onClick={(e) => { e.stopPropagation(); playClickSound(); }} onMouseEnter={playHoverSound}>
              SEND MESSAGE
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
