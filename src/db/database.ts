// ============================================================
//  DesiRent — LocalStorage Database Engine
//  Works exactly like Firebase/Supabase — swap config later
//  Supports: Users, Bookings, Reviews, Notifications, Sessions
// ============================================================

export interface DBUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string; // hashed in prod; plain for demo
  role: 'user' | 'admin';
  avatar: string;
  joinDate: string;
  lastLogin: string;
  isActive: boolean;
  totalBookings: number;
  totalSpent: number;
  licenseNumber?: string;
  address?: string;
}

export interface DBBooking {
  id: string;
  bookingNumber: string;
  userId: string;
  userName: string;
  userPhone: string;
  userEmail: string;
  carId: number;
  carName: string;
  carImage: string;
  carBrand: string;
  carCategory: string;
  pickupLocation: string;
  destination: string;
  pickupDate: string;
  pickupTime: string;
  dropDate: string;
  dropTime: string;
  days: number;
  passengers: number;
  tripType: 'self-drive' | 'with-driver';
  pricePerDay: number;
  driverCharge: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  licenseNumber?: string;
  driverName?: string;
  driverPhone?: string;
  trackingStatus?: TrackingStep[];
  rating?: number;
  review?: string;
}

export interface TrackingStep {
  step: string;
  label: string;
  time: string;
  done: boolean;
  active: boolean;
}

export interface DBNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'booking' | 'payment' | 'promo' | 'system';
  read: boolean;
  createdAt: string;
}

export interface DBReview {
  id: string;
  userId: string;
  userName: string;
  carId: number;
  carName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ─── KEYS ─────────────────────────────────────────────────────────────────────
const KEYS = {
  USERS: 'desirent_users',
  BOOKINGS: 'desirent_bookings',
  NOTIFICATIONS: 'desirent_notifications',
  REVIEWS: 'desirent_reviews',
  SESSION: 'desirent_session',
  SETTINGS: 'desirent_settings',
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7).toUpperCase();
}

function generateBookingNumber(): string {
  const prefix = 'DR';
  const num = Math.floor(100000 + Math.random() * 900000);
  return `${prefix}${num}`;
}

function now(): string {
  return new Date().toISOString();
}

// ─── GENERIC CRUD ─────────────────────────────────────────────────────────────
function getCollection<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function setCollection<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

