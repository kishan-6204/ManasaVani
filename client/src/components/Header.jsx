function Header({ user, onOpenAuth, onLogout }) {
  return (
    <header className="header">
      <div>
        <p className="brand">Manasa Vani</p>
        <p className="muted">Your calm AI companion</p>
      </div>
      <div className="row compact">
        {user ? (
          <>
            <span className="pill">Signed in</span>
            <button className="secondary-btn" onClick={onLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="secondary-btn" onClick={() => onOpenAuth('signin')}>Login</button>
            <button className="primary-btn" onClick={() => onOpenAuth('signup')}>Sign Up</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
