import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import ThemePicker from '../components/ThemePicker';
import styles from './Chat.module.css';

function Chat({ user, selectedTheme, onThemeChange, onOpenAuth, onLogout, onGoHome }) {
  const [messages, setMessages] = useState([]);
  const [themePickerOpen, setThemePickerOpen] = useState(false);

  return (
    <section className={styles.layout}>
      <Sidebar
        user={user}
        onNewChat={() => setMessages([])}
        onOpenAuth={onOpenAuth}
        onLogout={onLogout}
        onToggleTheme={() => setThemePickerOpen((prev) => !prev)}
        onGoHome={onGoHome}
      />

      <ChatWindow
        user={user}
        messages={messages}
        onMessagesChange={setMessages}
        onRequireAuth={onOpenAuth}
      />

      <ThemePicker
        open={themePickerOpen}
        selectedTheme={selectedTheme}
        onSelectTheme={onThemeChange}
        onClose={() => setThemePickerOpen(false)}
      />
    </section>
  );
}

export default Chat;
