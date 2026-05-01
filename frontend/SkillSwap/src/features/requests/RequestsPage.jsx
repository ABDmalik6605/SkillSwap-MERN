import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Modal from '../../components/ui/Modal.jsx';
import toast from 'react-hot-toast';
import { fetchRequests, respondRequestAsync } from './requestsSlice.js';

const acceptSchema = yup.object({
  confirmedSchedule: yup.string().required('Select a date & time'),
  durationMinutes: yup
    .number()
    .typeError('Duration must be numeric')
    .min(15, 'Minimum 15 minutes')
    .max(240, 'Keep it under 4 hours')
    .required('Duration is required'),
  meetingType: yup.string().oneOf(['online', 'in-person']).required('Meeting type is required')
});

const RequestsPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.requests);
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id || user?._id;
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(acceptSchema),
    defaultValues: { confirmedSchedule: '', durationMinutes: 60, meetingType: 'online' }
  });

  useEffect(() => {
    dispatch(fetchRequests());
  }, [dispatch]);

  const openModal = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
    reset({ confirmedSchedule: '', durationMinutes: 60, meetingType: 'online' });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
    reset({ confirmedSchedule: '', durationMinutes: 60, meetingType: 'online' });
  };

  const handleAcceptSubmit = (values) => {
    if (!selectedRequest) return;
    dispatch(
      respondRequestAsync({
        id: selectedRequest._id,
        body: {
          status: 'accepted',
          confirmedSchedule: new Date(values.confirmedSchedule).toISOString(),
          meetingType: values.meetingType,
          durationMinutes: values.durationMinutes
        }
      })
    )
      .unwrap()
      .then(() => {
          toast.success('Request accepted! Booking created.');
        closeModal();
      })
      .catch(() => toast.error('Unable to update request'));
  };

  const handleDecline = (id) => {
    dispatch(respondRequestAsync({ id, body: { status: 'rejected' } }))
      .unwrap()
      .then(() => toast.success('Request declined.'))
      .catch(() => toast.error('Unable to update request'));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="glass rounded-2xl p-6 shadow-lg">
        <h2 className="text-3xl font-bold gradient-text">🤝 Swap Requests</h2>
        <p className="text-slate-600 mt-1">Manage incoming and outgoing requests</p>
      </div>
      
      {items.map((request) => {
        const isIncoming = request.toUser?._id === currentUserId || request.toUser === currentUserId;
        const isOutgoing = request.fromUser?._id === currentUserId || request.fromUser === currentUserId;
        const canRespond = isIncoming && request.status === 'pending';
        
        return (
          <div key={request._id} className="glass rounded-2xl p-6 space-y-4 shadow-lg card-hover">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{isIncoming ? '📥' : '📤'}</span>
                  <p className="font-bold text-xl text-slate-900">
                    {request.offeredSkill} ↔️ {request.requestedSkill}
          </p>
                </div>
                <p className="text-sm text-slate-600">
                  {isIncoming ? (
                    <>From: <span className="font-semibold">{request.fromUser?.name || 'Unknown'}</span></>
                  ) : (
                    <>To: <span className="font-semibold">{request.toUser?.name || 'Unknown'}</span></>
                  )}
                </p>
                {request.description && (
                  <p className="text-sm text-slate-500 mt-2 italic">&quot;{request.description}&quot;</p>
                )}
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                request.status === 'accepted' ? 'bg-green-100 text-green-700' :
                request.status === 'rejected' ? 'bg-red-100 text-red-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {request.status}
              </span>
            </div>
            
            {request.scheduleProposals?.length > 0 && (
              <div className="bg-brand-50 rounded-lg p-3 border border-brand-200">
                <p className="text-xs font-semibold text-brand-700 mb-2">📅 Proposed time slots:</p>
                <div className="space-y-1">
                  {request.scheduleProposals.map((slot, idx) => (
                    <p key={idx} className="text-sm text-slate-700">
                      • {new Date(slot.proposedTime).toLocaleString()}
                      {slot.note && <span className="text-slate-500 ml-2">({slot.note})</span>}
                    </p>
                  ))}
                </div>
              </div>
            )}
            
            {canRespond && (
              <div className="flex gap-3 pt-2">
                <Button onClick={() => openModal(request)} className="flex-1 btn-gradient">
                  ✅ Accept & Schedule
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleDecline(request._id)}
                  className="flex-1"
                >
                  ❌ Decline
            </Button>
              </div>
            )}
            
            {isOutgoing && request.status === 'pending' && (
              <p className="text-sm text-slate-500 italic">⏳ Waiting for response...</p>
            )}
          </div>
        );
      })}
      
      {items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-6xl mb-4">📭</p>
          <p className="text-xl text-slate-600">No requests yet. Start exploring!</p>
        </div>
      )}

      <Modal
        title={`Confirm schedule${selectedRequest ? ` with ${selectedRequest.fromUser?.name || 'your partner'}` : ''}`}
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        <form className="space-y-4" onSubmit={handleSubmit(handleAcceptSubmit)}>
          <Input
            type="datetime-local"
            label="Confirmed start"
            {...register('confirmedSchedule')}
            error={errors.confirmedSchedule?.message}
          />
          <Input
            type="number"
            label="Duration (minutes)"
            min={15}
            max={240}
            {...register('durationMinutes', { valueAsNumber: true })}
            error={errors.durationMinutes?.message}
          />
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-slate-600">Meeting type</span>
            <select
              className="border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              {...register('meetingType')}
            >
              <option value="online">Online</option>
              <option value="in-person">In person</option>
            </select>
            {errors.meetingType && <span className="text-xs text-red-500">{errors.meetingType.message}</span>}
          </label>
          <Button type="submit" className="w-full">
            Convert to booking
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default RequestsPage;
