import { useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '../config/firebase';

function AuthModal({ open, mode, onClose, onModeChange }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const isSignup = mode === 'signup';

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose();
    } catch (submitError) {
      setError(submitError.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
      onClose();
    } catch (googleError) {
      setError(googleError.message);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>{isSignup ? 'Create your account' : 'Welcome back'}</h2>
        <p className="muted">Your mental wellness companion is ready when you are.</p>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="row">
              <input
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              <input
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          )}
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            minLength={6}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error-text">{error}</p>}
          <button type="submit" className="primary-btn">
            {isSignup ? 'Sign up' : 'Sign in'}
          </button>
        </form>

        <button type="button" className="secondary-btn" onClick={handleGoogleSignIn}>
          Continue with Google
        </button>

        <div className="switch-auth">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button type="button" className="link-btn" onClick={() => onModeChange(isSignup ? 'signin' : 'signup')}>
            {isSignup ? 'Sign in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;
