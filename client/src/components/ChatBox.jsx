import { useEffect, useMemo, useRef, useState } from 'react';
import { sendChatMessage } from '../services/chatService';

const languageOptions = [
  { label: 'English', value: 'en-US' },
  { label: 'Hindi', value: 'hi-IN' },
  { label: 'Telugu', value: 'te-IN' },
];

function ChatBox({ user, onRequireAuth }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const [chatHistory, setChatHistory] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const emotionToAsset = useMemo(
    () => ({
      joyful: '/assets/very-happy.svg',
      neutral: '/assets/serene-smile.svg',
      anxious: '/assets/nervous-teeth.svg',
      sad: '/assets/sad.svg',
      angry: '/assets/angry-mad.svg',
      hopeful: '/assets/happy-smile-emoji.svg',
      overwhelmed: '/assets/shocked.svg',
      calm: '/assets/cute-smile.svg',
    }),
    [],
  );

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        transcript += event.results[i][0].transcript;
      }
      setMessage(transcript.trim());
    };

    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [language]);

  const speak = (text) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 1.05;
    utterance.pitch = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = async () => {
    if (!user) return onRequireAuth();
    if (!recognitionRef.current) return;

    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      recognitionRef.current.lang = language;
      recognitionRef.current.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  const handleSend = async () => {
    const trimmed = message.trim();
    if (!trimmed || loading) return;
    if (!user) {
      onRequireAuth();
      return;
    }

    const nextHistory = [...chatHistory, { role: 'user', text: trimmed }];
    setChatHistory(nextHistory);
    setMessage('');
    setLoading(true);

    try {
      const response = await sendChatMessage({
        message: trimmed,
        history: nextHistory.slice(-10),
        language,
      });
      const botMessage = { role: 'assistant', text: response.reply, emotion: response.emotion };
      setChatHistory((prev) => [...prev, botMessage]);
      speak(response.reply);
    } catch (error) {
      setChatHistory((prev) => [
        ...prev,
        { role: 'assistant', text: error.message || 'Something went wrong.', emotion: 'neutral' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="chat-card">
      <div className="row between">
        <h2>Companion Chat</h2>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {languageOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {!user && <p className="muted">Guest mode active. Sign in to enable chat and voice.</p>}

      <div className="chat-log">
        {chatHistory.length === 0 && <p className="muted">Start with: “I’m feeling stressed today.”</p>}
        {chatHistory.map((entry, index) => (
          <div className={`bubble ${entry.role}`} key={`${entry.role}-${index}`}>
            <p>{entry.text}</p>
            {entry.role === 'assistant' && (
              <div className="emotion-tag">
                <span>Emotion: {entry.emotion || 'neutral'}</span>
                <img
                  src={emotionToAsset[entry.emotion] || emotionToAsset.neutral}
                  alt={entry.emotion || 'neutral'}
                  width="24"
                  height="24"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="row">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={!user}
          placeholder={user ? 'Type your message...' : 'Sign in to start chatting'}
        />
        <button type="button" className="secondary-btn" onClick={toggleListening} disabled={!user}>
          {listening ? 'Stop' : 'Voice'}
        </button>
        <button type="button" className="primary-btn" onClick={handleSend} disabled={!user || loading}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </div>
    </section>
  );
}

export default ChatBox;
