import mongoose from 'mongoose';

const creditTxSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['credit', 'debit'], required: true },
    amount: { type: Number, required: true, min: 1 },
    description: { type: String, required: true, trim: true },
    relatedBooking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
    balance: { type: Number, required: true } // running balance after this tx
  },
  { timestamps: true }
);

const CreditTransaction = mongoose.model('CreditTransaction', creditTxSchema);

export default CreditTransaction;
