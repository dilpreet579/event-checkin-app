import { Server } from 'socket.io';

export function setupSocket(io: Server) {
  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    socket.on('joinEventRoom', (eventId: string) => {
      socket.join(eventId);
    });

    socket.on('leaveEventRoom', (eventId: string) => {
      socket.leave(eventId);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });
} 