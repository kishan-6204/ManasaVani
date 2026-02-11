import HomeHero from '../components/HomeHero';

function HomePage({ user, onOpenAuth }) {
  return <HomeHero user={user} onOpenAuth={onOpenAuth} />;
}

export default HomePage;
