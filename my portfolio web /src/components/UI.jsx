import React, { useRef } from 'react';
import { useScroll } from '@react-three/drei';

export default function UI({ theme, setTheme, isHacked }) {
  const scroll = useScroll();
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

        <div className="hero-content">
          <button 
            className="theme-switch" 
            onClick={toggleTheme}
            onMouseEnter={playHoverSound}
          >
            {isHacked ? '[ SYSTEM COMPROMISED ]' : '[ SYSTEM OVERRIDE ]'}
          </button>
          
          <div className="scroll-indicator-container">
            <div className="scroll-indicator"></div>
            <span className="scroll-text">SCROLL SEQUENCE INITIATED</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: SHOWCASE (About) */}
      <section className="section align-right">
        <div className="glass-panel profile-card">
          <div className="profile-image-container">
            <img 
              src="/profile.jpg" 
              alt="Sunny" 
              className="profile-image" 
              onError={(e) => {e.target.src = 'https://via.placeholder.com/150/020205/00ffff?text=ADD+PHOTO'}} 
            />
          </div>
          <h2>SUNNY</h2>
          <p>
            Full-Stack Engineer & Interactive Designer specializing in WebGL, 
            building scalable architectures and immersive digital experiences.
          </p>
          <ul className="stats">
            <li><span>Focus</span> <span>Software Engineering</span></li>
            <li><span>Core Tech</span> <span>React, Three.js</span></li>
            <li><span>Status</span> <span className="active">Open to Opportunities</span></li>
          </ul>
        </div>
      </section>

      {/* SECTION 3: TECHNOLOGY */}
      <section className="section align-left">
        <div className="glass-panel info-card large">
          <h2>The Matrix</h2>
          <p>
            Built from scratch. No templates. Just pure code, mathematics, and vision.
          </p>
          <div className="data-row">
            <span>FRAMEWORK</span>
            <span>REACT + VITE</span>
          </div>
          <div className="data-row">
            <span>3D_ENGINE</span>
            <span>THREE.JS + FIBER</span>
          </div>
          <div className="data-row">
            <span>STATUS</span>
            <span>UNSTOPPABLE</span>
          </div>
        </div>
      </section>

      {/* SECTION 4: PROJECTS GALLERY */}
      <section className="section" style={{ alignItems: 'center', paddingTop: '10vh' }}>
        <div className="hero-content" style={{ textAlign: 'center', pointerEvents: 'none' }}>
          <h2 style={{ fontSize: '4rem', marginBottom: '1rem', background: 'var(--text-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            FEATURED WORK
          </h2>
          <p className="subtitle" style={{ maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            A collection of my latest interactive experiments and full-stack web applications.
            Hover over the floating 3D planes to view them.
          </p>
        </div>
      </section>

      {/* SECTION 5: CONTACT */}
      <section className="section" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div className="glass-panel info-card" style={{ width: '500px', maxWidth: '90vw' }}>
          <h2>Initialize Contact</h2>
          <p>Ready to build something incredible? Send a transmission.</p>
          <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert("TRANSMISSION SENT!"); }}>
            <input type="text" placeholder="YOUR DESIGNATION (NAME)" required onMouseEnter={playHoverSound} />
            <input type="email" placeholder="COMM LINK (EMAIL)" required onMouseEnter={playHoverSound} />
            <textarea placeholder="MESSAGE PAYLOAD..." rows="4" required onMouseEnter={playHoverSound}></textarea>
            <button className="primary" type="submit" style={{ width: '100%', marginTop: '1rem' }} onClick={playClickSound} onMouseEnter={playHoverSound}>
              SEND TRANSMISSION
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
