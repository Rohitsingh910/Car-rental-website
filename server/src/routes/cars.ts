import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// 1. Get All Cars (with filters)
router.get('/', async (req, res) => {
  try {
    const { brand, category, minPrice, maxPrice, transmission, fuel } = req.query;

    const cars = await prisma.car.findMany({
      where: {
        available: true,
        brand: brand ? (brand as string) : undefined,
        category: category ? (category as string) : undefined,
        price: {
          gte: minPrice ? parseFloat(minPrice as string) : undefined,
          lte: maxPrice ? parseFloat(maxPrice as string) : undefined
        },
        transmission: transmission ? (transmission as string) : undefined,
        fuel: fuel ? (fuel as string) : undefined
      },
      orderBy: { createdAt: 'desc' }
    });

    const isWeekend = [0, 6].includes(new Date().getDay());
    const multiplier = isWeekend ? 1.15 : 1.0;

    const dynamicCars = cars.map(car => ({
      ...car,
      originalPrice: car.price,
      price: Math.round(car.price * multiplier),
      isDynamic: isWeekend
    }));

    res.json(dynamicCars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching cars' });
  }
});

// 2. Add New Car (Admin Only)
router.post('/add', authenticateToken, isAdmin, async (req: any, res) => {
  try {
    const { 
      name, brand, category, segment, transmission, 
      fuel, seats, price, mileage, image, color, year, description
    } = req.body;

    const car = await prisma.car.create({
      data: {
        name,
        brand,
        category,
        segment,
        transmission,
        fuel,
        seats: parseInt(seats),
        price: parseFloat(price),
        mileage,
        image,
        color,
        year: year ? parseInt(year) : undefined,
        description,
        available: true
      }
    });

    res.status(201).json(car);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding car' });
  }
});

// 3. Update Car Availability (Admin Only)
router.patch('/:id/availability', authenticateToken, isAdmin, async (req: any, res) => {
  try {
    const { isAvailable } = req.body;
    const car = await prisma.car.update({
      where: { id: req.params.id },
      data: { isAvailable }
    });

    res.json(car);
  } catch (error) {
    res.status(500).json({ message: 'Error updating car' });
  }
});

export default router;
