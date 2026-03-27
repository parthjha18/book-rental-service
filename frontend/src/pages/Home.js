import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LandingHero } from '../components/LandingHero';

const features = [
  {
    icon: '📚',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10 border-orange-500/20',
    title: 'Share Books',
    desc: 'List your books and earn passive income while helping others discover great reads in your community.',
  },
  {
    icon: '📍',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10 border-blue-500/20',
    title: 'Find Nearby',
    desc: 'Discover books available within kilometers of your location using our smart location-based search.',
  },
  {
    icon: '💸',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/20',
    title: 'Affordable Rental',
    desc: 'Rent books at just ₹40/week with a secure payment system and fully refundable deposit.',
  },
];

const steps = [
  { num: '01', title: 'Register', desc: 'Create your account and share your location' },
  { num: '02', title: 'Browse', desc: 'Find books nearby or list your own collection' },
  { num: '03', title: 'Rent', desc: 'Pay online and meet to exchange the book' },
  { num: '04', title: 'Return', desc: 'Return on time and get your deposit back' },
];

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="bg-black">
      {/* Hero */}
      <LandingHero />

      {/* Features Section */}
      <div className="border-t border-zinc-900">
        <div className="container mx-auto px-6 py-24 max-w-6xl">

          {/* Section header */}
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-semibold tracking-widest text-orange-400 uppercase border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 rounded-full mb-4">
              Why BookShare
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">Everything you need to<br />share and discover books</h2>
            <p className="text-zinc-400 max-w-md mx-auto text-sm leading-relaxed">
              A peer-to-peer book rental platform built for readers in your neighborhood.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {features.map((f) => (
              <div
                key={f.title}
                className="group bg-zinc-950 border border-zinc-800 rounded-2xl p-8 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} border flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className={`text-lg font-bold mb-3 ${f.color}`}>{f.title}</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex justify-center gap-4 mb-24">
            {user && user.role === 'admin' ? (
              <Link to="/admin" className="px-8 py-3 bg-white text-black rounded-full font-semibold text-sm hover:bg-zinc-200 transition-colors">
                Admin Panel →
              </Link>
            ) : user ? (
              <>
                <Link to="/search" className="px-8 py-3 bg-white text-black rounded-full font-semibold text-sm hover:bg-zinc-200 transition-colors">
                  Browse Books →
                </Link>
                <Link to="/dashboard" className="px-8 py-3 border border-zinc-700 text-zinc-300 rounded-full font-semibold text-sm hover:border-zinc-500 hover:text-white transition-colors">
                  My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="px-8 py-3 bg-white text-black rounded-full font-semibold text-sm hover:bg-zinc-200 transition-colors">
                  Get Started →
                </Link>
                <Link to="/login" className="px-8 py-3 border border-zinc-700 text-zinc-300 rounded-full font-semibold text-sm hover:border-zinc-500 hover:text-white transition-colors">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* How It Works */}
          <div className="relative">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4">Simple Process</span>
              <h2 className="text-3xl font-bold text-white">How it works</h2>
            </div>

            {/* Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <div key={step.num} className="relative text-center">
                  {/* Connector line */}
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[60%] w-full h-px bg-gradient-to-r from-zinc-700 to-transparent" />
                  )}
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center mx-auto mb-4">
                      <span className="text-sm font-bold text-orange-400">{step.num}</span>
                    </div>
                    <h4 className="font-semibold text-white mb-2">{step.title}</h4>
                    <p className="text-xs text-zinc-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-10 px-6">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-bold text-white">
            📚 Book<span className="text-orange-400">Share</span>
          </div>
          <p className="text-zinc-500 text-sm">© 2026 BookShare. Share the joy of reading.</p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link to="/search" className="hover:text-white transition-colors">Browse</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
