import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo } from 'react';
import { fetchBookings } from '../bookings/bookingsSlice.js';
import { fetchMessages, setActivePartner } from './chatSlice.js';
import ChatWindow from './ChatWindow.jsx';
import { Icons, Icon } from '../../utils/icons.jsx';

const ChatList = () => {
  const dispatch = useDispatch();
  const { items: bookings } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);
  const { activePartner } = useSelector((state) => state.chat);
  const currentUserId = user?.id || user?._id;

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  // Get unique list of users from accepted bookings
  const connectedUsers = useMemo(() => {
    const userMap = new Map();
    bookings.forEach((booking) => {
      if (!booking.request) return;
      const { fromUser, toUser } = booking.request;
      
      // Add the other user (not current user)
      if (fromUser?._id === currentUserId || fromUser === currentUserId) {
        if (toUser && toUser._id) {
          userMap.set(toUser._id, toUser);
        }
      } else if (toUser?._id === currentUserId || toUser === currentUserId) {
        if (fromUser && fromUser._id) {
          userMap.set(fromUser._id, fromUser);
        }
      }
    });
    return Array.from(userMap.values());
  }, [bookings, currentUserId]);

  const handleSelect = (id) => {
    dispatch(setActivePartner(id));
    dispatch(fetchMessages(id));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 animate-fade-in">
      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 shadow-lg">
        <h3 className="font-bold text-base sm:text-lg gradient-text flex items-center gap-2">
          <Icon icon={Icons.users} size="lg" />
          Connected Users
        </h3>
        <p className="text-xs text-slate-500">Chat with users you have bookings with</p>
        <div className="space-y-2 max-h-[300px] md:max-h-[500px] overflow-y-auto">
          {connectedUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => handleSelect(user._id)}
              className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all ${
                activePartner === user._id
                  ? 'bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg'
                  : 'hover:bg-brand-50 hover:shadow-md'
              }`}
            >
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm sm:text-base truncate ${activePartner === user._id ? 'text-white' : 'text-slate-900'}`}>
                    {user.name}
                  </p>
                  <p className={`text-xs ${activePartner === user._id ? 'text-white/80' : 'text-slate-500'}`}>
                    {user.location || 'Remote'}
                  </p>
                </div>
              </div>
            </button>
          ))}
          {connectedUsers.length === 0 && (
            <div className="text-center py-6 sm:py-8">
              <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
                <Icon icon={Icons.users} size="2xl" className="text-slate-500" />
              </div>
              <p className="text-xs sm:text-sm text-slate-500">No connections yet. Complete a booking to chat!</p>
            </div>
          )}
        </div>
      </div>
      <div className="md:col-span-2">
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatList;
