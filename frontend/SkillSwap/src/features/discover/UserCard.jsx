import toast from 'react-hot-toast';
import Button from '../../components/ui/Button.jsx';
import Rating from '../../components/ui/Rating.jsx';
import SkillTag from '../../components/forms/SkillTag.jsx';
import useAuth from '../../hooks/useAuth.js';
import { Icons, Icon } from '../../utils/icons.jsx';

const UserCard = ({ user, onRequestSwap }) => {
  const { isAuthenticated } = useAuth();

  const handleOpenModal = () => {
    console.log('UserCard: Request Swap clicked');
    console.log('UserCard: isAuthenticated:', isAuthenticated);
    console.log('UserCard: onRequestSwap:', typeof onRequestSwap);
    
    if (!isAuthenticated) {
      toast.error('Log in to request a swap.');
      return;
    }
    
    console.log('UserCard: Calling onRequestSwap()');
    onRequestSwap();
  };

  const avatarColors = [
    'from-blue-400 to-cyan-500',
    'from-purple-400 to-pink-500',
    'from-emerald-400 to-teal-500',
    'from-orange-400 to-amber-500',
    'from-rose-400 to-pink-500',
  ];
  const avatarColor = avatarColors[Math.abs(user.name?.charCodeAt(0) || 0) % avatarColors.length];

  return (
    <div className="glass rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-xl card-hover border-2 border-white/40 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -top-10 -right-10 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-300/30 to-pink-300/30 rounded-full blur-2xl"></div>
      
      <div className="flex flex-col sm:flex-row items-start justify-between relative z-10 gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg transform hover:rotate-6 transition-transform flex-shrink-0`}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg sm:text-xl font-bold text-slate-900 truncate">{user.name}</p>
            <p className="text-xs sm:text-sm text-slate-600 flex items-center gap-1 font-medium">
              <Icon icon={Icons.location} size="sm" />
              {user.location || 'Remote'}
            </p>
            {user.matchScore > 0 && (
              <p className="text-xs text-purple-600 font-semibold mt-1 flex items-center gap-1">
                <Icon icon={Icons.sparklesSolid} size="sm" />
                {user.matchScore}% Match
              </p>
            )}
          </div>
        </div>
        <div className="self-end sm:self-auto">
          <Rating value={user.rating || 0} />
        </div>
      </div>
      
      <div className="flex gap-2 flex-wrap">
        {user.skillsToTeach?.slice(0, 4).map((skill) => (
          <SkillTag key={skill.name} label={skill.name} />
        ))}
        {user.skillsToTeach?.length > 4 && (
          <span className="px-2 sm:px-3 py-1 sm:py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
            +{user.skillsToTeach.length - 4} more
          </span>
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
        <Button className="flex-1 btn-gradient text-white font-bold text-sm sm:text-base flex items-center gap-2 justify-center" onClick={handleOpenModal}>
          <Icon icon={Icons.handshake} size="md" />
          Request Swap
        </Button>
        {user.whatsappNumber && (
          <a
            href={`https://wa.me/${user.whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="flex-1"
          >
            <Button variant="success" className="w-full font-bold text-sm sm:text-base flex items-center gap-2 justify-center">
              <Icon icon={Icons.chat} size="md" />
              WhatsApp
            </Button>
          </a>
        )}
      </div>

    </div>
  );
};

export default UserCard;
