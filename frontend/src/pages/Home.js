import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { LandingHero } from '../components/LandingHero';
import PageWrapper from '../components/ui/PageWrapper';

const features = [
  {
    icon: '📚',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/20',
    glow: 'group-hover:shadow-orange-500/20',
    title: 'Share Books',
    desc: 'List your books and earn passive income while helping others discover great reads in your community.',
  },
  {
    icon: '📍',
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    glow: 'group-hover:shadow-sky-500/20',
    title: 'Find Nearby',
    desc: 'Discover books available within kilometers of your location using our smart location-based search.',
  },
  {
    icon: '💸',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
    glow: 'group-hover:shadow-emerald-500/20',
    title: 'Affordable Rental',
    desc: 'Rent books at just ₹40/week with a secure payment system and fully refundable deposit.',
  },
];

const steps = [
  { num: '01', title: 'Register', desc: 'Create your account and share your location', icon: '✍️' },
  { num: '02', title: 'Browse',   desc: 'Find books nearby or list your own collection', icon: '🔍' },
  { num: '03', title: 'Rent',     desc: 'Pay online and meet to exchange the book', icon: '💳' },
  { num: '04', title: 'Return',   desc: 'Return on time and get your deposit back', icon: '✅' },
];

const stats = [
  { value: '500+', label: 'Books Listed' },
  { value: '200+', label: 'Active Readers' },
  { value: '₹40',  label: 'Per Week' },
  { value: '98%',  label: 'Happy Users' },
];

const testimonials = [
  {
    name: 'Ananya Sharma',
    role: 'College Student',
    text: 'BookShare saved me thousands on textbooks! I found all my semester books within 2km of my hostel.',
    avatar: '🧑‍🎓',
  },
  {
    name: 'Rohan Mehta',
    role: 'Software Engineer',
    text: 'I listed 15 books I wasn\'t reading anymore. Made ₹2,000 in the first month — love this platform!',
    avatar: '👨‍💻',
  },
  {
    name: 'Priya Desai',
    role: 'Book Club Organizer',
    text: 'Our entire book club uses BookShare now. The location feature makes exchanging books so convenient.',
    avatar: '📖',
  },
];

const cardVariants = {
  hidden:  { opacity: 0, y: 32 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  }),
};

