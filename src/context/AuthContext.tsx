import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 1. Define the User type since we removed database.ts
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'ADMIN';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  // Notice these are now Promises because API calls take time
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  isAdmin: boolean;
  unreadCount: number;
  refreshUnread: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Point this to your Express backend port
const API_URL = 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // 2. Restore session on mount using JWT token
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          localStorage.removeItem('token'); // Invalid token
        }
      } catch (error) {
        console.error("Session restore failed:", error);
      }
    };
    
    loadUser();
  }, []);

  // 3. Refresh unread notifications from backend
  const refreshUnread = async () => {
    if (!user) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/notifications/unread`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUnreadCount(data.count); // Assuming backend returns { count: number }
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  useEffect(() => {
    refreshUnread();
  }, [user]);

  // 4. Real Backend Login
  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token); // Save JWT
        setUser(data.user);
        return { success: true, message: 'Login successful' };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (error) {
      return { success: false, message: 'Server connection error. Is backend running?' };
    }
  };

  // 5. Real Backend Register
  const register = async (name: string, email: string, phone: string, password: string) => {
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password })
      });
      
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem('token', data.token); // Save JWT
        setUser(data.user);
        return { success: true, message: 'Account created successfully!' };
      }
      return { success: false, message: data.message || 'Registration failed' };
    } catch (error) {
      return { success: false, message: 'Server connection error.' };
    }
  };

  // 6. Logout
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setUnreadCount(0);
  };

  // 7. Update Profile
  const updateProfile = async (data: Partial<User>) => {
    if (!user) return;
    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error("Update profile failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'ADMIN', // Ensure this matches your Prisma schema
      unreadCount,
      refreshUnread,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}