// ─── SEED DEFAULT DATA ────────────────────────────────────────────────────────
function seedDefaultData() {
  const existingUsers = getCollection<DBUser>(KEYS.USERS);
  if (existingUsers.length > 0) return; // Already seeded

  const defaultUsers: DBUser[] = [
    {
      id: 'admin_001',
      name: 'Admin — DesiRent',
      email: 'admin@desirent.in',
      phone: '+91 98765 43210',
      password: 'admin123',
      role: 'admin',
      avatar: 'A',
      joinDate: '2020-01-01',
      lastLogin: now(),
      isActive: true,
      totalBookings: 0,
      totalSpent: 0,
    },
    {
      id: 'user_001',
      name: 'Rahul Sharma',
      email: 'rahul@gmail.com',
      phone: '+91 99887 76655',
      password: 'user123',
      role: 'user',
      avatar: 'R',
      joinDate: '2023-06-15',
      lastLogin: now(),
      isActive: true,
      totalBookings: 3,
      totalSpent: 12500,
      licenseNumber: 'UP16-20190012345',
      address: 'Sector 62, Noida, UP',
    },
    {
      id: 'user_002',
      name: 'Priya Singh',
      email: 'priya@gmail.com',
      phone: '+91 98876 54321',
      password: 'priya123',
      role: 'user',
      avatar: 'P',
      joinDate: '2023-09-20',
      lastLogin: now(),
      isActive: true,
      totalBookings: 1,
      totalSpent: 4000,
    },
    {
      id: 'user_003',
      name: 'Amit Kumar',
      email: 'amit@gmail.com',
      phone: '+91 97654 32109',
      password: 'amit123',
      role: 'user',
      avatar: 'A',
      joinDate: '2024-01-10',
      lastLogin: now(),
      isActive: true,
      totalBookings: 7,
      totalSpent: 38000,
    },
  ];

  const defaultBookings: DBBooking[] = [
    {
      id: 'bk_001',
      bookingNumber: 'DR100001',
      userId: 'user_001',
      userName: 'Rahul Sharma',
      userPhone: '+91 99887 76655',
      userEmail: 'rahul@gmail.com',
      carId: 1,
      carName: 'Maruti Suzuki Swift',
      carImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=85',
      carBrand: 'Maruti Suzuki',
      carCategory: 'Hatchback',
      pickupLocation: 'Noida, Sector 37',
      destination: 'Agra',
      pickupDate: '2024-12-20',
      pickupTime: '09:00',
      dropDate: '2024-12-22',
      dropTime: '18:00',
      days: 2,
      passengers: 3,
      tripType: 'self-drive',
      pricePerDay: 1500,
      driverCharge: 0,
      totalAmount: 3000,
      status: 'completed',
      paymentStatus: 'paid',
      paymentMethod: 'UPI',
      createdAt: '2024-12-18T10:30:00.000Z',
      updatedAt: '2024-12-22T18:30:00.000Z',
      licenseNumber: 'UP16-20190012345',
      rating: 5,
      review: 'Excellent service! Car was in perfect condition.',
      trackingStatus: [
        { step: '1', label: 'Booking Confirmed', time: '2024-12-18 10:30', done: true, active: false },
        { step: '2', label: 'Car Assigned', time: '2024-12-19 08:00', done: true, active: false },
        { step: '3', label: 'Car Delivered', time: '2024-12-20 09:00', done: true, active: false },
        { step: '4', label: 'Trip Active', time: '2024-12-20 09:15', done: true, active: false },
        { step: '5', label: 'Trip Completed', time: '2024-12-22 18:30', done: true, active: false },
      ],
    },
    {
      id: 'bk_002',
      bookingNumber: 'DR100002',
      userId: 'user_003',
      userName: 'Amit Kumar',
      userPhone: '+91 97654 32109',
      userEmail: 'amit@gmail.com',
      carId: 4,
      carName: 'Mahindra XUV700',
      carImage: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=85',
      carBrand: 'Mahindra',
      carCategory: 'Premium SUV',
      pickupLocation: 'Noida, Sector 37',
      destination: 'Jaipur',
      pickupDate: '2025-01-15',
      pickupTime: '07:00',
      dropDate: '2025-01-18',
      dropTime: '20:00',
      days: 3,
      passengers: 6,
      tripType: 'with-driver',
      pricePerDay: 3500,
      driverCharge: 1500,
      totalAmount: 12000,
      status: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod: 'Credit Card',
      createdAt: '2025-01-10T14:00:00.000Z',
      updatedAt: '2025-01-10T14:30:00.000Z',
      driverName: 'Suresh Kumar',
      driverPhone: '+91 98012 34567',
      trackingStatus: [
        { step: '1', label: 'Booking Confirmed', time: '2025-01-10 14:30', done: true, active: false },
        { step: '2', label: 'Car Assigned', time: '2025-01-14 10:00', done: true, active: false },
        { step: '3', label: 'Car Delivered', time: '', done: false, active: true },
        { step: '4', label: 'Trip Active', time: '', done: false, active: false },
        { step: '5', label: 'Trip Completed', time: '', done: false, active: false },
      ],
    },
  ];

  const defaultReviews: DBReview[] = [
    {
      id: 'rv_001', userId: 'user_001', userName: 'Rahul Sharma',
      carId: 1, carName: 'Maruti Suzuki Swift',
      rating: 5, comment: 'Excellent! Car was clean and fuel-efficient. Highly recommend DesiRent!',
      createdAt: '2024-12-22T20:00:00.000Z',
    },
    {
      id: 'rv_002', userId: 'user_003', userName: 'Amit Kumar',
      carId: 8, carName: 'Hyundai Creta',
      rating: 4, comment: 'Very good experience. AC was working great. Will book again.',
      createdAt: '2024-12-28T15:00:00.000Z',
    },
  ];

  setCollection(KEYS.USERS, defaultUsers);
  setCollection(KEYS.BOOKINGS, defaultBookings);
  setCollection(KEYS.REVIEWS, defaultReviews);
}

