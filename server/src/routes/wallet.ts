import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Get Wallet Balance
router.get('/', authenticateToken, async (req: any, res: any) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { walletBalance: true }
    });
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch wallet' });
  }
});

// Add Money to Wallet (Mock Payment)
router.post('/add', authenticateToken, async (req: any, res: any) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }

    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        walletBalance: { increment: amount }
      }
    });

    res.json({ message: 'Money added to wallet successfully', balance: user.walletBalance });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add money to wallet' });
  }
});

export default router;
