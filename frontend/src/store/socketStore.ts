import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface SocketState {
  socket: Socket | null;
  connect: () => void;
  disconnect: () => void;
}

export const useSocketStore = create<SocketState>((set) => ({
  socket: null,
  connect: () => {
    const socket = io('http://localhost:4000');
    set({ socket });
  },
  disconnect: () => {
    set({ socket: null });
  },
})); 