const Home = () => {
  const { user } = useAuth();

  return (
    <PageWrapper>
      <div className="bg-black">
        {/* Hero */}
        <LandingHero />

        {/* ── Stats Bar ──────────────────────────────────────────────────── */}
        <div className="border-y border-white/5 bg-white/[0.02]">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                  className="flex flex-col items-center py-8 sm:py-10"
                >
                  <span className="text-2xl sm:text-3xl font-bold gradient-text leading-none">{s.value}</span>
                  <span className="text-[11px] text-zinc-500 mt-2 font-medium tracking-wide">{s.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Features ───────────────────────────────────────────────────── */}
        <div className="container mx-auto px-6 py-24 sm:py-28 max-w-6xl">
          <div className="text-center mb-16">
            <motion.span
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block text-xs font-semibold tracking-widest text-orange-400 uppercase
                         border border-orange-500/30 bg-orange-500/8 px-4 py-1.5 rounded-full mb-4"
            >
              Why BookShare
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight"
            >
              Everything you need to<br />
              <span className="gradient-text">share & discover</span> books
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed"
            >
              A peer-to-peer book rental platform built for readers in your neighborhood.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
                className={`group relative glass border ${f.border} rounded-2xl p-8
                            hover:bg-zinc-900/60 transition-all duration-300 shine overflow-hidden
                            hover:shadow-xl ${f.glow}`}
              >
                {/* Ambient circle */}
                <div className={`absolute -top-8 -right-8 w-32 h-32 ${f.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className={`w-12 h-12 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {f.icon}
                </div>
                <h3 className={`text-lg font-bold mb-3 ${f.color}`}>{f.title}</h3>
                <p className="text-zinc-500 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex justify-center gap-4 mb-28 flex-wrap"
          >
            {user && user.role === 'admin' ? (
              <Link to="/admin" className="px-8 py-3 bg-white text-black rounded-full font-semibold text-sm hover:bg-zinc-200 transition-colors shadow-lg">
                Admin Panel →
              </Link>
            ) : user ? (
              <>
                <Link to="/search" className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-semibold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25">
                  Browse Books →
                </Link>
                <Link to="/dashboard" className="px-8 py-3 border border-white/10 text-zinc-300 rounded-full font-semibold text-sm hover:border-white/20 hover:text-white transition-colors">
                  My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/register" className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-semibold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25">
                  Get Started →
                </Link>
                <Link to="/login" className="px-8 py-3 border border-white/10 text-zinc-300 rounded-full font-semibold text-sm hover:border-white/20 hover:text-white transition-colors">
                  Sign In
                </Link>
              </>
            )}
          </motion.div>

          {/* ── How It Works ─────────────────────────────────────────────── */}
          <div className="relative mb-28">
            <div className="text-center mb-14">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block text-xs font-semibold tracking-widest text-zinc-500 uppercase mb-4"
              >
                Simple Process
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-white tracking-tight"
              >
                How it works
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.num}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="relative text-center group"
                >
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[70%] w-full h-px bg-gradient-to-r from-zinc-700/60 to-transparent" />
                  )}
                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-5 group-hover:border-orange-500/30 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-orange-500/10">
                      <span className="text-2xl">{step.icon}</span>
                    </div>
                    <span className="text-xs font-bold gradient-text tracking-widest">{step.num}</span>
                    <h4 className="font-bold text-white mt-2 mb-2 text-lg">{step.title}</h4>
                    <p className="text-xs text-zinc-600 leading-relaxed max-w-[180px] mx-auto">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Testimonials ─────────────────────────────────────────────── */}
          <div className="mb-28">
            <div className="text-center mb-14">
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block text-xs font-semibold tracking-widest text-orange-400 uppercase
                           border border-orange-500/30 bg-orange-500/8 px-4 py-1.5 rounded-full mb-4"
              >
                Loved by Readers
              </motion.span>
              <motion.h2
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold text-white tracking-tight"
              >
                What our users say
              </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  custom={i}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="glass rounded-2xl p-7 relative overflow-hidden group card-hover"
                >
                  {/* Quote mark */}
                  <div className="absolute top-4 right-5 text-4xl text-zinc-800 font-serif select-none">"</div>

                  <p className="text-zinc-400 text-sm leading-relaxed mb-6 relative z-10">"{t.text}"</p>

                  <div className="flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-lg">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-zinc-600">{t.role}</p>
                    </div>
                  </div>

                  {/* Ambient glow */}
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Final CTA ────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="glass rounded-3xl p-10 sm:p-14 relative overflow-hidden">
              {/* Ambient glows */}
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-amber-500/8 rounded-full blur-[80px]" />

              <div className="relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  Ready to start <span className="gradient-text">reading</span>?
                </h2>
                <p className="text-zinc-500 text-sm sm:text-base max-w-md mx-auto mb-8 leading-relaxed">
                  Join our community of book lovers and discover your next favorite read nearby.
                </p>
                <div className="flex justify-center gap-4 flex-wrap">
                  {!user ? (
                    <>
                      <Link
                        to="/register"
                        className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25"
                      >
                        Get Started Free →
                      </Link>
                      <Link
                        to="/login"
                        className="px-8 py-3.5 bg-white/5 border border-white/10 text-zinc-300 rounded-full font-semibold text-sm hover:bg-white/10 hover:text-white transition-all"
                      >
                        Sign In
                      </Link>
                    </>
                  ) : (
                    <Link
                      to="/search"
                      className="px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-full font-bold text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25"
                    >
                      Browse Books →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Footer ───────────────────────────────────────────────────────── */}
        <footer className="border-t border-white/5">
          <div className="container mx-auto max-w-6xl px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div className="md:col-span-2">
                <Link to="/" className="flex items-center gap-2.5 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-sm shadow-lg shadow-orange-500/30">📚</div>
                  <span className="text-lg font-bold">Book<span className="gradient-text">Share</span></span>
                </Link>
                <p className="text-zinc-600 text-sm leading-relaxed max-w-sm">
                  A peer-to-peer book rental platform connecting readers in your neighborhood. Share books, save money, and discover new reads.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Platform</h4>
                <ul className="space-y-3 text-sm text-zinc-600">
                  <li><Link to="/search" className="hover:text-white transition-colors">Browse Books</Link></li>
                  <li><Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
                  <li><Link to="/rentals" className="hover:text-white transition-colors">My Rentals</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4">Account</h4>
                <ul className="space-y-3 text-sm text-zinc-600">
                  <li><Link to="/register" className="hover:text-white transition-colors">Register</Link></li>
                  <li><Link to="/login" className="hover:text-white transition-colors">Login</Link></li>
                  <li><Link to="/my-books" className="hover:text-white transition-colors">My Books</Link></li>
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="section-divider mb-6" />
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-zinc-600 text-xs">© 2026 BookShare · Share the joy of reading.</p>
              <div className="flex gap-4 text-xs text-zinc-600">
                <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
                <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
                <span className="hover:text-white transition-colors cursor-pointer">Contact</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </PageWrapper>
  );
};

export default Home;
