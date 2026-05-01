import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBookings, completeBookingAsync } from './bookingsSlice.js';
import Button from '../../components/ui/Button.jsx';
import ReviewPrompt from '../reviews/ReviewPrompt.jsx';

const BookingPage = () => {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.bookings);
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id || user?._id;

  useEffect(() => {
    dispatch(fetchBookings());
  }, [dispatch]);

  const resolvePartner = (booking) => {
    if (!booking.request || !currentUserId) return null;
    const { fromUser, toUser } = booking.request;
    if (fromUser?._id === currentUserId || fromUser === currentUserId) {
      return toUser;
    }
    return fromUser;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Bookings</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {items.map((booking) => {
          const partner = resolvePartner(booking);
          return (
            <div key={booking._id} className="bg-white border border-slate-100 rounded-xl p-4 space-y-4">
            <div>
                <p className="text-sm text-slate-500 capitalize">
                  {booking.meetingType} • {partner?.name || 'Partner'}
              </p>
                <p className="text-lg font-semibold">{new Date(booking.confirmedSchedule).toLocaleString()}</p>
            </div>
            <Button
              variant={booking.isCompleted ? 'secondary' : 'primary'}
                disabled={booking.isCompleted}
              onClick={() => dispatch(completeBookingAsync(booking._id))}
            >
              {booking.isCompleted ? 'Completed' : 'Mark complete'}
            </Button>
              {booking.isCompleted && partner && (
                <div className="border-t border-slate-100 pt-3">
                  <p className="text-sm font-semibold mb-2">Leave a review for {partner.name}</p>
                  <ReviewPrompt booking={booking} partner={partner} />
                </div>
              )}
          </div>
          );
        })}
      </div>
      {items.length === 0 && <p className="text-slate-500">No bookings scheduled.</p>}
    </div>
  );
};

export default BookingPage;
