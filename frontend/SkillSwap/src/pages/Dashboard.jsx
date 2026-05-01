import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button.jsx';
import { fetchRequests } from '../features/requests/requestsSlice.js';
import { fetchBookings } from '../features/bookings/bookingsSlice.js';
import { fetchUsers } from '../features/users/usersSlice.js';
import { Icons, Icon } from '../utils/icons.jsx';
import SkillTag from '../components/forms/SkillTag.jsx';
import UserCard from '../features/discover/UserCard.jsx';
import RequestSwapModal from '../features/discover/RequestSwapModal.jsx';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items: requests } = useSelector((state) => state.requests);
  const { items: bookings } = useSelector((state) => state.bookings);
  const { list: allUsers } = useSelector((state) => state.users);
  const [showSkillsSection, setShowSkillsSection] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    dispatch(fetchRequests());
    dispatch(fetchBookings());
    dispatch(fetchUsers({}));
  }, [dispatch]);

  // Calculate suggested users based on skill matching
  const suggestedUsers = allUsers
    .filter(u => u._id !== user?._id)
    .map(u => {
      const userWantsToLearn = user?.skillsToLearn?.map(s => s.name.toLowerCase()) || [];
      const userCanTeach = user?.skillsToTeach?.map(s => s.name.toLowerCase()) || [];
      const otherCanTeach = u.skillsToTeach?.map(s => s.name.toLowerCase()) || [];
      const otherWantsToLearn = u.skillsToLearn?.map(s => s.name.toLowerCase()) || [];
      
      const matchScore = 
        userWantsToLearn.filter(skill => otherCanTeach.includes(skill)).length * 2 +
        userCanTeach.filter(skill => otherWantsToLearn.includes(skill)).length * 2;
      
      return { ...u, matchScore };
    })
    .filter(u => u.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  // Analytics data
  const analytics = {
    totalRequests: requests.length,
    acceptedRequests: requests.filter(r => r.status === 'accepted').length,
    pendingRequests: requests.filter(r => r.status === 'pending').length,
    declinedRequests: requests.filter(r => r.status === 'declined').length,
    totalBookings: bookings.length,
    completedBookings: bookings.filter(b => b.isCompleted).length,
    upcomingBookings: bookings.filter(b => !b.isCompleted).length,
    totalSkills: (user?.skillsToTeach?.length || 0) + (user?.skillsToLearn?.length || 0),
    skillsToTeach: user?.skillsToTeach?.length || 0,
    skillsToLearn: user?.skillsToLearn?.length || 0
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold gradient-text flex items-center gap-2">
              Welcome back, {user?.name}!
              <Icon icon={Icons.sparklesSolid} size="lg" className="text-yellow-500" />
            </h2>
            <p className="text-slate-700 mt-1 font-medium text-sm sm:text-base">Manage your skills, requests, and bookings.</p>
          </div>
          <Link to="/profile/edit/me" className="w-full sm:w-auto">
            <Button variant="secondary" className="font-bold w-full sm:w-auto text-sm sm:text-base flex items-center gap-2 justify-center">
              <Icon icon={Icons.edit} size="md" />
              Update profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        <StatCard title="My Skills" value={analytics.totalSkills} icon={Icons.trophy} color="purple" />
        <StatCard title="Pending Requests" value={analytics.pendingRequests} icon={Icons.inbox} color="accent" />
        <StatCard title="Upcoming Bookings" value={analytics.upcomingBookings} icon={Icons.calendar} color="brand" />
      </div>

      {/* Skills Section */}
      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg sm:text-xl gradient-text flex items-center gap-2">
            <Icon icon={Icons.trophy} size="lg" />
            My Skills
          </h3>
          <Link to="/profile/edit/me">
            <Button variant="secondary" className="text-xs sm:text-sm flex items-center gap-1">
              <Icon icon={Icons.edit} size="sm" />
              Edit Skills
            </Button>
          </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
          {/* Skills to Teach */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
              <Icon icon={Icons.sparklesSolid} size="sm" className="text-green-500" />
              I can teach ({analytics.skillsToTeach})
            </h4>
            <div className="flex flex-wrap gap-2">
              {user?.skillsToTeach?.length > 0 ? (
                user.skillsToTeach.map((skill, idx) => (
                  <SkillTag key={idx} label={`${skill.name} (${skill.level})`} />
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No skills added yet</p>
              )}
            </div>
          </div>

          {/* Skills to Learn */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm text-slate-700 flex items-center gap-2">
              <Icon icon={Icons.lightbulb} size="sm" className="text-blue-500" />
              I want to learn ({analytics.skillsToLearn})
            </h4>
            <div className="flex flex-wrap gap-2">
              {user?.skillsToLearn?.length > 0 ? (
                user.skillsToLearn.map((skill, idx) => (
                  <SkillTag key={idx} label={`${skill.name} (${skill.level})`} />
                ))
              ) : (
                <p className="text-sm text-slate-500 italic">No skills added yet</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Section */}
      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <h3 className="font-bold text-lg sm:text-xl gradient-text flex items-center gap-2 mb-6">
          <Icon icon={Icons.dashboard} size="lg" />
          Analytics & Insights
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <AnalyticCard 
            label="Total Requests" 
            value={analytics.totalRequests} 
            icon={Icons.inbox}
            color="blue"
          />
          <AnalyticCard 
            label="Accepted" 
            value={analytics.acceptedRequests} 
            icon={Icons.checkSolid}
            color="green"
          />
          <AnalyticCard 
            label="Completed Sessions" 
            value={analytics.completedBookings} 
            icon={Icons.calendar}
            color="purple"
          />
          <AnalyticCard 
            label="Success Rate" 
            value={analytics.totalRequests > 0 ? `${Math.round((analytics.acceptedRequests / analytics.totalRequests) * 100)}%` : '0%'} 
            icon={Icons.trophy}
            color="yellow"
          />
        </div>

        {/* Progress Bars */}
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-slate-700">Request Acceptance Rate</span>
              <span className="text-slate-600">{analytics.totalRequests > 0 ? Math.round((analytics.acceptedRequests / analytics.totalRequests) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analytics.totalRequests > 0 ? (analytics.acceptedRequests / analytics.totalRequests) * 100 : 0}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="font-semibold text-slate-700">Session Completion Rate</span>
              <span className="text-slate-600">{analytics.totalBookings > 0 ? Math.round((analytics.completedBookings / analytics.totalBookings) * 100) : 0}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-400 to-purple-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${analytics.totalBookings > 0 ? (analytics.completedBookings / analytics.totalBookings) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Suggested Profiles */}
      {suggestedUsers.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg sm:text-xl gradient-text flex items-center gap-2">
              <Icon icon={Icons.sparklesSolid} size="lg" className="text-yellow-500" />
              Suggested for You
            </h3>
            <Link to="/discover">
              <Button variant="secondary" className="text-xs sm:text-sm">
                View All
              </Button>
            </Link>
          </div>
          <p className="text-sm text-slate-600">Based on your skills and interests</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestedUsers.map((suggestedUser) => (
              <UserCard key={suggestedUser._id} user={suggestedUser} onRequestSwap={() => setSelectedUser(suggestedUser)} />
            ))}
          </div>
        </div>
      )}

      {/* Request Swap Modal */}
      {selectedUser && (
        <RequestSwapModal 
          user={selectedUser} 
          isOpen={!!selectedUser}
          onClose={() => setSelectedUser(null)} 
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Panel title="Upcoming Bookings" icon={Icons.calendar}>
          {bookings.slice(0, 3).map((booking) => (
            <div key={booking._id} className="flex justify-between items-center p-3 rounded-lg hover:bg-brand-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm sm:text-base truncate">{new Date(booking.confirmedSchedule).toLocaleString()}</p>
                <p className="text-xs text-slate-500 capitalize">{booking.meetingType}</p>
              </div>
              <Icon icon={Icons.computer} size="xl" className="text-brand-500 ml-2" />
            </div>
          ))}
          {bookings.length === 0 && <p className="text-slate-500 text-xs sm:text-sm text-center py-4">No bookings yet. Start exploring!</p>}
        </Panel>
        <Panel title="Recent Requests" icon={Icons.handshake}>
          {requests.slice(0, 3).map((req) => (
            <div key={req._id} className="flex justify-between items-center p-3 rounded-lg hover:bg-accent-50 transition-colors">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm sm:text-base truncate">
                  {req.offeredSkill} ↔️ {req.requestedSkill}
                </p>
                <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600 capitalize">{req.status}</span>
              </div>
            </div>
          ))}
          {requests.length === 0 && <p className="text-slate-500 text-xs sm:text-sm text-center py-4">No requests yet. Browse the discover page!</p>}
        </Panel>
      </div>
    </div>
  );
};

const Panel = ({ title, icon, children }) => (
  <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-lg card-hover">
    <h3 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
      <Icon icon={icon} size="lg" className="text-brand-500" />
      {title}
    </h3>
    <div className="space-y-2">{children}</div>
  </div>
);

const StatCard = ({ title, value, icon, color }) => {
  const gradients = {
    brand: 'from-blue-500 to-cyan-500',
    accent: 'from-emerald-500 to-teal-500',
    purple: 'from-purple-500 to-pink-500'
  };
  
  return (
    <div className={`glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl card-hover border-2 sm:border-4 border-white/50 bg-gradient-to-br ${gradients[color] || gradients.brand} relative overflow-hidden`}>
      <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-full blur-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <p className="text-xs sm:text-sm font-bold text-white/90 uppercase tracking-wide">{title}</p>
          <Icon icon={icon} size="3xl" className="text-white drop-shadow-2xl" />
        </div>
        <p className="text-3xl sm:text-4xl lg:text-5xl font-black text-white drop-shadow-lg">{value}</p>
      </div>
    </div>
  );
};

const AnalyticCard = ({ label, value, icon, color }) => {
  const colors = {
    blue: 'from-blue-400 to-blue-600',
    green: 'from-green-400 to-green-600',
    purple: 'from-purple-400 to-purple-600',
    yellow: 'from-yellow-400 to-yellow-600',
    red: 'from-red-400 to-red-600'
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center shadow-md`}>
          <Icon icon={icon} size="lg" className="text-white" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">{label}</p>
          <p className="text-2xl font-black text-slate-900">{value}</p>
        </div>
      </div>
  </div>
);
};

export default Dashboard;
