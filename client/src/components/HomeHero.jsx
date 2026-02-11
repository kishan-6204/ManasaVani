function HomeHero({ user, onOpenAuth }) {
  return (
    <section className="hero">
      <h1>One safe space for your daily mental wellness check-in.</h1>
      <p>
        Share what you feel, hear a compassionate response, and get a gentle emotion reflection with every reply.
      </p>
      {!user && (
        <div className="row">
          <button className="primary-btn" onClick={() => onOpenAuth('signin')}>Login to chat</button>
          <button className="secondary-btn" onClick={() => onOpenAuth('signup')}>Create account</button>
        </div>
      )}
    </section>
  );
}

export default HomeHero;
