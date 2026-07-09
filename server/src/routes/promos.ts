import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Validate Promo Code
router.post('/validate', authenticateToken, async (req: any, res: any) => {
  try {
    const { code, amount } = req.body;
    
    if (!code) {
      return res.status(400).json({ message: 'Promo code is required' });
    }

    const promo = await prisma.promoCode.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!promo) {
      return res.status(404).json({ message: 'Invalid promo code' });
    }

    if (!promo.active) {
      return res.status(400).json({ message: 'Promo code is inactive' });
    }

    if (promo.used >= promo.maxUse) {
      return res.status(400).json({ message: 'Promo code usage limit reached' });
    }

    let discountValue = 0;
    if (promo.type === 'PERCENTAGE') {
      discountValue = (amount * promo.discount) / 100;
    } else {
      discountValue = promo.discount;
    }

    // Ensure discount doesn't exceed amount
    discountValue = Math.min(discountValue, amount);

    res.json({
      valid: true,
      code: promo.code,
      discount: discountValue,
      type: promo.type,
      message: 'Promo code applied successfully'
    });
  } catch (error) {
    console.error('Validate promo error:', error);
    res.status(500).json({ message: 'Failed to validate promo code' });
  }
});

// Admin: Create Promo Code
router.post('/', authenticateToken, async (req: any, res: any) => {
  try {
    if (req.user.role !== 'ADMIN') return res.status(403).json({ message: 'Forbidden' });
    
    const { code, discount, type, maxUse } = req.body;
    
    const promo = await prisma.promoCode.create({
      data: {
        code: code.toUpperCase(),
        discount,
        type: type || 'FLAT',
        maxUse: maxUse || 100
      }
    });
    
    res.status(201).json(promo);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create promo' });
  }
});

export default router;
