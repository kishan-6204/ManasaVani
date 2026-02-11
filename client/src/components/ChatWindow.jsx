import { useMemo, useRef, useState } from 'react';
import { sendChatMessage } from '../services/chatService';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import styles from './ChatWindow.module.css';

function ChatWindow({ user, messages, onMessagesChange, onRequireAuth }) {
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const recognitionRef = useRef(null);

  const emotionEmoji = useMemo(
    () => ({ joyful: '😊', neutral: '😌', anxious: '😟', sad: '😢', angry: '😠', hopeful: '🙂', overwhelmed: '😵', calm: '🫧' }),
    [],
  );

  const toggleListening = async (setDraft) => {
    if (!user) return onRequireAuth();
    if (!('webkitSpeechRecognition' in window)) return;

    if (!recognitionRef.current) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) text += event.results[i][0].transcript;
        setDraft(text.trim());
      };
      recognition.onend = () => setListening(false);
      recognition.onerror = () => setListening(false);
      recognitionRef.current = recognition;
    }

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

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;
    if (!user) return onRequireAuth();

    const userEntry = { role: 'user', text: text.trim() };
    const nextHistory = [...messages, userEntry];
    onMessagesChange(nextHistory);
    setLoading(true);

    try {
      const response = await sendChatMessage({ message: userEntry.text, history: nextHistory.slice(-10), language });
      onMessagesChange([
        ...nextHistory,
        { role: 'assistant', text: response.reply, emotion: response.emotion || 'neutral' },
      ]);
    } catch (error) {
      onMessagesChange([...nextHistory, { role: 'assistant', text: error.message, emotion: 'neutral' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.shell}>
      <div className={styles.content}>
        <div className={styles.greeting}>Hi there! How can I help you today?</div>

        {messages.map((message, index) => (
          <MessageBubble key={`${message.role}-${index}`} message={message} emotionBadge={emotionEmoji[message.emotion]} />
        ))}
      </div>

      <ChatInput
        canSend={Boolean(user)}
        loading={loading}
        listening={listening}
        onSend={sendMessage}
        onRequireAuth={onRequireAuth}
        onVoiceToggle={toggleListening}
        language={language}
        setLanguage={setLanguage}
      />
    </section>
  );
}

export default ChatWindow;
