import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HeroSection from './HeroSection';

describe('HeroSection', () => {
  it('renders the heading correctly', () => {
    const mockOnSearch = vi.fn();
    render(<HeroSection onSearch={mockOnSearch} />);
    
    // Check if main heading is present
    expect(screen.getByText(/Drive Your Way/i)).toBeInTheDocument();
    expect(screen.getByText(/Across India/i)).toBeInTheDocument();
  });

  it('calls onSearch when the Go button is clicked with destination', () => {
    const mockOnSearch = vi.fn();
    render(<HeroSection onSearch={mockOnSearch} />);
    
    // Find the destination input and enter a value
    const destinationInput = screen.getByPlaceholderText(/Delhi, Agra, Jaipur.../i);
    fireEvent.change(destinationInput, { target: { value: 'Agra' } });
    
    // Click the Go (Search) button
    const searchButton = screen.getByRole('button', { name: /Go/i });
    fireEvent.click(searchButton);
    
    // Ensure onSearch was called
    expect(mockOnSearch).toHaveBeenCalled();
    expect(mockOnSearch).toHaveBeenCalledWith('Noida, Sector 37', 'Agra', '', 'self-drive');
  });
});
