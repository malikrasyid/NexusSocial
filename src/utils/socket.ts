import { io, Socket } from 'socket.io-client';
import { API_URL } from '../api/client';

export let socket: Socket;

export const initSocket = (token: string) => {
  // If a socket already exists, disconnect it first to prevent duplicates
  if (socket) {
    socket.disconnect();
  }

  // Initialize the socket and pass the JWT token in the headers
  socket = io(API_URL, {
    extraHeaders: {
      Authorization: `Bearer ${token}`
    },
    // Prevent auto-connect if you want manual control, but true is fine here
    autoConnect: true, 
  });

  socket.on('connect', () => {
    console.log('🟢 Global Socket Connected:', socket.id);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Global Socket Disconnected');
  });

  socket.on('connect_error', (err) => {
    console.log('⚠️ Socket Connection Error:', err.message);
  });
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};