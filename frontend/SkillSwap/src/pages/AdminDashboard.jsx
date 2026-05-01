import { useEffect, useState } from 'react';
import { Icons, Icon } from '../utils/icons.jsx';
import axiosClient from '../api/axiosClient.js';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axiosClient.get('/api/admin/stats');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch admin stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-10 text-center font-bold text-slate-500 animate-pulse">Loading Platform Analytics...</div>;

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="glass rounded-3xl p-8 shadow-2xl">
        <h1 className="text-4xl font-black gradient-text flex items-center gap-4">
          <Icon icon={Icons.dashboard} size="xl" />
          Admin Platform Analytics
        </h1>
        <p className="text-slate-700 mt-2 font-medium">Real-time overview of the SkillSwap ecosystem</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Users" value={stats?.overview.totalUsers} icon={Icons.users} color="blue" />
        <StatCard title="Swap Requests" value={stats?.overview.totalRequests} icon={Icons.handshake} color="purple" />
        <StatCard title="Active Bookings" value={stats?.overview.totalBookings} icon={Icons.calendar} color="green" />
        <StatCard title="Blog Posts" value={stats?.overview.totalBlogs} icon={Icons.lightbulb} color="yellow" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="glass rounded-3xl p-6 shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Icon icon={Icons.users} size="lg" className="text-brand-500" />
            Newest Members
          </h2>
          <div className="space-y-4">
            {stats?.recentActivity.users.map((u) => (
              <div key={u._id} className="flex justify-between items-center p-4 bg-white/50 rounded-2xl border border-white hover:bg-white transition-all shadow-sm">
                <div>
                  <p className="font-bold text-slate-800">{u.name}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Joined {new Date(u.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-6 shadow-xl space-y-6">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Icon icon={Icons.handshake} size="lg" className="text-brand-500" />
            Recent Swap Requests
          </h2>
          <div className="space-y-4">
            {stats?.recentActivity.requests.map((r) => (
              <div key={r._id} className="flex flex-col p-4 bg-white/50 rounded-2xl border border-white hover:bg-white transition-all shadow-sm">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-slate-800">
                    {r.sender?.name} ↔️ {r.receiver?.name}
                  </p>
                  <span className="px-2 py-1 rounded-full bg-brand-100 text-brand-700 text-[10px] font-black uppercase">
                    {r.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1 italic">
                  {r.offeredSkill} for {r.requestedSkill}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => {
  const gradients = {
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-pink-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-400 to-orange-500'
  };
  return (
    <div className={`rounded-3xl p-6 shadow-2xl bg-gradient-to-br ${gradients[color]} text-white relative overflow-hidden card-hover`}>
      <div className="absolute -top-6 -right-6 w-24 h-24 bg-white/20 rounded-full blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs font-black uppercase tracking-widest text-white/80">{title}</p>
          <Icon icon={icon} size="xl" className="text-white/90" />
        </div>
        <p className="text-4xl font-black drop-shadow-lg">{value}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
