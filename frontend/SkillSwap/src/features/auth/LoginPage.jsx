import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { loginUser } from './authSlice.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import toast from 'react-hot-toast';
import { Icons, Icon } from '../../utils/icons.jsx';
import '../../index.css';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required()
});

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => ({ isAuthenticated: Boolean(state.auth.token) }));
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error?.message || 'Invalid credentials');
    }
  };

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center py-8 sm:py-12 px-4">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 bg-gradient-to-br from-brand-400 to-brand-600 rounded-3xl flex items-center justify-center shadow-2xl animate-bounce-slow">
            <Icon icon={Icons.sparklesSolid} size="3xl" className="text-white" />
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black gradient-text text-glow mb-2 sm:mb-3">Welcome Back!</h2>
          <p className="text-base sm:text-lg lg:text-xl text-white font-semibold drop-shadow-lg">Continue your learning journey</p>
        </div>
        <div className="glass rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 sm:space-y-6 border-2 sm:border-4 border-white/40 neon-border glass-card">
          <form className="space-y-4 sm:space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <Input
             className="w-full p-3 rounded-xl border border-white/30 bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-150"
             placeholder="Email" 
             type="email" {...register('email')} 
             error={errors.email?.message} />

            <Input 
            className="w-full p-3 rounded-xl border border-white/30 bg-white/10 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 transition duration-150"
            placeholder="Password" 
            type="password" {...register('password')} 
            error={errors.password?.message} />
            <Button type="submit" className="w-full btn-gradient text-base sm:text-lg py-3 sm:py-4 flex items-center gap-2 justify-center" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Icon icon={Icons.clock} size="md" className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Icon icon={Icons.rocket} size="md" />
                  Continue
                </>
              )}
            </Button>
          </form>
          <p className="text-center text-xs sm:text-sm font-semibold text-slate-700">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-purple-600 hover:text-purple-700 font-bold underline">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
