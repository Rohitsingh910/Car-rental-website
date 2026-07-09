const API_URL = 'http://localhost:5000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

export const api = {
  // Cars
  async getCars(params: Record<string, string> = {}) {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/cars?${query}`);
    if (!res.ok) throw new Error('Failed to fetch cars');
    return res.json();
  },

  // Bookings
  async createBooking(data: any) {
    const res = await fetch(`${API_URL}/bookings`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Booking failed');
    }
    return res.json();
  },

  async getMyBookings() {
    const res = await fetch(`${API_URL}/bookings/my-bookings`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return res.json();
  },

  async cancelBooking(id: string) {
    const res = await fetch(`${API_URL}/bookings/${id}/cancel`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to cancel booking');
    return res.json();
  },

  // Admin
  async getAdminBookings() {
    // We might need a specific admin route for this on the backend
    // For now, let's assume we use a general one or create it
    const res = await fetch(`${API_URL}/admin/bookings`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Unauthorized or failed to fetch');
    return res.json();
  },

  async getAdminStats() {
    const res = await fetch(`${API_URL}/admin/stats`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch stats');
    return res.json();
  },

  async updateBookingStatus(id: string, status: string, driverId?: string) {
    const res = await fetch(`${API_URL}/admin/bookings/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, driverId }),
    });
    if (!res.ok) throw new Error('Failed to update status');
    return res.json();
  },

  // Maintenance
  async getMaintenanceRecords() {
    const res = await fetch(`${API_URL}/maintenance`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch maintenance');
    return res.json();
  },

  async createMaintenance(data: any) {
    const res = await fetch(`${API_URL}/maintenance`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create maintenance');
    return res.json();
  },

  async completeMaintenance(id: string, cost?: number) {
    const res = await fetch(`${API_URL}/maintenance/${id}/complete`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ cost }),
    });
    if (!res.ok) throw new Error('Failed to complete maintenance');
    return res.json();
  },

  // Drivers
  async getDrivers() {
    const res = await fetch(`${API_URL}/drivers`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch drivers');
    return res.json();
  },

  async getAvailableDrivers() {
    const res = await fetch(`${API_URL}/drivers/available`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch available drivers');
    return res.json();
  },

  async createDriver(data: any) {
    const res = await fetch(`${API_URL}/drivers`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create driver');
    return res.json();
  },

  // Payments
  async createPaymentOrder(amount: number, receipt: string, bookingId?: string) {
    const res = await fetch(`${API_URL}/payments/create-order`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, receipt, bookingId }),
    });
    if (!res.ok) throw new Error('Failed to create payment order');
    return res.json();
  },

  async verifyPayment(data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    bookingId: string;
  }) {
    const res = await fetch(`${API_URL}/payments/verify-signature`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Payment verification failed');
    return res.json();
  },

  // Promos
  async validatePromo(code: string, amount: number) {
    const res = await fetch(`${API_URL}/promos/validate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ code, amount }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Invalid promo code');
    }
    return res.json();
  },

  // Wallet
  async getWalletBalance() {
    const res = await fetch(`${API_URL}/wallet`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch wallet');
    return res.json();
  },

  async addWalletMoney(amount: number) {
    const res = await fetch(`${API_URL}/wallet/add`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount }),
    });
    if (!res.ok) throw new Error('Failed to add money');
    return res.json();
  }
};
