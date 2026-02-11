import styles from './Sidebar.module.css';

function Sidebar({ user, onNewChat, onOpenAuth, onLogout, onToggleTheme, onGoHome }) {
  const isAuthed = Boolean(user);
  const name = isAuthed ? user.displayName || user.email : 'Guest User';

  return (
    <aside className={styles.sidebar}>
      <button className={styles.brand} onClick={onGoHome}>
        <span>🐼</span>
        <div>
          <strong>Karna</strong>
          <p>Manasa Vani</p>
        </div>
      </button>

      <button className={styles.newChat} onClick={onNewChat}>New Chat</button>

      <div className={styles.menu}>
        <button onClick={isAuthed ? onLogout : onOpenAuth}>{isAuthed ? 'Logout' : 'Login'}</button>
        <button onClick={onToggleTheme}>Change Background</button>
      </div>

      <div className={styles.userCard}>
        <div className={styles.avatar}>{name[0]?.toUpperCase() || 'U'}</div>
        <div>
          <p>{name}</p>
          <span>{isAuthed ? 'Signed in' : 'Guest'}</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
