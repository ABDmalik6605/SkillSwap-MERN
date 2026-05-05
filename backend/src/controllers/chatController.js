import Message from '../models/Message.js';

export const listMessages = async (req, res, next) => {
  try {
    const { partnerId } = req.params;
    const messages = await Message.find({
      $or: [
        { from: req.user._id, to: partnerId },
        { from: partnerId, to: req.user._id }
      ]
    }).sort('createdAt');
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req, res, next) => {
  try {
    const message = await Message.create({
      from: req.user._id,
      to: req.body.to,
      text: req.body.text
    });
    const io = req.app.get('io');
    if (io) {
      io.to(req.body.to).emit('chat:message', message);
      io.to(req.user._id.toString()).emit('chat:message', message);
    }
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};
