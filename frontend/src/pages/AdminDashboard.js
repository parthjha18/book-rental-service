import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';
import { PageLoader } from '../components/ui/SkeletonLoader';
import PageWrapper from '../components/ui/PageWrapper';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        API.get('/admin/dashboard'),
        API.get('/admin/users')
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.data);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.data);
      }
    } catch (error) {
      toast.error('Failed to load admin data. Are you an admin?');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <PageLoader message="Loading Admin Dashboard…" />;
  }

  const statCards = [
    { label: 'Total Users',      val: stats?.totalUsers || 0,          icon: '👥', color: 'sky',     gradient: 'from-sky-500/20 to-sky-500/5' },
    { label: 'Total Books',      val: stats?.totalBooks || 0,          icon: '📚', color: 'orange',  gradient: 'from-orange-500/20 to-orange-500/5' },
    { label: 'Total Rentals',    val: stats?.totalTransactions || 0,   icon: '📋', color: 'violet',  gradient: 'from-violet-500/20 to-violet-500/5' },
    { label: 'Platform Revenue', val: `₹${stats?.totalRevenue || 0}`,  icon: '💰', color: 'emerald', gradient: 'from-emerald-500/20 to-emerald-500/5' },
  ];

  return (
    <PageWrapper>
      <div className="min-h-screen bg-black text-white pb-20">
        <div className="container mx-auto px-6 py-10 max-w-6xl">

          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/20 flex items-center justify-center text-2xl shadow-lg shadow-orange-500/10">
              🛡️
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Admin Panel</h1>
              <p className="text-zinc-500 mt-1 text-sm font-medium">Monitor platform health and user activity</p>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {statCards.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className={`group relative glass rounded-2xl p-6 overflow-hidden card-hover`}
              >
                {/* Ambient glow */}
                <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${stat.gradient} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</span>
                    <span className="text-xl">{stat.icon}</span>
                  </div>
                  <p className={`text-3xl sm:text-4xl font-black tracking-tight text-${stat.color}-400`}>{stat.val}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Users Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="glass rounded-2xl overflow-hidden"
          >
            {/* Table header */}
            <div className="px-6 sm:px-8 py-5 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <span className="p-2 bg-zinc-800 rounded-lg text-sm">👥</span>
                Platform Users
              </h2>
              <span className="text-xs text-zinc-600 bg-zinc-900 px-3 py-1.5 rounded-full border border-white/5 font-semibold">
                {users.length} users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="py-4 px-6 sm:px-8 font-bold text-zinc-500 uppercase text-[10px] tracking-widest">User</th>
                    <th className="py-4 px-6 sm:px-8 font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Email</th>
                    <th className="py-4 px-6 sm:px-8 font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Role</th>
                    <th className="py-4 px-6 sm:px-8 font-bold text-zinc-500 uppercase text-[10px] tracking-widest">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {users.map((u, i) => (
                    <motion.tr
                      key={u._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.03 }}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="py-4 px-6 sm:px-8">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400 font-bold text-xs flex-shrink-0">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-white text-sm">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 sm:px-8 text-zinc-500 text-sm">{u.email}</td>
                      <td className="py-4 px-6 sm:px-8">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                          u.role === 'admin'
                            ? 'bg-amber-500/15 text-amber-400 border-amber-500/25'
                            : 'bg-zinc-800/50 text-zinc-400 border-white/5'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 sm:px-8 text-zinc-600 text-sm font-medium">
                        {new Date(u.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </td>
                    </motion.tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="4" className="py-16 px-8 text-center">
                        <motion.div
                          animate={{ y: [0, -6, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          className="text-3xl mb-3"
                        >
                          👻
                        </motion.div>
                        <p className="text-zinc-400 font-medium">No registered users found.</p>
                        <p className="text-zinc-600 text-sm mt-1">When users sign up, they will appear here.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AdminDashboard;
