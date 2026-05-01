import CreditTransaction from '../models/CreditTransaction.js';

/**
 * Get current user's credit balance + transaction history
 * GET /api/credits
 */
export const getCredits = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const transactions = await CreditTransaction.find({ user: userId })
      .sort('-createdAt')
      .populate('relatedBooking', 'confirmedSchedule');

    // Current balance is the balance of the latest transaction (or 0)
    const balance = transactions.length > 0 ? transactions[0].balance : 0;
    res.json({ balance, transactions });
  } catch (err) {
    next(err);
  }
};

/**
 * Add a manual credit or debit entry (for testing / admin purposes)
 * POST /api/credits
 */
export const addTransaction = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { type, amount, description, relatedBooking } = req.body;

    // Get current balance
    const latest = await CreditTransaction.findOne({ user: userId }).sort('-createdAt');
    const currentBalance = latest ? latest.balance : 0;

    const newBalance =
      type === 'credit' ? currentBalance + amount : currentBalance - amount;

    if (newBalance < 0) {
      res.status(400);
      throw new Error('Insufficient skill credits');
    }

    const tx = await CreditTransaction.create({
      user: userId,
      type,
      amount,
      description,
      relatedBooking: relatedBooking || null,
      balance: newBalance
    });

    res.status(201).json(tx);
  } catch (err) {
    next(err);
  }
};
