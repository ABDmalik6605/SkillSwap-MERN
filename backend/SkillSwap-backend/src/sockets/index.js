import { Server } from 'socket.io';
import Message from '../models/Message.js';

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: process.env.CORS_ORIGIN || '*' }
  });

  io.on('connection', (socket) => {
    socket.on('join', (userId) => {
      socket.join(userId);
    });

    socket.on('chat:message', async ({ from, to, text }) => {
      const message = await Message.create({ from, to, text });
      io.to(to).emit('chat:message', message);
      io.to(from).emit('chat:message', message);
    });
  });

  return io;
};
