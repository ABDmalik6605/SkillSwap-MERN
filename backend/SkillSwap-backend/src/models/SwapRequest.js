import mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema(
  {
    proposedTime: { type: Date, required: true },
    note: String
  },
  { _id: false }
);

const swapRequestSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    offeredSkill: { type: String, required: true },
    requestedSkill: { type: String, required: true },
    description: { type: String },
    scheduleProposals: [scheduleSchema],
    meetingLink: { type: String },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed', 'rejected', 'cancelled'],
      default: 'pending'
    }
  },
  { timestamps: true }
);

const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);

export default SwapRequest;
