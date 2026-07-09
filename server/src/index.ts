import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { initSocket } from './services/socketService';
import authRoutes from './routes/auth';
import carRoutes from './routes/cars';
import bookingRoutes from './routes/bookings';
import paymentRoutes from './routes/payments';
import adminRoutes from './routes/admin';
import notificationRoutes from './routes/notifications';
import maintenanceRoutes from './routes/maintenance';
import driverRoutes from './routes/drivers';
import promoRoutes from './routes/promos';
import walletRoutes from './routes/wallet';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const port = process.env.PORT || 5000;

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.get('/', (_req, res) => {
  res.json({ message: 'DesiRent API is running!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/promos', promoRoutes);
app.use('/api/wallet', walletRoutes);

// Error Handling
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

if (process.env.NODE_ENV !== 'test') {
  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

export { app };
