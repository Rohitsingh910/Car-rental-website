import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Get all drivers (Admin Only)
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching drivers' });
  }
});

// Create a driver (Admin Only)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, phone, email, licenseNo, avatar } = req.body;
    const driver = await prisma.driver.create({
      data: { name, phone, email, licenseNo, avatar }
    });
    res.status(201).json(driver);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating driver' });
  }
});

// Get available drivers (For booking assignment)
router.get('/available', authenticateToken, isAdmin, async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      where: { status: 'AVAILABLE' }
    });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching available drivers' });
  }
});

export default router;
