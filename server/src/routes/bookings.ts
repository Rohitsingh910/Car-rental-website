import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
// 1. Importing your middleware here
import { authenticateToken } from '../middleware/auth';
import { sendBookingEmail, sendAdminAlert } from '../services/emailService';
import { sendBookingWhatsApp } from '../services/whatsappService';
import { emitToAll } from '../services/socketService';

const router = Router();
const prisma = new PrismaClient();

// Create Booking (Protected Route)
router.post('/', authenticateToken, async (req: any, res) => {
  try {
    const { 
      carId, pickupDate, returnDate, 
      pickupLocation, dropLocation, totalAmount, withDriver 
    } = req.body;
    const userId = req.user.id; 

    // Check if car is available
    const existingBookings = await prisma.booking.findMany({
      where: {
        carId,
        status: { not: 'CANCELLED' },
        OR: [
          {
            pickupDate: { lte: new Date(returnDate) },
            returnDate: { gte: new Date(pickupDate) }
          }
        ]
      }
    });

    if (existingBookings.length > 0) {
      return res.status(400).json({ message: 'Car is not available for selected dates' });
    }

    const bookingId = `DR-${Math.floor(100000 + Math.random() * 900000)}`;

    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        bookingId, userId, carId,
        pickupDate: new Date(pickupDate),
        returnDate: new Date(returnDate),
        pickupLocation, dropLocation, totalAmount, withDriver,
        status: 'PENDING',
        paymentStatus: 'PENDING'
      },
      include: { car: true, user: true }
    });

    // 3. Email & WhatsApp Notifications
    try {
      // Send User Email
      await sendBookingEmail(booking);
      
      // Send User WhatsApp
      if (booking.user.phone) {
        await sendBookingWhatsApp(booking);
      }

      // 4. Real-time Socket Update
      emitToAll('booking:new', booking);
    } catch (notifyError) {
      console.error('Non-critical notification error:', notifyError);
    }

    res.status(201).json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// Get User Bookings (Protected Route)
router.get('/my-bookings', authenticateToken, async (req: any, res) => {
  try {
    const userId = req.user.id;
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { car: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Cancel Booking (Protected Route)
router.patch('/:id/cancel', authenticateToken, async (req: any, res) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Only owner or admin can cancel
    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: 'CANCELLED' }
    });

    // Admin Alert for Cancellation
    if (updatedBooking) {
        console.log(`Admin Alert: Booking ${updatedBooking.bookingId} was cancelled.`);
    }

    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

export default router;