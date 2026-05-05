import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Icons, Icon } from '../../utils/icons.jsx';
import { fetchNotifications, markAsReadAsync, markAllReadAsync } from './notificationsSlice.js';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector((state) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    dispatch(fetchNotifications());
    // Polling for new notifications every 30 seconds
    const interval = setInterval(() => dispatch(fetchNotifications()), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-white hover:bg-white/20 rounded-xl transition-all relative"
        aria-label="Notifications"
      >
        <Icon icon={Icons.inbox} size="lg" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-brand-600 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 sm:w-96 glass rounded-2xl shadow-2xl overflow-hidden z-50 border border-white/30 animate-scale-up">
          <div className="p-4 border-b border-white/20 flex justify-between items-center bg-white/10">
            <h3 className="font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={() => dispatch(markAllReadAsync())}
                className="text-xs text-brand-100 hover:text-white font-semibold underline"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="p-8 text-center text-white/60">
                <Icon icon={Icons.inbox} size="2xl" className="mx-auto mb-2 opacity-20" />
                <p className="text-sm font-medium">All caught up!</p>
              </div>
            ) : (
              items.map((notification) => (
                <div 
                  key={notification._id}
                  onClick={() => !notification.isRead && dispatch(markAsReadAsync(notification._id))}
                  className={`p-4 border-b border-white/10 hover:bg-white/10 transition-all cursor-pointer ${!notification.isRead ? 'bg-white/5' : 'opacity-60'}`}
                >
                  <div className="flex gap-3">
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center shadow-inner ${notification.isRead ? 'bg-slate-700' : 'bg-gradient-to-br from-brand-400 to-accent-500'}`}>
                      <Icon icon={Icons[notification.type] || Icons.sparkles} size="sm" className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold text-white truncate ${!notification.isRead ? '' : 'font-normal'}`}>
                        {notification.title}
                      </p>
                      <p className="text-xs text-white/80 line-clamp-2 mt-0.5">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-white/40 mt-1 font-medium">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-brand-400 mt-2 shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-3 text-center border-t border-white/20 bg-white/5">
            <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-xs font-bold text-white hover:underline">
              View all activity
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
