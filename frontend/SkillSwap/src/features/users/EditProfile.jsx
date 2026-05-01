import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import SkillsManager from '../../components/forms/SkillsManager.jsx';
import { updateProfileAsync } from './usersSlice.js';
import toast from 'react-hot-toast';

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { register, handleSubmit, reset, control } = useForm({ defaultValues: user });
  const values = useWatch({ control });
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);

  useEffect(() => {
    if (user) {
      reset(user);
      setSkillsToTeach(user.skillsToTeach || []);
      setSkillsToLearn(user.skillsToLearn || []);
    }
  }, [user, reset]);

  const onSubmit = async (values) => {
    try {
      // Only send fields that can be updated
      const payload = {
        name: values.name,
        bio: values.bio,
        avatarUrl: values.avatarUrl,
        location: values.location,
        whatsappNumber: values.whatsappNumber,
        skillsToTeach,
        skillsToLearn
      };
      console.log('EditProfile: Submitting payload:', payload);
      console.log('EditProfile: Skills to teach:', skillsToTeach);
      console.log('EditProfile: Skills to learn:', skillsToLearn);
      
      await dispatch(updateProfileAsync(payload)).unwrap();
      toast.success('Profile updated! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('EditProfile: Update failed:', error);
      console.error('EditProfile: Full error object:', JSON.stringify(error, null, 2));
      
      // Show detailed error message
      let errorMessage = 'Failed to update profile';
      
      if (error.details && Array.isArray(error.details)) {
        // Joi validation errors
        console.error('EditProfile: Validation details:', error.details);
        errorMessage = error.details.map(d => `${d.path?.join('.')} - ${d.message}`).join('\n');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      console.error('EditProfile: Error message:', errorMessage);
      toast.error(errorMessage);
    }
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div className="glass rounded-3xl p-6 shadow-2xl">
        <h2 className="text-4xl font-bold gradient-text">✏️ Edit Profile</h2>
        <p className="text-slate-700 mt-2">Update your information and skills</p>
      </div>
      
      <form className="glass rounded-3xl p-8 space-y-6 shadow-2xl" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="flex flex-col items-center gap-4 pb-4 border-b border-purple-100">
            <div className="relative group">
              <img 
                src={values?.avatarUrl || 'https://ui-avatars.com/api/?name=' + (values?.name || 'User') + '&background=random&size=128'} 
                alt="Profile Preview" 
                className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
              />
              <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Icon icon={Icons.edit} size="xl" className="text-white" />
              </div>
            </div>
            <div className="w-full space-y-2">
              <p className="text-sm font-bold text-slate-800 text-center">Profile Picture URL</p>
              <Input 
                {...register('avatarUrl')} 
                placeholder="https://example.com/photo.jpg" 
                className="text-center"
              />
              <div className="flex justify-center gap-2 flex-wrap">
                {['https://i.pravatar.cc/150?u=1', 'https://i.pravatar.cc/150?u=2', 'https://i.pravatar.cc/150?u=3', 'https://i.pravatar.cc/150?u=4'].map(url => (
                  <button 
                    key={url}
                    type="button"
                    onClick={() => reset({ ...user, avatarUrl: url })}
                    className="w-8 h-8 rounded-full border border-white shadow-sm overflow-hidden hover:scale-110 transition-transform"
                  >
                    <img src={url} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Input label="Name" {...register('name')} />
          <Input label="Location" {...register('location')} placeholder="e.g., New York, USA" />
          <Input label="WhatsApp Number" {...register('whatsappNumber')} placeholder="15551234567" />
          
          <label className="flex flex-col gap-2 text-sm">
            <span className="font-bold text-slate-800">Bio</span>
            <textarea
              {...register('bio')}
              className="border-3 border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-500 bg-white shadow-md hover:shadow-lg transition-all font-medium"
              rows={4}
              placeholder="Share your learning story and what makes you unique..."
            />
          </label>
        </div>
        
        <div className="border-t-2 border-purple-200 pt-6">
          <h3 className="text-xl font-bold gradient-text mb-4">🎯 Skills Management</h3>
          <div className="space-y-6">
            <SkillsManager
              label="What can you teach?"
              skills={skillsToTeach}
              onChange={setSkillsToTeach}
              placeholder="e.g., JavaScript, Guitar, Spanish"
            />
            
            <SkillsManager
              label="What do you want to learn?"
              skills={skillsToLearn}
              onChange={setSkillsToLearn}
              placeholder="e.g., Python, Piano, French"
            />
          </div>
        </div>
        
        <div className="flex gap-4 pt-4">
          <Button type="submit" className="flex-1 btn-gradient text-lg py-3">
            💾 Save Changes
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={() => navigate('/dashboard')}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
