import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/ui/PageWrapper';
import Logo from '../components/ui/Logo';

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs text-red-400">{message}</p> : null;

const ForgotPassword = () => {
  const { forgotPassword } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async (data) => {
    const result = await forgotPassword(data.email);
    if (result.success) {
      setUserEmail(data.email);
      setSubmitted(true);
    }
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
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="glass rounded-3xl p-8 shadow-2xl shadow-black/60 border border-white/8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-5">
                <Link to="/">
                  <Logo />
                </Link>
              </div>
              <h1 className="text-2xl font-bold text-white">Reset password</h1>
              <p className="text-zinc-500 mt-1 text-sm">
                {!submitted ? "Enter your email to request a reset link" : "Check your inbox"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="forgot-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                      Email Address
                    </label>
                    <input
                      id="forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      className="input-premium"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
                      })}
                    />
                    <FieldError message={errors.email?.message} />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-2 py-3 bg-white text-black rounded-xl font-bold text-sm
                               hover:bg-orange-55 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Sending request…
                      </span>
                    ) : (
                      'Send Reset Link →'
                    )}
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="forgot-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="p-4 bg-orange-500/8 border border-orange-500/20 rounded-2xl text-orange-300 text-sm leading-relaxed">
                    📧 We have sent a password reset link to your email:<br />
                    <strong className="text-orange-400">{userEmail}</strong>
                    <div className="mt-3 text-xs text-zinc-500 border-t border-white/5 pt-3">
                      If you are in local development mode, you can copy the link printed in your backend terminal logs.
                    </div>
                  </div>

                  <p className="text-zinc-500 text-xs">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="w-full py-3 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-white/8 hover:border-white/12 rounded-xl font-bold text-sm transition-all"
                  >
                    ← Go Back
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <p className="text-center mt-6 text-sm text-zinc-600">
              Remember your password?{' '}
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

export default ForgotPassword;
