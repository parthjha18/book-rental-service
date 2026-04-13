import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/ui/PageWrapper';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading]   = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData);
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  return (
    <PageWrapper>
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16 relative overflow-hidden">

        {/* Background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/6 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Floating card */}
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-3xl p-8 shadow-2xl shadow-black/60 border border-white/8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-5">
                <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center text-lg shadow-lg shadow-orange-500/30">📚</div>
                <span className="text-xl font-bold">Book<span className="gradient-text">Share</span></span>
              </Link>
              <h1 className="text-2xl font-bold text-white">Welcome back</h1>
              <p className="text-zinc-500 mt-1 text-sm">Sign in to continue reading</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { name: 'email',    type: 'email',    label: 'Email',    placeholder: 'you@example.com' },
                { name: 'password', type: 'password', label: 'Password', placeholder: '••••••••' },
              ].map(({ name, type, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    required
                    placeholder={placeholder}
                    className="input-premium"
                  />
                </div>
              ))}

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-2 py-3 bg-white text-black rounded-xl font-bold text-sm
                           hover:bg-orange-50 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                    Signing in…
                  </span>
                ) : (
                  'Sign In →'
                )}
              </motion.button>
            </form>

            <p className="text-center mt-6 text-sm text-zinc-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                Create one
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Login;
