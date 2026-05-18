import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, isAdmin } from '../middleware/auth';
import { emitToAll } from '../services/socketService';

const router = Router();
const prisma = new PrismaClient();

// Get Admin Stats
router.get('/stats', authenticateToken, isAdmin, async (req, res) => {
  try {
    const totalBookings = await prisma.booking.count();
    const totalUsers = await prisma.user.count();
    const totalCars = await prisma.car.count();
    
    const bookings = await prisma.booking.findMany();
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayBookings = await prisma.booking.count({
      where: { createdAt: { gte: today } }
    });

    res.json({
      totalBookings,
      totalUsers,
      totalCars,
      totalRevenue,
      todayBookings,
      // Status breakdown
      statusStats: {
        pending: await prisma.booking.count({ where: { status: 'PENDING' } }),
        confirmed: await prisma.booking.count({ where: { status: 'CONFIRMED' } }),
        active: await prisma.booking.count({ where: { status: 'ACTIVE' } }),
        completed: await prisma.booking.count({ where: { status: 'COMPLETED' } }),
        cancelled: await prisma.booking.count({ where: { status: 'CANCELLED' } }),
      },
      // Fleet Health
      fleetHealth: {
        totalMileage: (await prisma.car.aggregate({ _sum: { odometer: true } }))._sum.odometer || 0,
        needsService: await prisma.car.count({
          where: {
            OR: [
              { odometer: { gte: 5000 } }, // Simple threshold for demo
              { available: false } // Include cars in workshop
            ]
          }
        })
      },
      // Chart Data: Last 7 days
      chartData: await (async () => {
        const data = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          d.setHours(0, 0, 0, 0);
          const nextD = new Date(d);
          nextD.setDate(nextD.getDate() + 1);

          const count = await prisma.booking.count({
            where: { createdAt: { gte: d, lt: nextD } }
          });

          const dayRevenue = await prisma.booking.aggregate({
            _sum: { totalAmount: true },
            where: { createdAt: { gte: d, lt: nextD }, status: 'COMPLETED' }
          });

          data.push({
            name: d.toLocaleDateString('en-US', { weekday: 'short' }),
            bookings: count,
            revenue: dayRevenue._sum.totalAmount || 0
          });
        }
        return data;
      })()
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
});

// Get All Bookings for Admin
router.get('/bookings', authenticateToken, isAdmin, async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { car: true, user: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// Update Booking Status
router.patch('/bookings/:id/status', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { status, driverId } = req.body;
    const booking = await prisma.booking.update({
      where: { id: req.params.id },
      data: { 
        status,
        driverId: driverId || undefined
      }
    });

    // If a driver was assigned, update driver status
    if (driverId && status === 'CONFIRMED') {
      await prisma.driver.update({
        where: { id: driverId },
        data: { status: 'ON_TRIP' }
      });
    }
    
    // Emit real-time update
    emitToAll('car:status_updated', { id: booking.carId });

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error updating booking status' });
  }
});

export default router;
