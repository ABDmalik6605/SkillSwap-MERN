import Booking from '../models/Booking.js';
import SwapRequest from '../models/SwapRequest.js';

export const listBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate({ path: 'request', populate: ['fromUser', 'toUser'] })
      .sort('confirmedSchedule');
    const mine = bookings.filter((booking) =>
      [booking.request?.fromUser?._id?.toString(), booking.request?.toUser?._id?.toString()].includes(
        req.user._id.toString()
      )
    );
    res.json(mine);
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req, res, next) => {
  try {
    const request = await SwapRequest.findById(req.body.request);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

export const completeBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { isCompleted: true },
      { new: true }
    );
    res.json(booking);
  } catch (error) {
    next(error);
  }
};
