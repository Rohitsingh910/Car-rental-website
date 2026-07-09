import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';

let io: Server | null = null;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join a specific booking room to get driver updates
    socket.on('join_booking_room', (bookingId: string) => {
      socket.join(`booking_${bookingId}`);
      console.log(`Socket ${socket.id} joined room booking_${bookingId}`);
    });

    // Receive driver location from a driver app and broadcast to the room
    socket.on('update_driver_location', (data: { bookingId: string, lat: number, lng: number }) => {
      io?.to(`booking_${data.bookingId}`).emit('driver_location_update', { lat: data.lat, lng: data.lng });
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized!');
  }
  return io;
};

export const emitToAll = (event: string, data: any) => {
  if (io) {
    io.emit(event, data);
  }
};
