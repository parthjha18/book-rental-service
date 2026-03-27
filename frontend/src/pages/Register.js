import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCurrentLocation } from '../utils/helpers';
import toast from 'react-hot-toast';

const inputClass = "w-full px-4 py-3 bg-zinc-900 border border-zinc-700 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all text-sm";

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', address: '', city: '', pincode: '',
  });
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleGetLocation = async () => {
    setLoadingLocation(true);
    try {
      const location = await getCurrentLocation();
      setCoordinates([location.longitude, location.latitude]);
      toast.success('Location captured successfully!');
    } catch (error) {
      toast.error('Failed to get location. Please enable location services.');
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!coordinates) { toast.error('Please capture your location first'); return; }
    const result = await register({
      ...formData,
      location: { coordinates, address: formData.address, city: formData.city, pincode: formData.pincode },
    });
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg">
        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block text-2xl font-bold mb-4">
              📚 Book<span className="text-orange-400">Share</span>
            </Link>
            <h1 className="text-3xl font-bold text-white">Create account</h1>
            <p className="text-zinc-400 mt-2 text-sm">Join thousands of book lovers</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="you@example.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Password</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="6" placeholder="Min 6 characters" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required placeholder="+91 98765 43210" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} required placeholder="Mumbai" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required placeholder="400001" className={inputClass} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} required placeholder="Street address" className={inputClass} />
            </div>

            <button
              type="button"
              onClick={handleGetLocation}
              disabled={loadingLocation}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all border ${
                coordinates
                  ? 'bg-green-500/20 border-green-500/40 text-green-400'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700'
              } disabled:opacity-50`}
            >
              {loadingLocation ? '📍 Detecting...' : coordinates ? '✅ Location Captured' : '📍 Capture My Location'}
            </button>

            <button
              type="submit"
              className="w-full bg-white text-black py-3 rounded-xl font-semibold hover:bg-zinc-200 transition-colors"
            >
              Create Account →
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
