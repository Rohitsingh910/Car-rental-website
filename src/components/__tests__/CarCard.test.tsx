import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CarCard from './CarCard';

const mockCar = {
  id: '1',
  name: 'Maruti Suzuki Swift',
  brand: 'Maruti',
  category: 'Hatchback',
  segment: 'Standard',
  transmission: 'Manual',
  fuel: 'Petrol',
  seats: 5,
  price: 1500,
  image: 'test.jpg',
  available: true,
  rating: 4.5,
  reviewsCount: 10,
  odometer: 10000,
  lastServiceKm: 5000,
  nextServiceKm: 15000,
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('CarCard Component', () => {
  it('renders car details correctly', () => {
    render(<CarCard car={mockCar} onBook={() => {}} />);
    expect(screen.getByText('Maruti Suzuki Swift')).toBeDefined();
    expect(screen.getByText('₹1,500/day')).toBeDefined();
    expect(screen.getByText('Manual')).toBeDefined();
    expect(screen.getByText('Petrol')).toBeDefined();
  });
});
