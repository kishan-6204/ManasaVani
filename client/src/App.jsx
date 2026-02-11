import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './config/firebase';
import Header from './components/Header';
import AuthModal from './components/AuthModal';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';

function App() {
  const [user, setUser] = useState(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signin');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => setUser(nextUser));
    return () => unsubscribe();
  }, []);

  const openAuth = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <main className="app-shell">
      <Header user={user} onOpenAuth={openAuth} onLogout={() => signOut(auth)} />
      <HomePage user={user} onOpenAuth={openAuth} />
      <ChatPage user={user} onRequireAuth={() => openAuth('signin')} />
      <AuthModal
        open={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onModeChange={setAuthMode}
      />
    </main>
  );
}

export default App;
