import styles from './Home.module.css';

function Home({ user, onLogin, onStartChat }) {
  return (
    <section className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brandWrap}>
          <span className={styles.logo}>🫶</span>
          <div>
            <p className={styles.brand}>Manasa Vani</p>
            <p className={styles.tag}>Karna, your gentle companion</p>
          </div>
        </div>
        <button className={styles.loginBtn} onClick={user ? onStartChat : onLogin}>
          {user ? 'Open Chat' : 'Login'}
        </button>
      </header>

      <div className={styles.hero}>
        <div className={styles.copy}>
          <h1>Your personal AI companion for everyday emotional support</h1>
          <p>
            Manasa Vani is here for gentle check-ins, thoughtful reflections, and kind conversations.
          </p>
          <button className={styles.cta} onClick={onStartChat}>Chat with Karna</button>
        </div>

        <div className={styles.mascotCard}>
          <div className={styles.mascot}>🐼</div>
          <h3>Karna</h3>
          <p>Here to listen with calm, non-judgmental support.</p>
        </div>
      </div>
    </section>
  );
}

export default Home;
