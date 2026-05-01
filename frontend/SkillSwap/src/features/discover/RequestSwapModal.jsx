import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { createPortal } from 'react-dom';
import toast from 'react-hot-toast';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import { createRequestAsync } from '../requests/requestsSlice.js';
import { Icons, Icon } from '../../utils/icons.jsx';

const RequestSwapModal = ({ user, isOpen, onClose }) => {
  console.log('RequestSwapModal: Rendering');
  console.log('RequestSwapModal: user:', user);
  console.log('RequestSwapModal: isOpen:', isOpen);
  
  const dispatch = useDispatch();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: {
      offeredSkill: '',
      requestedSkill: '',
      description: '',
      proposedTime1: '',
      proposedTime2: '',
      meetingLink: ''
    }
  });

  useEffect(() => {
    if (isOpen && user) {
      reset({
        offeredSkill: user.skillsToLearn?.[0]?.name || '',
        requestedSkill: user.skillsToTeach?.[0]?.name || '',
        description: '',
        proposedTime1: '',
        proposedTime2: '',
        meetingLink: ''
      });
    }
  }, [isOpen, user, reset]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const onSubmit = (values) => {
    const scheduleProposals = [];
    if (values.proposedTime1) {
      scheduleProposals.push({
        proposedTime: new Date(values.proposedTime1).toISOString(),
        note: 'First preference'
      });
    }
    if (values.proposedTime2) {
      scheduleProposals.push({
        proposedTime: new Date(values.proposedTime2).toISOString(),
        note: 'Alternative time'
      });
    }

    dispatch(
      createRequestAsync({
        toUser: user._id,
        offeredSkill: values.offeredSkill || 'General mentoring',
        requestedSkill: values.requestedSkill || 'Knowledge share',
        description: values.description || 'Request from Discover page',
        scheduleProposals: scheduleProposals.length > 0 ? scheduleProposals : undefined,
        meetingLink: values.meetingLink || undefined
      })
    )
      .unwrap()
      .then(() => {
        toast.success('Request sent! We will notify you when accepted.');
        onClose();
        reset();
      })
      .catch(() => toast.error('Could not send request'));
  };

  if (!isOpen || !user) return null;

  const avatarColors = [
    'from-blue-400 to-cyan-500',
    'from-purple-400 to-pink-500',
    'from-emerald-400 to-teal-500',
    'from-orange-400 to-amber-500',
    'from-rose-400 to-pink-500',
  ];
  const avatarColor = avatarColors[Math.abs(user.name?.charCodeAt(0) || 0) % avatarColors.length];

  const modalContent = (
    <div 
      onClick={onClose}
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        zIndex: 99999,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',
          maxWidth: '512px',
          maxHeight: '90vh',
          overflow: 'auto',
          border: '2px solid rgba(255, 255, 255, 0.4)',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div style={{
          position: 'sticky',
          top: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(8px)',
          borderBottom: '2px solid rgb(233, 213, 255)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}>
          <h3 className="text-lg sm:text-xl font-bold gradient-text flex items-center gap-2">
            <Icon icon={Icons.sparklesSolid} size="md" className="text-purple-500" />
            Request Swap with {user.name}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-purple-100 rounded-full transition-all hover:scale-110 active:scale-95"
            aria-label="Close modal"
          >
            <Icon icon={Icons.xMark} size="lg" className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* User Info Banner */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${avatarColor} flex items-center justify-center text-white text-xl font-bold shadow-lg flex-shrink-0`}>
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-slate-900">{user.name}</p>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <Icon icon={Icons.mapPin} size="sm" />
                  {user.location || 'Remote'}
                </p>
              </div>
            </div>

            {/* Skills Section */}
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Icon icon={Icons.handRaised} size="md" className="text-purple-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <Input
                    label="What can you offer?"
                    placeholder="e.g., JavaScript, Guitar"
                    {...register('offeredSkill', { required: 'This field is required' })}
                    error={errors.offeredSkill?.message}
                  />
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <Icon icon={Icons.academicCap} size="md" className="text-blue-500 mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <Input
                    label="What do you want to learn?"
                    placeholder="e.g., Python, Piano"
                    {...register('requestedSkill', { required: 'This field is required' })}
                    error={errors.requestedSkill?.message}
                  />
                </div>
              </div>
            </div>
            
            {/* Message */}
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-bold text-slate-800 flex items-center gap-2">
                <Icon icon={Icons.chatBubbleLeftRight} size="sm" className="text-emerald-500" />
                Message (optional)
              </span>
              <textarea
                {...register('description')}
                className="border-3 border-purple-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-purple-400 focus:border-purple-500 bg-white shadow-md hover:shadow-lg transition-all font-medium"
                rows={3}
                placeholder="Tell them why you'd like to connect..."
              />
            </label>

            {/* Schedule Section */}
            <div className="border-t-2 border-purple-200 pt-4 space-y-3">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <Icon icon={Icons.calendarDays} size="md" className="text-orange-500" />
                Suggest Session Times (optional)
              </h4>
              
              <Input
                type="datetime-local"
                label="First preference"
                {...register('proposedTime1')}
              />
              
              <Input
                type="datetime-local"
                label="Alternative time"
                {...register('proposedTime2')}
              />
            </div>

            {/* Meeting Link */}
            <div className="flex items-start gap-2">
              <Icon icon={Icons.link} size="md" className="text-cyan-500 mt-7 flex-shrink-0" />
              <div className="flex-1">
                <Input
                  label="Meeting Link (optional)"
                  placeholder="e.g., Zoom, Google Meet, or location"
                  {...register('meetingLink')}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button type="submit" className="flex-1 btn-gradient flex items-center gap-2 justify-center text-base py-3">
                <Icon icon={Icons.paperAirplane} size="md" />
                Send Request
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1 py-3"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default RequestSwapModal;

