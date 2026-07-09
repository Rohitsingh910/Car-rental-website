import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
// 1. Importing your middleware here
import { authenticateToken } from '../middleware/auth'; 

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-very-secure-secret';

// Register (Public Route - No middleware)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'USER'
      }
    });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name, role: user.role } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login (Public Route - No middleware)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: user.id, email: user.email, name: user.name, role: user.role } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Driver Login
router.post('/driver-login', async (req: any, res: any) => {
  try {
    const { phone, password } = req.body;

    const driver = await prisma.driver.findFirst({ where: { phone } });
    if (!driver) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (driver.status === 'INACTIVE') {
      return res.status(403).json({ message: 'Driver account is inactive' });
    }

    const token = jwt.sign({ id: driver.id, role: 'DRIVER' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ 
      token, 
      user: { id: driver.id, phone: driver.phone, name: driver.name, role: 'DRIVER' } 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get User Profile (Protected Route - Uses authenticateToken)
router.get('/me', authenticateToken, async (req: any, res) => {
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, phone: true, role: true, licenseNumber: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

// Update User Profile (Protected Route - Uses authenticateToken)
router.put('/profile', authenticateToken, async (req: any, res) => {
  try {
    const { name, phone, licenseNumber, avatar } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone, licenseNumber, avatar },
      select: { 
        id: true, email: true, name: true, phone: true, 
        role: true, licenseNumber: true, avatar: true 
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router;