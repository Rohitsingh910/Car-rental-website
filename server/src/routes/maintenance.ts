import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all maintenance records (Admin Only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const records = await prisma.maintenance.findMany({
      include: { car: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching maintenance records' });
  }
});

// Create maintenance record (Admin Only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { carId, serviceType, notes, cost } = req.body;
    
    // Create maintenance record
    const record = await prisma.maintenance.create({
      data: {
        carId,
        serviceType,
        notes,
        cost: cost ? parseFloat(cost) : null,
        status: 'IN_PROGRESS'
      }
    });

    // Update car availability to false
    await prisma.car.update({
      where: { id: carId },
      data: { available: false }
    });

    res.status(201).json(record);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating maintenance record' });
  }
});

// Complete maintenance (Admin Only)
router.patch('/:id/complete', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { cost, notes } = req.body;
    
    const record = await prisma.maintenance.update({
      where: { id: req.params.id },
      data: {
        status: 'COMPLETED',
        endDate: new Date(),
        cost: cost ? parseFloat(cost) : undefined,
        notes: notes || undefined
      }
    });

    // Make car available again
    await prisma.car.update({
      where: { id: record.carId },
      data: { available: true }
    });

    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error completing maintenance' });
  }
});

export default router;