// ─── INITIALIZE DB ────────────────────────────────────────────────────────────
seedDefaultData();

// ══════════════════════════════════════════════════════════════════════════════
//  USER OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

export const UserDB = {
  getAll(): DBUser[] {
    return getCollection<DBUser>(KEYS.USERS);
  },

  getById(id: string): DBUser | null {
    return this.getAll().find(u => u.id === id) || null;
  },

  getByEmail(email: string): DBUser | null {
    return this.getAll().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  create(data: Omit<DBUser, 'id' | 'joinDate' | 'lastLogin' | 'totalBookings' | 'totalSpent' | 'isActive'>): DBUser {
    const users = this.getAll();
    const newUser: DBUser = {
      ...data,
      id: generateId(),
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: now(),
      isActive: true,
      totalBookings: 0,
      totalSpent: 0,
    };
    users.push(newUser);
    setCollection(KEYS.USERS, users);
    return newUser;
  },

  update(id: string, data: Partial<DBUser>): DBUser | null {
    const users = this.getAll();
    const idx = users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    users[idx] = { ...users[idx], ...data };
    setCollection(KEYS.USERS, users);
    return users[idx];
  },

  updateLastLogin(id: string): void {
    this.update(id, { lastLogin: now() });
  },

  delete(id: string): boolean {
    const users = this.getAll().filter(u => u.id !== id);
    setCollection(KEYS.USERS, users);
    return true;
  },

  login(email: string, password: string): { success: boolean; user?: DBUser; message: string } {
    const user = this.getByEmail(email);
    if (!user) return { success: false, message: 'No account found with this email.' };
    if (user.password !== password) return { success: false, message: 'Incorrect password. Try again.' };
    if (!user.isActive) return { success: false, message: 'Account is deactivated. Contact support.' };
    this.updateLastLogin(user.id);
    // Save session
    localStorage.setItem(KEYS.SESSION, JSON.stringify({ userId: user.id, loginTime: now() }));
    return { success: true, user, message: `Welcome back, ${user.name}!` };
  },

  register(data: { name: string; email: string; phone: string; password: string }): { success: boolean; user?: DBUser; message: string } {
    const exists = this.getByEmail(data.email);
    if (exists) return { success: false, message: 'Email already registered. Please login.' };
    const user = this.create({
      ...data,
      role: 'user',
      avatar: data.name.charAt(0).toUpperCase(),
    });
    localStorage.setItem(KEYS.SESSION, JSON.stringify({ userId: user.id, loginTime: now() }));
    return { success: true, user, message: `Welcome to DesiRent, ${data.name}! 🎉` };
  },

  logout(): void {
    localStorage.removeItem(KEYS.SESSION);
  },

  getSession(): DBUser | null {
    try {
      const session = JSON.parse(localStorage.getItem(KEYS.SESSION) || 'null');
      if (!session) return null;
      return this.getById(session.userId);
    } catch {
      return null;
    }
  },

  getStats() {
    const users = this.getAll();
    return {
      total: users.length,
      active: users.filter(u => u.isActive).length,
      admins: users.filter(u => u.role === 'admin').length,
      newThisMonth: users.filter(u => {
        const d = new Date(u.joinDate);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      }).length,
    };
  },
};

// ══════════════════════════════════════════════════════════════════════════════
//  BOOKING OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

export const BookingDB = {
  getAll(): DBBooking[] {
    return getCollection<DBBooking>(KEYS.BOOKINGS).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getById(id: string): DBBooking | null {
    return this.getAll().find(b => b.id === id) || null;
  },

  getByBookingNumber(num: string): DBBooking | null {
    return this.getAll().find(b => b.bookingNumber === num) || null;
  },

  getByUser(userId: string): DBBooking[] {
    return this.getAll().filter(b => b.userId === userId);
  },

  getByStatus(status: DBBooking['status']): DBBooking[] {
    return this.getAll().filter(b => b.status === status);
  },

  create(data: Omit<DBBooking, 'id' | 'bookingNumber' | 'createdAt' | 'updatedAt' | 'trackingStatus'>): DBBooking {
    const bookings = getCollection<DBBooking>(KEYS.BOOKINGS);
    const booking: DBBooking = {
      ...data,
      id: generateId(),
      bookingNumber: generateBookingNumber(),
      createdAt: now(),
      updatedAt: now(),
      trackingStatus: [
        { step: '1', label: 'Booking Confirmed', time: new Date().toLocaleString('en-IN'), done: true, active: false },
        { step: '2', label: 'Car Assigned', time: '', done: false, active: true },
        { step: '3', label: 'Car Delivered to You', time: '', done: false, active: false },
        { step: '4', label: 'Trip Active', time: '', done: false, active: false },
        { step: '5', label: 'Trip Completed', time: '', done: false, active: false },
      ],
    };
    bookings.push(booking);
    setCollection(KEYS.BOOKINGS, bookings);

    // Update user stats
    const user = UserDB.getById(data.userId);
    if (user) {
      UserDB.update(data.userId, {
        totalBookings: user.totalBookings + 1,
        totalSpent: user.totalSpent + data.totalAmount,
      });
    }

    // Create notification
    NotificationDB.create({
      userId: data.userId,
      title: '🎉 Booking Confirmed!',
      message: `Your ${data.carName} is booked for ${data.pickupDate}. Booking ID: ${booking.bookingNumber}`,
      type: 'booking',
    });

    return booking;
  },

  update(id: string, data: Partial<DBBooking>): DBBooking | null {
    const bookings = getCollection<DBBooking>(KEYS.BOOKINGS);
    const idx = bookings.findIndex(b => b.id === id);
    if (idx === -1) return null;
    bookings[idx] = { ...bookings[idx], ...data, updatedAt: now() };
    setCollection(KEYS.BOOKINGS, bookings);
    return bookings[idx];
  },

  cancel(id: string, userId: string): { success: boolean; message: string } {
    const booking = this.getById(id);
    if (!booking) return { success: false, message: 'Booking not found.' };
    if (booking.userId !== userId) return { success: false, message: 'Unauthorized.' };
    if (['completed', 'cancelled'].includes(booking.status))
      return { success: false, message: `Booking is already ${booking.status}.` };
    this.update(id, { status: 'cancelled', paymentStatus: 'refunded' });
    NotificationDB.create({
      userId,
      title: '❌ Booking Cancelled',
      message: `Your booking ${booking.bookingNumber} has been cancelled. Refund will be processed in 3-5 days.`,
      type: 'payment',
    });
    return { success: true, message: 'Booking cancelled. Refund will be processed in 3-5 business days.' };
  },

  addReview(id: string, rating: number, review: string): boolean {
    const booking = this.getById(id);
    if (!booking) return false;
    this.update(id, { rating, review });
    ReviewDB.create({
      userId: booking.userId,
      userName: booking.userName,
      carId: booking.carId,
      carName: booking.carName,
      rating,
      comment: review,
    });
    return true;
  },

  getStats() {
    const bookings = this.getAll();
    const revenue = bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0);
    const today = new Date().toISOString().split('T')[0];
    return {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      active: bookings.filter(b => b.status === 'active').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      cancelled: bookings.filter(b => b.status === 'cancelled').length,
      totalRevenue: revenue,
      todayBookings: bookings.filter(b => b.createdAt.startsWith(today)).length,
      todayRevenue: bookings.filter(b => b.createdAt.startsWith(today) && b.paymentStatus === 'paid')
        .reduce((s, b) => s + b.totalAmount, 0),
    };
  },
};

// ══════════════════════════════════════════════════════════════════════════════
//  NOTIFICATION OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

export const NotificationDB = {
  getAll(): DBNotification[] {
    return getCollection<DBNotification>(KEYS.NOTIFICATIONS).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getByUser(userId: string): DBNotification[] {
    return this.getAll().filter(n => n.userId === userId || n.userId === 'all');
  },

  getUnreadCount(userId: string): number {
    return this.getByUser(userId).filter(n => !n.read).length;
  },

  create(data: Omit<DBNotification, 'id' | 'read' | 'createdAt'>): DBNotification {
    const notifications = getCollection<DBNotification>(KEYS.NOTIFICATIONS);
    const notification: DBNotification = {
      ...data,
      id: generateId(),
      read: false,
      createdAt: now(),
    };
    notifications.push(notification);
    setCollection(KEYS.NOTIFICATIONS, notifications);
    return notification;
  },

  markRead(id: string): void {
    const notifications = getCollection<DBNotification>(KEYS.NOTIFICATIONS);
    const idx = notifications.findIndex(n => n.id === id);
    if (idx !== -1) {
      notifications[idx].read = true;
      setCollection(KEYS.NOTIFICATIONS, notifications);
    }
  },

  markAllRead(userId: string): void {
    const notifications = getCollection<DBNotification>(KEYS.NOTIFICATIONS).map(n =>
      (n.userId === userId || n.userId === 'all') ? { ...n, read: true } : n
    );
    setCollection(KEYS.NOTIFICATIONS, notifications);
  },

  delete(id: string): void {
    const notifications = getCollection<DBNotification>(KEYS.NOTIFICATIONS).filter(n => n.id !== id);
    setCollection(KEYS.NOTIFICATIONS, notifications);
  },
};

// ══════════════════════════════════════════════════════════════════════════════
//  REVIEW OPERATIONS
// ══════════════════════════════════════════════════════════════════════════════

export const ReviewDB = {
  getAll(): DBReview[] {
    return getCollection<DBReview>(KEYS.REVIEWS).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getByCar(carId: number): DBReview[] {
    return this.getAll().filter(r => r.carId === carId);
  },

  getByUser(userId: string): DBReview[] {
    return this.getAll().filter(r => r.userId === userId);
  },

  create(data: Omit<DBReview, 'id' | 'createdAt'>): DBReview {
    const reviews = getCollection<DBReview>(KEYS.REVIEWS);
    const review: DBReview = { ...data, id: generateId(), createdAt: now() };
    reviews.push(review);
    setCollection(KEYS.REVIEWS, reviews);
    return review;
  },

  getCarRating(carId: number): { avg: number; count: number } {
    const reviews = this.getByCar(carId);
    if (reviews.length === 0) return { avg: 0, count: 0 };
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    return { avg: Math.round(avg * 10) / 10, count: reviews.length };
  },
};

// ─── EXPORT DB INFO (for showing how it works) ────────────────────────────────
export const DBInfo = {
  name: 'DesiRent LocalStorage DB',
  version: '1.0.0',
  tables: ['users', 'bookings', 'notifications', 'reviews'],
  getSize(): string {
    let size = 0;
    Object.values(KEYS).forEach(key => {
      size += (localStorage.getItem(key) || '').length;
    });
    return (size / 1024).toFixed(2) + ' KB';
  },
  exportJSON(): string {
    const data: Record<string, unknown> = {};
    Object.entries(KEYS).forEach(([name, key]) => {
      data[name] = getCollection(key);
    });
    return JSON.stringify(data, null, 2);
  },
  clearAll(): void {
    Object.values(KEYS).forEach(key => localStorage.removeItem(key));
    seedDefaultData();
  },
};
