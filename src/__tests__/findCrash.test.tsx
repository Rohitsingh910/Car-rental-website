import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import BookingModal from '../components/BookingModal';
import { AuthProvider } from '../context/AuthContext';
import '@testing-library/jest-dom';
import { api } from '../services/api';
import { vi } from 'vitest';

// Mock api
vi.mock('../services/api', () => ({
  api: {
    createBooking: vi.fn()
  }
}));

const mockCar = {
  id: '1',
  name: 'Test Car',
  brand: 'Test',
  category: 'SUV',
  segment: 'Standard',
  transmission: 'Manual',
  fuel: 'Petrol',
  seats: 5,
  price: 2000,
  rating: 4.5,
  reviewsCount: 10,
  image: 'test.jpg'
};

const mockConfirmedBooking = {
  id: '1',
  bookingId: 'DR-123456',
  userId: '1',
  carId: '1',
  pickupDate: '2026-07-09T00:00:00.000Z',
  returnDate: '2026-07-10T00:00:00.000Z',
  pickupLocation: 'Loc A',
  dropLocation: 'Loc B',
  totalAmount: 2100,
  withDriver: false,
  status: 'PENDING',
  paymentStatus: 'PENDING',
  createdAt: '2026-07-09T00:00:00.000Z',
  updatedAt: '2026-07-09T00:00:00.000Z',
  car: mockCar
};

describe('BookingModal crash test', () => {
  it('should render step 4 without crashing', async () => {
    (api.createBooking as any).mockResolvedValue(mockConfirmedBooking);

    render(
      <AuthProvider>
        <BookingModal car={mockCar} onClose={() => {}} onOpenAuth={() => {}} showToast={() => {}} />
      </AuthProvider>
    );

    // Force step to 3
    fireEvent.click(screen.getByText(/Continue/i));
    fireEvent.click(screen.getByText(/Continue/i));

    // Wait for step 3
    await waitFor(() => expect(screen.getByText(/Pay at Pickup/i)).toBeInTheDocument());

    // Select cash
    fireEvent.click(screen.getByText(/Pay at Pickup/i));

    // Submit
    fireEvent.click(screen.getByText(/Pay ₹.* Now/i));

    // Wait for step 4 rendering
    await waitFor(() => expect(screen.getByText(/Booking Confirmed!/i)).toBeInTheDocument());
  });
});
