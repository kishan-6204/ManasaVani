import { useState } from 'react';
import styles from './ChatInput.module.css';

const languages = [
  { label: 'English', value: 'en-US' },
  { label: 'Hindi', value: 'hi-IN' },
  { label: 'Telugu', value: 'te-IN' },
];

function ChatInput({ canSend, loading, listening, onSend, onRequireAuth, onVoiceToggle, language, setLanguage }) {
  const [draft, setDraft] = useState('');

  const handleSubmit = () => {
    if (!canSend) return onRequireAuth();
    onSend(draft);
    setDraft('');
  };

  return (
    <div className={styles.wrapper}>
      <select value={language} onChange={(event) => setLanguage(event.target.value)}>
        {languages.map((item) => (
          <option key={item.value} value={item.value}>{item.label}</option>
        ))}
      </select>

      <input
        value={draft}
        disabled={!canSend}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={(event) => event.key === 'Enter' && handleSubmit()}
        placeholder={canSend ? "What's on your mind?" : 'Login to start chatting'}
      />

      <button className={styles.voiceBtn} type="button" onClick={() => onVoiceToggle(setDraft)}>
        {listening ? '◼' : '🎤'}
      </button>
      <button className={styles.sendBtn} type="button" onClick={handleSubmit} disabled={loading || !draft.trim()}>
        {loading ? '...' : '➤'}
      </button>
    </div>
  );
}

export default ChatInput;
