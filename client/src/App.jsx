import { useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import Home from './pages/Home';
import Chat from './pages/Chat';
import AuthModal from './components/AuthModal';

const themes = {
  lavender: {
    '--bg-main': '#f3f1fb',
    '--bg-accent': '#e4ddfa',
    '--bg-surface': '#ffffff',
    '--text-primary': '#282534',
    '--text-muted': '#6f6a82',
  },
  peach: {
    '--bg-main': '#fff5ee',
    '--bg-accent': '#ffe4d4',
    '--bg-surface': '#ffffff',
    '--text-primary': '#332824',
    '--text-muted': '#7a6760',
  },
  mint: {
    '--bg-main': '#edf8f4',
    '--bg-accent': '#d6efe5',
    '--bg-surface': '#ffffff',
    '--text-primary': '#23322f',
    '--text-muted': '#5f7670',
  },
  sky: {
    '--bg-main': '#eef5ff',
    '--bg-accent': '#dfeafe',
    '--bg-surface': '#ffffff',
    '--text-primary': '#233149',
    '--text-muted': '#60708a',
  },
  neutral: {
    '--bg-main': '#f4f4f6',
    '--bg-accent': '#e6e6ea',
    '--bg-surface': '#ffffff',
    '--text-primary': '#2b2b31',
    '--text-muted': '#6d6d78',
  },
};

function App() {
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState('home');
  const [selectedTheme, setSelectedTheme] = useState(localStorage.getItem('mv-theme') || 'lavender');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => setUser(nextUser));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('mv-theme', selectedTheme);
  }, [selectedTheme]);

  const themeStyle = useMemo(() => themes[selectedTheme] || themes.lavender, [selectedTheme]);

  const handleStartChat = () => {
    if (!user) {
      setAuthModalOpen(true);
      return;
    }
    setCurrentView('chat');
  };

  const handleAuthClose = () => {
    setAuthModalOpen(false);
    if (auth.currentUser) {
      setCurrentView('chat');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setCurrentView('home');
  };

  return (
    <main style={themeStyle}>
      {currentView === 'home' ? (
        <Home
          user={user}
          onLogin={() => setAuthModalOpen(true)}
          onStartChat={handleStartChat}
        />
      ) : (
        <Chat
          user={user}
          selectedTheme={selectedTheme}
          onThemeChange={setSelectedTheme}
          onOpenAuth={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          onGoHome={() => setCurrentView('home')}
        />
      )}

      <AuthModal open={authModalOpen} onClose={handleAuthClose} />
    </main>
  );
}

export default App;
