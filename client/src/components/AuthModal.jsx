import { useState } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import styles from './AuthModal.module.css';

function AuthModal({ open, onClose }) {
  const [emailMode, setEmailMode] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const submitEmail = async (event) => {
    event.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const continueWithGoogle = async () => {
    setError('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      onClose();
    } catch (googleError) {
      setError(googleError.message);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <section className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>×</button>
        <div className={styles.mascot}>🐼</div>
        <p className={styles.text}>Don’t lose your conversations! Let’s create a profile.</p>

        <button className={styles.googleBtn} onClick={continueWithGoogle}>Continue with Google</button>
        <button className={styles.emailBtn} onClick={() => setEmailMode((prev) => !prev)}>
          Continue with Email
        </button>

        {emailMode && (
          <form className={styles.form} onSubmit={submitEmail}>
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required placeholder="Email" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required minLength={6} placeholder="Password" />
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit">{isSignUp ? 'Create Account' : 'Continue'}</button>
            <button type="button" className={styles.toggleMode} onClick={() => setIsSignUp((prev) => !prev)}>
              {isSignUp ? 'Already have an account? Sign in' : "New here? Create an account"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

export default AuthModal;
