import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import SkillTag from '../../components/forms/SkillTag.jsx';
import { Icons, Icon } from '../../utils/icons.jsx';
import { fetchProfile } from './usersSlice.js';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { selected } = useSelector((state) => state.users);

  useEffect(() => {
    if (id) dispatch(fetchProfile(id));
  }, [dispatch, id]);

  if (!selected) return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">Loading Profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-10">
      {/* Banner & Header */}
      <div className="relative glass rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="h-40 bg-gradient-to-r from-brand-600 via-purple-600 to-accent-600" />
        <div className="px-8 pb-8 pt-0 -mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-6 relative z-10">
          <div className="relative group">
            <img 
              src={selected.avatarUrl || `https://ui-avatars.com/api/?name=${selected.name}&background=random&size=256`} 
              alt={selected.name}
              className="w-40 h-40 rounded-full border-8 border-white shadow-2xl object-cover bg-white"
            />
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full shadow-lg" title="Online" />
          </div>
          <div className="flex-1 text-center sm:text-left mb-2">
            <h2 className="text-4xl font-black text-slate-900 drop-shadow-sm">{selected.name}</h2>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2 text-slate-600 font-medium text-sm">
              <span className="flex items-center gap-1">
                <Icon icon={Icons.mapPin} size="sm" className="text-brand-500" />
                {selected.location || 'Global Citizen'}
              </span>
              <span className="flex items-center gap-1">
                <Icon icon={Icons.clock} size="sm" className="text-brand-500" />
                Member since {new Date(selected.createdAt).getFullYear()}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            {selected.whatsappNumber && (
              <Button
                as="a"
                href={`https://wa.me/${selected.whatsappNumber}`}
                target="_blank"
                rel="noreferrer"
                className="btn-gradient flex items-center gap-2 shadow-xl hover:scale-105 transition-all"
              >
                <Icon icon={Icons.chat} size="md" />
                WhatsApp
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* About & Stats */}
        <div className="space-y-6">
          <div className="glass rounded-3xl p-6 shadow-lg space-y-4">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-purple-100 pb-2">
              <Icon icon={Icons.user} size="md" className="text-brand-500" />
              About Me
            </h3>
            <p className="text-slate-700 leading-relaxed italic">
              &quot;{selected.bio || 'This user is busy learning and teaching amazing things on SkillSwap!'}&quot;
            </p>
          </div>
          
          <div className="glass rounded-3xl p-6 shadow-lg space-y-4 bg-gradient-to-br from-white/80 to-purple-50/50">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Icon icon={Icons.sparklesSolid} size="md" className="text-brand-500" />
              Platform Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white/40 rounded-2xl shadow-inner border border-white">
                <p className="text-2xl font-black text-brand-600">{selected.stats?.swapsCompleted || 0}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Swaps</p>
              </div>
              <div className="text-center p-3 bg-white/40 rounded-2xl shadow-inner border border-white">
                <p className="text-2xl font-black text-purple-600">{selected.stats?.hoursShared || 0}</p>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="md:col-span-2 space-y-6">
          <div className="glass rounded-[2rem] p-8 shadow-xl space-y-8">
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                    <Icon icon={Icons.lightbulb} size="lg" />
                  </div>
                  Willing to Teach
                </h3>
              </div>
              <div className="flex gap-3 flex-wrap">
                {selected.skillsToTeach?.length > 0 ? (
                  selected.skillsToTeach.map((skill) => (
                    <div key={skill.name} className="group relative">
                      <SkillTag label={`${skill.name}`} className="!py-2 !px-4 !text-base" />
                      <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-brand-500 text-white text-[10px] font-bold rounded-full shadow-md capitalize">
                        {skill.level}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 text-sm italic">No teaching skills listed yet.</p>
                )}
              </div>
            </section>

            <section className="space-y-4 border-t border-purple-100 pt-8">
              <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Icon icon={Icons.academicCap} size="lg" />
                </div>
                Eager to Learn
              </h3>
              <div className="flex gap-3 flex-wrap">
                {selected.skillsToLearn?.length > 0 ? (
                  selected.skillsToLearn.map((skill) => (
                    <SkillTag key={skill.name} label={skill.name} className="!bg-purple-50 !text-purple-700 !border-purple-200 !py-2 !px-4 !text-base" />
                  ))
                ) : (
                  <p className="text-slate-400 text-sm italic">No learning goals listed yet.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

