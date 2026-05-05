import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'SwapRequest', required: true },
    confirmedSchedule: { type: Date, required: true },
    durationMinutes: { type: Number, default: 60 },
    meetingType: { type: String, enum: ['online', 'in-person'], default: 'online' },
    notes: String,
    isCompleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
