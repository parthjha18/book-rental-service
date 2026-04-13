import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { getCurrentLocation } from '../utils/helpers';
import API from '../services/api';
import toast from 'react-hot-toast';
import PageWrapper from '../components/ui/PageWrapper';
import Logo from '../components/ui/Logo';

const STEPS = ['Account', 'Location', 'Verify'];

const Register = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '', city: '', pincode: '', otp: '', avatar: ''
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [coordinates,     setCoordinates]     = useState(null);
  const [otpSent,         setOtpSent]         = useState(false);
  const [sendingOtp,      setSendingOtp]       = useState(false);
  const [loading,         setLoading]          = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleGetLocation = async () => {
    setLoadingLocation(true);
    try {
      const loc = await getCurrentLocation();
      setCoordinates([loc.longitude, loc.latitude]);
      toast.success('Location captured!');
    } catch {
      toast.error('Enable location services and try again.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleSendOtp = async () => {
    if (!coordinates) { toast.error('Please capture your location first'); return; }
    setSendingOtp(true);
    try {
      const { data } = await API.post('/auth/send-otp', { phone: formData.phone, email: formData.email });
      if (data.success) {
        setOtpSent(true);
        setStep(2);
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.otp) { toast.error('Please enter the OTP'); return; }
    setLoading(true);
    const result = await register({
      ...formData,
      location: { coordinates, address: formData.address, city: formData.city, pincode: formData.pincode },
      otp: formData.otp
    });
    setLoading(false);
    if (result.success) navigate('/dashboard');
  };

  const labelCls = "block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest";
  const inputCls = "input-premium";

  return (
    <PageWrapper>
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16 relative overflow-hidden">
        
        {/* Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-orange-500/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-[80px]" />
        </div>

        <div className="relative w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-3xl p-8 shadow-2xl shadow-black/60 border border-white/8"
          >
            <div className="text-center mb-6">
              <div className="flex justify-center mb-6">
                <Link to="/">
                  <Logo />
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-white">Create account</h1>
              <p className="text-zinc-500 mt-1 text-sm">Join thousands of book lovers</p>
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 mb-8">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300 ${
                    i < step  ? 'bg-orange-500 text-white' :
                    i === step ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                                 'bg-zinc-900 text-zinc-600 border border-white/6'
                  }`}>
                    {i < step ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs font-medium ${i === step ? 'text-white' : 'text-zinc-600'}`}>{s}</span>
                  {i < STEPS.length - 1 && (
                    <div className={`w-8 h-px mx-1 transition-colors duration-300 ${i < step ? 'bg-orange-500/50' : 'bg-white/8'}`} />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <AnimatePresence mode="wait">
                {step === 0 && (
                  <motion.div
                    key="step0"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'name',     type: 'text',     label: 'Full Name', placeholder: 'John Doe' },
                        { name: 'email',    type: 'email',    label: 'Email',     placeholder: 'you@example.com' },
                        { name: 'password', type: 'password', label: 'Password',  placeholder: 'Min 6 characters' },
                        { name: 'phone',    type: 'tel',      label: 'Phone',     placeholder: '+91 98765 43210' },
                      ].map(({ name, type, label, placeholder }) => (
                        <div key={name}>
                          <label className={labelCls}>{label}</label>
                          <input type={type} name={name} value={formData[name]} onChange={handleChange} required placeholder={placeholder} className={inputCls} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className={labelCls}>Profile Picture URL <span className="text-zinc-600 normal-case tracking-normal">(optional)</span></label>
                      <input type="url" name="avatar" value={formData.avatar} onChange={handleChange} placeholder="https://example.com/photo.jpg" className={inputCls} />
                    </div>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        if (!formData.name || !formData.email || !formData.password || !formData.phone) {
                          toast.error('Please fill all required fields');
                          return;
                        }
                        setStep(1);
                      }}
                      className="w-full py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors shadow-md mt-2"
                    >
                      Continue →
                    </motion.button>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { name: 'city',    label: 'City',    placeholder: 'Mumbai' },
                        { name: 'pincode', label: 'Pincode', placeholder: '400001' },
                      ].map(({ name, label, placeholder }) => (
                        <div key={name}>
                          <label className={labelCls}>{label}</label>
                          <input type="text" name={name} value={formData[name]} onChange={handleChange} required placeholder={placeholder} className={inputCls} />
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className={labelCls}>Street Address</label>
                      <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="Street address" className={inputCls} />
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleGetLocation}
                      disabled={loadingLocation}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full py-3 rounded-xl font-bold text-sm transition-all border ${
                        coordinates
                          ? 'bg-emerald-500/12 border-emerald-500/30 text-emerald-400'
                          : 'bg-zinc-900 border-white/8 text-zinc-300 hover:bg-zinc-800'
                      } disabled:opacity-50`}
                    >
                      {loadingLocation ? '📍 Detecting…' : coordinates ? '✅ Location Captured' : '📍 Capture My Location'}
                    </motion.button>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(0)}
                        className="flex-1 py-3 rounded-xl font-bold text-sm border border-white/8 text-zinc-400 hover:text-white hover:border-white/15 transition-all"
                      >
                        ← Back
                      </button>
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSendOtp}
                        disabled={sendingOtp || !formData.city || !formData.address}
                        className="flex-1 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {sendingOtp ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            Sending…
                          </span>
                        ) : 'Send OTP →'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="p-4 bg-orange-500/8 border border-orange-500/20 rounded-xl text-sm text-orange-300 text-center">
                      📧 A 6-digit OTP has been sent to your email: <strong className="text-orange-400">{formData.email}</strong>
                    </div>
                    <div>
                      <label className={labelCls}>Enter OTP</label>
                      <input
                        type="text"
                        name="otp"
                        value={formData.otp}
                        onChange={handleChange}
                        required
                        maxLength="6"
                        placeholder="6-digit code"
                        className={inputCls + " text-center text-xl tracking-[0.5em] font-bold"}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="flex-1 py-3 rounded-xl font-bold text-sm border border-white/8 text-zinc-400 hover:text-white hover:border-white/15 transition-all"
                      >
                        ← Back
                      </button>
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={loading}
                        className="flex-1 py-3 bg-white text-black rounded-xl font-bold text-sm hover:bg-orange-50 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                            Creating…
                          </span>
                        ) : 'Create Account →'}
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <p className="text-center mt-6 text-sm text-zinc-600">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-400 hover:text-orange-300 font-semibold transition-colors">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
