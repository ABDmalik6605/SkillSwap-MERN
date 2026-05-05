import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import useAuth from './useAuth.js';

const useSocket = () => {
  const socketRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return undefined;
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000');
    socket.emit('join', user.id);
    socketRef.current = socket;
    return () => socket.disconnect();
  }, [user]);

  return socketRef;
};

export default useSocket;
