import React, { useState, useRef } from 'react';
import { FiMessageCircle } from 'react-icons/fi';

interface ChatbotProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}
const Chatbot: React.FC<ChatbotProps> = ({ open, setOpen }) => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I am RefactorLens AI Chatbot. Ask me anything about this platform.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Dummy sendMessage for now (should be replaced with actual logic)
  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    setInput('');
    // Add bot response logic here
  };

  return (
    <div>
      {!open && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 1000 }}>
          <button
            style={{
              padding: 0,
              borderRadius: '50%',
              background: '#1976d2',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              width: 56,
              height: 56,
              boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#1565c0')}
            onMouseLeave={e => (e.currentTarget.style.background = '#1976d2')}
            onClick={() => setOpen(true)}
            aria-label="Open chatbot"
          >
            <span>{FiMessageCircle({ size: 32, style: { verticalAlign: 'middle' } })}</span>
          </button>
        </div>
      )}
      {open && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: 400,
            height: '100vh',
            background: 'linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)',
            borderLeft: '2px solid #90caf9',
            boxShadow: '-4px 0 24px rgba(25,118,210,0.12)',
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column',
            color: '#222',
            userSelect: 'none',
            transition: 'all 0.3s cubic-bezier(.4,0,.2,1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 18px 0 18px' }}>
            <span style={{ fontWeight: 700, fontSize: 18, color: '#1976d2', letterSpacing: 1 }}>RefactorLens Chat</span>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: '#1976d2', fontSize: 20, fontWeight: 700, cursor: 'pointer' }}
              title="Close"
            >✕</button>
          </div>
          <div style={{ flex: 1, maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', margin: '18px', background: '#fff', borderRadius: 12, padding: 8, border: '1px solid #e3e3e3' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ textAlign: msg.sender === 'bot' ? 'left' : 'right', margin: '8px 0' }}>
                <span style={{
                  background: msg.sender === 'bot' ? '#fff' : '#222',
                  color: msg.sender === 'bot' ? '#222' : '#fff',
                  padding: '10px 18px',
                  borderRadius: 16,
                  fontSize: 15,
                  boxShadow: msg.sender === 'bot' ? '0 2px 8px #eee' : '0 2px 8px #111',
                  border: msg.sender === 'bot' ? '1px solid #e3e3e3' : '1px solid #222',
                  display: 'inline-block',
                  maxWidth: '80%',
                  wordBreak: 'break-word',
                }}>{msg.text}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 18px 18px 18px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' ? sendMessage() : undefined}
              placeholder="Type your question..."
              style={{ flex: 1, padding: 10, borderRadius: 10, border: '1px solid #90caf9', fontSize: 15, background: '#f7fafd', color: '#222' }}
              disabled={loading}
            />
            <button onClick={sendMessage} disabled={loading} style={{ padding: '10px 18px', borderRadius: 10, background: '#1976d2', color: '#fff', border: 'none', fontWeight: 500, fontSize: 15, transition: 'background 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#1565c0')}
              onMouseLeave={e => (e.currentTarget.style.background = '#1976d2')}
            >Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
