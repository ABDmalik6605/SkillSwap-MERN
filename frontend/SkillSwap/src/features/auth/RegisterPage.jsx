import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { registerUser } from './authSlice.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import SkillsManager from '../../components/forms/SkillsManager.jsx';
import toast from 'react-hot-toast';
import { Icons, Icon } from '../../utils/icons.jsx';
import '../../index.css';

const schema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
  whatsappNumber: yup.string().matches(/^[0-9]+$/, 'Numbers only').optional()
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => ({ isAuthenticated: Boolean(state.auth.token) }));
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: yupResolver(schema) });

  // Debug: Log when skills change
  useEffect(() => {
    console.log('RegisterPage: skillsToTeach updated:', skillsToTeach);
  }, [skillsToTeach]);

  useEffect(() => {
    console.log('RegisterPage: skillsToLearn updated:', skillsToLearn);
  }, [skillsToLearn]);

  const onSubmit = async (values) => {
    try {
      const payload = {
        ...values,
        skillsToTeach,
        skillsToLearn
      };
      console.log('RegisterPage: Submitting with skills:', {
        skillsToTeach,
        skillsToLearn,
        fullPayload: payload
      });
      console.log('authApi: Register payload:', payload);
      await dispatch(registerUser(payload)).unwrap();
      toast.success('Welcome to SkillSwap! 🎉');
      navigate('/dashboard');
    } catch (error) {
      console.error('RegisterPage: Registration error:', error);
      toast.error(error?.message || 'Registration failed');
    }
  };

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (<div className="min-h-screen w-full flex items-center justify-center py-8 sm:py-12 px-4">
    <div className="w-full max-w-5xl space-y-8 animate-fade-in">
  
      {/* Header */}
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-slow">
          <Icon icon={Icons.fireSolid} size="3xl" className="text-white" />
        </div>
        <h2 className="text-4xl lg:text-5xl font-black gradient-text text-glow mb-3">
          Join SkillSwap
        </h2>
        <p className="text-lg lg:text-xl text-white font-semibold drop-shadow-lg flex items-center justify-center gap-2">
          Start trading skills with peers worldwide
          <Icon icon={Icons.globe} size="lg" className="text-white" />
        </p>
      </div>
  
      {/* FORM GRID (THIS FIXES THE LAYOUT) */}
      <form
        className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Left card */}
        <div className="glass rounded-3xl shadow-2xl p-8 space-y-6 border-4 border-white/40 neon-border glass-card">
          <Input 
          className="w-full p-3 rounded-xl border border-white/30 bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-150"
          placeholder="Full Name" {...register('name')} error={errors.name?.message} />
          <Input 
          className="w-full p-3 rounded-xl border border-white/30 bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-150"
          placeholder="Email" type="email" {...register('email')} error={errors.email?.message} />
          <Input
          className="w-full p-3 rounded-xl border border-white/30 bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-150"
           placeholder="Password" type="password" {...register('password')} error={errors.password?.message} />
          <Input
          className="w-full p-3 rounded-xl border border-white/30 bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-150 text-white"
            placeholder="WhatsApp number (optional)"
            {...register('whatsappNumber')}
            error={errors.whatsappNumber?.message}
          />
        </div>
  
        {/* Right card */}
        <div className="glass rounded-3xl shadow-2xl p-8 space-y-6 border-4 border-white/40 neon-border  items-center gap-3 w-full flex flex-col justify-center glass-card">
          <div className="border-t-2 border-purple-200 pt-5">
            <h3 className="text-lg font-bold gradient-text mb-4 flex items-center gap-2">
              <Icon icon={Icons.trophy} size="lg" />
              Your Skills
            </h3>
  
            <SkillsManager
              className="w-full p-3 rounded-xl border border-white/30 bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-150 text-white"
              label="What can you teach?"
              skills={skillsToTeach}
              onChange={setSkillsToTeach}
              placeholder="e.g., JavaScript, Guitar, Spanish"
            />
          </div>
  
          <div className="border-t-2 border-purple-200 pt-5">
            <SkillsManager
              className="w-full p-3 rounded-xl border border-white/30 bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-150 text-white"
              label="What do you want to learn?"
              skills={skillsToLearn}
              onChange={setSkillsToLearn}
              placeholder="e.g., Python, Piano, French"
            />
          </div>
        </div>
  
        {/* Submit button spans full width */}
        <div className="lg:col-span-2">
          <Button
            type="submit"
            className="w-full btn-gradient text-lg py-4 flex items-center gap-2 justify-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Icon icon={Icons.clock} size="md" className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <Icon icon={Icons.rocket} size="md" />
                Sign up free
              </>
            )}
          </Button>
        </div>
      </form>
  
      <p className="text-center text-sm font-semibold text-slate-700">
        Already have an account?{' '}
        <Link to="/login" className="text-purple-600 hover:text-purple-700 font-bold underline">
          Log in
        </Link>
      </p>
    </div>
  </div>
  
  );
};

export default RegisterPage;
