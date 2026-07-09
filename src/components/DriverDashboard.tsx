import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Car, MapPin, Navigation, Navigation2, CheckCircle, Smartphone } from 'lucide-react';
import { socketService } from '../services/socket';

export default function DriverDashboard() {
  const { user, login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [driver, setDriver] = useState<any>(null);
  const [currentBooking, setCurrentBooking] = useState<any>(null);

  // If already logged in as a driver, set driver state
  useEffect(() => {
    if (user?.role === 'DRIVER') {
      setDriver(user);
    }
  }, [user]);

  useEffect(() => {
    if (!driver) return;
    
    // Connect to sockets
    socketService.connect();
    
    // Periodically send location if on a trip
    const interval = setInterval(() => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          socketService.emit('driver:location', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        });
      }
    }, 5000); // Send every 5 seconds

    return () => clearInterval(interval);
  }, [driver]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/auth/driver-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      localStorage.setItem('token', data.token);
      setDriver(data.user);
      
      // We don't have a specific `setAuth` that takes arbitrary users in our AuthContext,
      // but we can just use the token and reload or wait for AuthContext to pick it up.
      window.location.reload(); 
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  if (!driver) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 text-orange-600">
              <Car size={32} />
            </div>
            <h1 className="text-2xl font-black text-gray-800">Driver Portal</h1>
            <p className="text-gray-500 text-sm mt-1">Login to manage your trips</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                placeholder="Enter 10-digit number" required />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none"
                placeholder="••••••" required />
            </div>
            {error && <p className="text-red-500 text-sm font-bold">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 transition-colors">
              {loading ? 'Logging in...' : 'Login as Driver'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-slate-900 text-white p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">Welcome, {driver.name}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-slate-300">Online & Ready</span>
            </div>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('token'); window.location.reload(); }}
            className="px-4 py-2 bg-slate-800 rounded-xl text-xs font-bold hover:bg-slate-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="p-4 max-w-lg mx-auto mt-4 space-y-4">
        {/* Mock Active Trip for Demonstration */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-amber-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest">Current Assignment</p>
              <h2 className="text-xl font-black text-gray-800 mt-1">Mahindra Thar</h2>
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Active Trip</span>
          </div>

          <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-slate-200 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <MapPin size={12} />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-xs text-gray-500">Pickup</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">Terminal 3, IGI Airport</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-orange-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 animate-pulse">
                <Navigation2 size={12} />
              </div>
              <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-2xl border-2 border-orange-200 bg-orange-50">
                <p className="text-xs text-orange-600 font-semibold">Drop-off</p>
                <p className="text-sm font-bold text-gray-800 mt-0.5">Taj Mahal Hotel, Delhi</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
              <Navigation size={18} /> Navigate
            </button>
            <button className="flex-1 bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
              <CheckCircle size={18} /> Complete Trip
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Smartphone size={18} className="text-blue-500" /> Customer Details
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-gray-800">Rahul Sharma</p>
              <p className="text-sm text-gray-500">+91 98765 43210</p>
            </div>
            <a href="tel:+919876543210" className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
              📞
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
