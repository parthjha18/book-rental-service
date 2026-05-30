import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import PageWrapper from '../components/ui/PageWrapper';
import Logo from '../components/ui/Logo';

const FieldError = ({ message }) =>
  message ? <p className="mt-1 text-xs text-red-400">{message}</p> : null;

const ResetPassword = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [submitted, setSubmitted] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { password: '', confirmPassword: '' } });

  useEffect(() => {
    if (!token) {
      setInvalidToken(true);
    }
  }, [token]);

  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    if (!token) return;
    const result = await resetPassword(token, data.password);
    if (result?.success) {
      setSubmitted(true);
      // Automatically redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
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
              <h1 className="text-2xl font-bold text-white">Choose new password</h1>
              <p className="text-zinc-500 mt-1 text-sm">
                {invalidToken
                  ? "Password reset link is invalid or missing"
                  : submitted
                  ? "Your password has been reset successfully"
                  : "Enter your new credentials below"}
              </p>
            </div>

            <AnimatePresence mode="wait">
              {invalidToken ? (
                <motion.div
                  key="reset-invalid"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="p-4 bg-red-500/8 border border-red-500/20 rounded-2xl text-red-400 text-sm leading-relaxed">
                    ⚠️ The password reset link is invalid, incomplete, or has expired. Please request a new link from the forgot password page.
                  </div>

                  <Link
                    to="/forgot-password"
                    className="block w-full py-3 bg-white text-black hover:bg-orange-50 rounded-xl font-bold text-sm transition-all text-center"
                  >
                    Request New Link
                  </Link>
                </motion.div>
              ) : submitted ? (
                <motion.div
                  key="reset-success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 text-center"
                >
                  <div className="p-4 bg-emerald-500/8 border border-emerald-500/20 rounded-2xl text-emerald-400 text-sm leading-relaxed">
                    🎉 Password reset successful! Redirecting you to the login page in 3 seconds...
                  </div>

                  <Link
                    to="/login"
                    className="block w-full py-3 bg-white text-black hover:bg-orange-50 rounded-xl font-bold text-sm transition-all text-center"
                  >
                    Go to Login Now →
                  </Link>
                </motion.div>
              ) : (
                <motion.form
                  key="reset-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                >
                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                      New Password
                    </label>
                    <input
                      id="reset-password"
                      type="password"
                      placeholder="••••••••"
                      className="input-premium"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Password must be at least 6 characters' },
                      })}
                    />
                    <FieldError message={errors.password?.message} />
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-zinc-400 mb-2 uppercase tracking-widest">
                      Confirm New Password
                    </label>
                    <input
                      id="reset-confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="input-premium"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (value) =>
                          value === passwordValue || 'Passwords do not match',
                      })}
                    />
                    <FieldError message={errors.confirmPassword?.message} />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-4 py-3 bg-white text-black rounded-xl font-bold text-sm
                               hover:bg-orange-50 transition-colors shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                        Resetting password…
                      </span>
                    ) : (
                      'Update Password →'
                    )}
                  </motion.button>
                </motion.form>
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

export default ResetPassword;
