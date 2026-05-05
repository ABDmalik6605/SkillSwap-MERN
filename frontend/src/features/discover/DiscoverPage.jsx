import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../users/usersSlice.js';
import { setSearch, setLocation } from './discoverSlice.js';
import useDebouncedSearch from '../../hooks/useDebouncedSearch.js';
import UserCard from './UserCard.jsx';
import RequestSwapModal from './RequestSwapModal.jsx';
import Input from '../../components/ui/Input.jsx';
import { Icons, Icon } from '../../utils/icons.jsx';

const DiscoverPage = () => {
  const dispatch = useDispatch();
  const { search, location } = useSelector((state) => state.discover);
  const { list } = useSelector((state) => state.users);
  const debounced = useDebouncedSearch(search, 300);
  const [skillFilter, setSkillFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useSelector((state) => state.auth);
  const userId = user?._id;

  const handleRequestSwap = (user) => {
    console.log('DiscoverPage: handleRequestSwap called with user:', user);
    setSelectedUser(user);
  };

  useEffect(() => {
    dispatch(fetchUsers({ q: debounced, location, skill: skillFilter }));
  }, [dispatch, debounced, location, skillFilter]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-6 sm:space-y-8 animate-fade-in">
      <div className="text-center space-y-2 sm:space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text text-glow flex items-center justify-center gap-3">
          Discover Mentors
          <Icon icon={Icons.sparklesSolid} size="xl" className="text-yellow-500" />
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-slate-700 font-medium flex items-center justify-center gap-2">
          Find the perfect skill match and start learning
          <Icon icon={Icons.rocket} size="lg" className="text-brand-500" />
        </p>
      </div>
      
      <div className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          <div className="relative">
            <Input label="Search by name" value={search} onChange={(e) => dispatch(setSearch(e.target.value))} />
            <Icon icon={Icons.search} size="md" className="absolute right-3 top-9 text-slate-400" />
          </div>
          <div className="relative">
            <Input label="Location" value={location} onChange={(e) => dispatch(setLocation(e.target.value))} />
            <Icon icon={Icons.location} size="md" className="absolute right-3 top-9 text-slate-400" />
          </div>
          <div className="relative">
            <Input label="Skill" value={skillFilter} onChange={(e) => setSkillFilter(e.target.value)} />
            <Icon icon={Icons.trophy} size="md" className="absolute right-3 top-9 text-slate-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {list.map((user) => (
          user._id != userId && (
          <UserCard key={user._id} user={user} onRequestSwap={() => handleRequestSwap(user)} />
          )
        ))}
      </div>

      {/* Modal at page level */}
      {selectedUser && (
        <RequestSwapModal 
          user={selectedUser} 
          isOpen={!!selectedUser}
          onClose={() => {
            console.log('DiscoverPage: Closing modal');
            setSelectedUser(null);
          }} 
        />
      )}
      
      {list.length === 0 && (
        <div className="text-center py-8 sm:py-12">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center">
            <Icon icon={Icons.search} size="3xl" className="text-slate-500" />
          </div>
          <p className="text-base sm:text-lg lg:text-xl text-slate-600">No users found. Try adjusting your filters.</p>
        </div>
      )}
    </section>
  );
};

export default DiscoverPage;
