import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Icons, Icon } from '../../utils/icons.jsx';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: Icons.dashboard },
    { label: 'Requests', to: '/requests', icon: Icons.inbox },
    { label: 'Bookings', to: '/bookings', icon: Icons.calendar },
    { label: 'Chat', to: '/chat', icon: Icons.chat },
    { label: 'Credits', to: '/credits', icon: Icons.trophy },
    { label: 'Certificates', to: '/certificates', icon: Icons.academicCap },
    { label: 'Blog', to: '/blog', icon: Icons.lightbulb },
    { label: 'Contact', to: '/contact', icon: Icons.mapPin }
  ];

  if (user?.role === 'admin') {
    navItems.push({ label: 'Admin Panel', to: '/admin', icon: Icons.boltSolid });
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-3 bg-gradient-to-br from-brand-500 to-brand-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all"
        aria-label="Toggle menu"
      >
        <Icon icon={isOpen ? Icons.close : Icons.menu} size="lg" />
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          gradient-bg-alt min-h-screen w-64 p-6 space-y-6 shadow-2xl
          fixed lg:sticky top-0 z-40 transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="flex items-center justify-between">
          <h4 className="font-black text-white uppercase text-sm tracking-wider drop-shadow-lg">Navigation</h4>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white hover:bg-white/20 p-2 rounded-lg transition-all"
          >
            <Icon icon={Icons.close} size="md" />
          </button>
        </div>
    <nav className="flex flex-col gap-3">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
              onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
                `px-5 py-3 rounded-xl font-bold transition-all flex items-center gap-3 ${
                  isActive 
                    ? 'bg-white text-purple-600 shadow-xl scale-105 neon-border' 
                    : 'text-white hover:bg-white/20 hover:scale-105 hover:shadow-lg backdrop-blur-sm'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon icon={item.icon} size="md" className={isActive ? 'text-purple-600' : 'text-white'} />
          {item.label}
                </>
              )}
        </NavLink>
      ))}
    </nav>
  </aside>
    </>
);
};

export default Sidebar;
