import { useState, useEffect } from 'react';
import API from '../services/api';
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
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-emerald-500 font-medium">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="container mx-auto px-6 py-10 max-w-6xl">
        
        {/* Page Header - Dark Theme */}
        <div className="mb-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl font-bold text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.15)]">
            🛡️
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Admin Control Panel</h1>
            <p className="text-zinc-400 mt-1.5 text-sm font-medium">Monitor platform health and user activity</p>
          </div>
        </div>

        {/* Stats Cards - Light Theme */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Users', val: stats?.totalUsers || 0, color: 'text-blue-600', bg: 'bg-emerald-50 border-emerald-100' },
            { label: 'Total Books', val: stats?.totalBooks || 0, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
            { label: 'Total Rentals', val: stats?.totalTransactions || 0, color: 'text-purple-600', bg: 'bg-emerald-50 border-emerald-100' },
            { label: 'Platform Revenue', val: `₹${stats?.totalRevenue || 0}`, color: 'text-amber-600', bg: 'bg-emerald-50 border-emerald-100' },
          ].map((stat) => (
            <div key={stat.label} className={`rounded-3xl p-6 border ${stat.bg} shadow-lg shadow-emerald-900/10 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
              <div className="relative z-10">
                <h3 className="text-emerald-800/60 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</h3>
                <p className={`text-5xl font-black mt-2 tracking-tight ${stat.color}`}>{stat.val}</p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white/60 blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
            </div>
          ))}
        </div>

        {/* Users Table Container - Light Mint Theme */}
        <div className="bg-emerald-50 border-4 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl relative">
          {/* Subtle top inner glow */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
          
          <div className="px-8 py-6 border-b border-emerald-200/60 bg-white/40 backdrop-blur-md">
            <h2 className="text-xl font-bold text-emerald-950 flex items-center gap-3">
              <span className="p-2 bg-emerald-100 rounded-lg">👥</span> 
              Registered Platform Users
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-emerald-100/30 border-b border-emerald-200/50">
                  <th className="py-5 px-8 font-bold text-emerald-800 uppercase text-xs tracking-wider">User Details</th>
                  <th className="py-5 px-8 font-bold text-emerald-800 uppercase text-xs tracking-wider">Email Address</th>
                  <th className="py-5 px-8 font-bold text-emerald-800 uppercase text-xs tracking-wider">Access Role</th>
                  <th className="py-5 px-8 font-bold text-emerald-800 uppercase text-xs tracking-wider">Joined Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-100/50 bg-transparent">
                {users.map((u, i) => (
                  <tr key={u._id} className="hover:bg-white/60 transition-colors group">
                    <td className="py-5 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-200 flex items-center justify-center text-emerald-700 font-bold text-xs shadow-inner">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-emerald-950">{u.name}</span>
                      </div>
                    </td>
                    <td className="py-5 px-8 text-emerald-700/80 text-sm font-medium">{u.email}</td>
                    <td className="py-5 px-8">
                      <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm border ${
                        u.role === 'admin' 
                          ? 'bg-amber-100 text-amber-700 border-amber-200' 
                          : 'bg-white text-emerald-600 border-emerald-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-5 px-8 text-emerald-600/80 text-sm font-semibold">
                      {new Date(u.createdAt).toLocaleDateString('en-GB', { 
                        day: 'numeric', month: 'short', year: 'numeric' 
                      })}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-16 px-8 text-center bg-white/30">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
                        <span className="text-2xl">👻</span>
                      </div>
                      <p className="text-emerald-800 font-medium">No registered users found.</p>
                      <p className="text-emerald-600/60 text-sm mt-1">When users sign up, they will appear here.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
