import Features from "../components/Home/Features";
import Logo from "../components/Logo";
import Hero from "../components/Home/Hero";

function Home() {
  return (
    <div className="min-h-screen bg-[#E0E0E0] flex flex-col">
      <Logo />

      <Hero />

      <Features />
    </div>
  );
}

export default Home;