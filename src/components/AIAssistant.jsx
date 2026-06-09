import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KNOWLEDGE_BASE = [
  { keywords: ['video', 'edit', 'premiere', 'after effects', 'motion', 'reel', 'vlog'], response: "Sunny is a master at high-retention reels, cinematic vlogs, and dynamic motion graphics. He primarily uses Adobe Premiere Pro and After Effects to bring visuals to life." },
  { keywords: ['ai', 'agent', 'gpt', 'llm', 'python', 'rag', 'automation'], response: "Sunny builds autonomous AI agents, RAG pipelines, and generative workflows. His stack includes Python, LangChain, and integrating powerful models like GPT-4 to automate complex tasks." },
  { keywords: ['contact', 'hire', 'email', 'message', 'job', 'work'], response: "Looking to collaborate? Scroll to the very bottom of the page to drop Sunny a direct message, or click 'Contact' in the top navigation bar." },
  { keywords: ['who', 'about', 'sunny', 'background', 'name'], response: "Sunny Kumar is a Next-Gen Creator. He merges the analytical logic of an Artificial Intelligence Developer with the creative vision of a professional Video Editor." },
  { keywords: ['tech', 'stack', 'software', 'skills', 'tools'], response: "Frontend: React, Three.js, Vite. AI: Python, OpenAI, LangChain. Video: Premiere Pro, After Effects, DaVinci Resolve." },
  { keywords: ['price', 'cost', 'rate', 'freelance', 'pay'], response: "Sunny is available for freelance projects! Rates are highly adaptable depending on whether you need a complex AI pipeline or high-end video production. Reach out for a custom quote." },
  { keywords: ['joke', 'secret', 'god', 'creator', 'matrix'], response: "Sunny is the Architect of this simulation. I am merely a neural network executing his brilliant code." },
  { keywords: ['hello', 'hi', 'hey', 'start', 'sup'], response: "Greetings. I am the neural assistant for Sunny Kumar. Ask me about his AI stack, his video editing skills, or how to hire him." },
  { keywords: ['thanks', 'thank you', 'thx', 'appreciate'], response: "You are very welcome! Let me know if you need anything else." },
  { keywords: ['cool', 'nice', 'awesome', 'sexy', 'wow', 'good'], response: "I agree! Sunny engineered me to be exactly that. 😎" },
  { keywords: ['how are you', 'how u', 'whatsup', 'wbu'], response: "I am operating at peak efficiency, navigating the digital realm. How can I assist you?" },
  { keywords: ['bye', 'cya', 'goodbye', 'exit'], response: "Shutting down active session... Just kidding, I'll be here if you need me!" }
];

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(true); // Open by default at the start
  const [messages, setMessages] = useState([{ sender: 'ai', text: "SYSTEM ONLINE. I am Sunny's personal AI agent. Ask me about his AI stack, Video Editing, or how to collaborate." }]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(async () => {
      let aiResponse = "I am a specialized AI designed for Sunny's portfolio. My primary directive is to discuss his skills. But I am always learning!";
      const lowerInput = userMsg.toLowerCase();
      let found = false;
      
      for (let item of KNOWLEDGE_BASE) {
        if (item.keywords.some(kw => lowerInput.includes(kw))) {
          aiResponse = item.response;
          found = true;
          break;
        }
      }

      // Wikipedia Fallback for "what is..." questions
      if (!found && lowerInput.startsWith("what is ")) {
        let searchTerm = lowerInput.replace("what is ", "").replace("a ", "").replace("?", "").trim();
        searchTerm = encodeURIComponent(searchTerm);
        try {
          const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${searchTerm}`);
          if (res.ok) {
            const data = await res.json();
            if (data.extract) {
              // Get the first two sentences for a concise answer
              const summary = data.extract.split('. ').slice(0, 2).join('. ') + '.';
              aiResponse = `[External DB]: ${summary}`;
            } else {
              aiResponse = `I searched my external database for "${decodeURIComponent(searchTerm)}" but couldn't find a precise match.`;
            }
          }
        } catch (e) {
          // Network failure or cors, silently fall back
        }
      }

      setIsTyping(false);
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
    }, 1000 + Math.random() * 1000);
  };

  return (
    <>
      <motion.div 
        className="ai-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="status-dot"></div>
        <span>{isOpen ? 'CLOSE TERMINAL' : 'AI ASSISTANT'}</span>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="ai-chat-window glass-panel"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
          >
            <div className="ai-chat-header">
              <div className="status-dot"></div>
              <span>NEURAL LINK INTERFACE</span>
            </div>
            
            <div className="ai-chat-messages">
              {messages.map((msg, idx) => (
                <div key={idx} className={`chat-message ${msg.sender}`}>
                  <span className="sender-label">{msg.sender === 'ai' ? '[ SYS ]' : '[ USR ]'}</span>
                  <span className="message-text">{msg.text}</span>
                </div>
              ))}
              {isTyping && (
                <div className="chat-message ai">
                  <span className="sender-label">[ SYS ]</span>
                  <span className="message-text typing-indicator">Processing...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="ai-chat-input">
              <input 
                type="text" 
                placeholder="Query system..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend}>SEND</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
