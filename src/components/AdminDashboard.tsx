import { useState, useEffect } from 'react';
import { 
  X, Users, Car, IndianRupee, TrendingUp,
  BadgeCheck, Eye, Phone,
  Search, Download, RefreshCw, Crown,
  BarChart3, Loader2, Calendar, TrendingUp as TrendingIcon,
  Check, Plus
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell, PieChart, Pie 
} from 'recharts';
import { BookingDB, UserDB, DBBooking, DBUser, ReviewDB } from '../db/database';
import { api } from '../services/api';
import { socketService } from '../services/socket';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100   text-blue-700   border-blue-200',
  active:    'bg-orange-100 text-orange-700 border-orange-200',
  completed: 'bg-green-100  text-green-700  border-green-200',
  cancelled: 'bg-red-100    text-red-600    border-red-200',
};

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={20} />
        </div>
        <TrendingUp size={14} className="text-green-500" />
      </div>
      <p className="text-2xl font-black text-gray-800">{value}</p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-green-600 font-semibold mt-1">{sub}</p>}
    </div>
  );
}

export default function AdminDashboard({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<'overview' | 'bookings' | 'users' | 'fleet' | 'maintenance' | 'drivers'>('overview');
  const [bookings, setBookings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [maintenance, setMaintenance] = useState<any[]>([]);
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [fleet, setFleet] = useState<any[]>([]);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [isAddingMaintenance, setIsAddingMaintenance] = useState(false);
  const [isAddingDriver, setIsAddingDriver] = useState(false);
  const [newMaintenance, setNewMaintenance] = useState({
    carId: '',
    serviceType: 'Routine Oil Change',
    notes: ''
  });
  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    email: '',
    licenseNo: ''
  });
  const [userSearch, setUserSearch] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [statusUpdateId, setStatusUpdateId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [bookingFilter, setBookingFilter] = useState<string>('all');

  const [adminStats, setAdminStats] = useState<any>(null);

  const loadData = async () => {
    try {
      const [stats, allBookings, allDrivers, allMaintenance, allCars] = await Promise.all([
        api.getAdminStats(),
        api.getAdminBookings(),
        api.getDrivers(),
        api.getMaintenanceRecords(),
        api.getCars()
      ]);
      setAdminStats(stats);
      setBookings(allBookings);
      setDrivers(allDrivers);
      setMaintenance(allMaintenance);
      setFleet(allCars);
      // We still use UserDB for the list in this version, but stats are real
      setUsers(UserDB.getAll());
    } catch (error) {
      console.error("Failed to load admin data", error);
    }
  };

  useEffect(() => {
    if (selectedBooking && selectedBooking.status === 'PENDING') {
        api.getAvailableDrivers().then(setAvailableDrivers).catch(console.error);
    }
  }, [selectedBooking]);

  useEffect(() => {
    // 1. Connect Socket
    socketService.connect();

    // 2. Initial Data Load
    loadData();

    // 3. Listen for new bookings
    socketService.on('booking:new', (newBooking) => {
      console.log('Real-time: New booking received!', newBooking);
      // Add to list and refresh stats
      setBookings(prev => [newBooking, ...prev]);
      handleRefresh(); 
    });

    // 4. Listen for status updates
    socketService.on('car:status_updated', () => {
      handleRefresh();
    });

    return () => {
      socketService.off('booking:new');
      socketService.off('car:status_updated');
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const handleStatusChange = async (bookingId: string, status: string) => {
    setStatusUpdateId(bookingId);
    try {
      await api.updateBookingStatus(bookingId, status.toUpperCase(), selectedDriverId);
      // Refresh data after update
      await loadData();
      setStatusUpdateId(null);
      setSelectedBooking(null);
      setSelectedDriverId('');
    } catch (error) {
      console.error("Failed to update status", error);
      setStatusUpdateId(null);
    }
  };

  const handleToggleUser = (userId: string, current: boolean) => {
    UserDB.update(userId, { isActive: !current });
    setUsers(UserDB.getAll());
  };

  const handleAddMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createMaintenance(newMaintenance);
      setIsAddingMaintenance(false);
      setNewMaintenance({ carId: '', serviceType: 'Routine Oil Change', notes: '' });
      loadData();
    } catch (error) {
      console.error("Failed to add maintenance", error);
    }
  };

  const handleCompleteMaintenance = async (id: string) => {
    const cost = prompt("Enter service cost (INR):");
    if (cost === null) return;
    try {
      await api.completeMaintenance(id, parseFloat(cost) || 0);
      loadData();
    } catch (error) {
      console.error("Failed to complete maintenance", error);
    }
  };

  const handleAddDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDriver(newDriver);
      setIsAddingDriver(false);
      setNewDriver({ name: '', phone: '', email: '', licenseNo: '' });
      loadData();
    } catch (error) {
      console.error("Failed to add driver", error);
    }
  };

  const bStats = adminStats ? {
    total: adminStats.totalBookings,
    pending: adminStats.statusStats.pending || 0,
    confirmed: adminStats.statusStats.confirmed || 0,
    active: adminStats.statusStats.active || 0,
    totalRevenue: adminStats.totalRevenue || 0,
    todayRevenue: adminStats.todayRevenue || 0,
    todayBookings: adminStats.todayBookings || 0
  } : BookingDB.getStats();

  const uStats = adminStats ? {
    total: adminStats.totalUsers,
    active: adminStats.totalUsers, // approximation
  } : UserDB.getStats();

  const reviews = ReviewDB.getAll();
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : '4.8';

  const filteredBookings = bookingFilter === 'all'
    ? bookings
    : bookings.filter(b => b.status === bookingFilter);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.phone.includes(userSearch)
  );

  const exportCSV = () => {
    const rows = [
      ['Booking No', 'Customer', 'Car', 'Pickup', 'Destination', 'Days', 'Amount', 'Status', 'Date'],
      ...bookings.map(b => [
        b.bookingId, b.user?.name || 'N/A', b.car?.name || 'N/A', b.pickupLocation,
        b.dropLocation, 
        Math.ceil((new Date(b.returnDate).getTime() - new Date(b.pickupDate).getTime()) / (1000 * 60 * 60 * 24)), 
        `₹${b.totalAmount}`, b.status,
        new Date(b.createdAt).toLocaleDateString('en-IN')
      ]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'desirent_bookings.csv'; a.click();
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('DesiRent Bookings Report', 14, 15);
    
    const tableColumn = ['Booking No', 'Customer', 'Car', 'Pickup', 'Destination', 'Status', 'Date'];
    const tableRows = bookings.map(b => [
      b.bookingId, b.user?.name || 'N/A', b.car?.name || 'N/A', b.pickupLocation,
      b.dropLocation, b.status, new Date(b.createdAt).toLocaleDateString('en-IN')
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [249, 115, 22] } // Orange-500
    });

    doc.save('desirent_bookings.pdf');
  };

  const TABS = [
    { id: 'overview',    label: 'Overview',  icon: BarChart3 },
    { id: 'bookings',    label: `Bookings`,  icon: Car },
    { id: 'fleet',       label: 'Fleet',     icon: BadgeCheck },
    { id: 'maintenance', label: 'Service',   icon: RefreshCw },
    { id: 'drivers',     label: 'Drivers',   icon: Users },
    { id: 'users',       label: `Users`,     icon: Users },
  ] as const;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-4xl max-h-[95vh] flex flex-col shadow-2xl">

        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 pt-6 pb-4 rounded-t-3xl flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <Crown size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-white font-black text-lg">Admin Dashboard</h2>
                <p className="text-slate-400 text-xs">DesiRent Control Panel</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleRefresh} disabled={refreshing}
                className="w-9 h-9 bg-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-600 transition-colors">
                <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
              </button>
              <button onClick={onClose}
                className="w-9 h-9 bg-slate-700 rounded-xl flex items-center justify-center text-slate-300 hover:bg-slate-600 transition-colors">
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {[
              { label: 'Revenue', val: `₹${(bStats.totalRevenue / 1000).toFixed(0)}K` },
              { label: 'Bookings', val: bStats.total },
              { label: 'Active', val: bStats.confirmed + bStats.active },
              { label: 'Users', val: uStats.total },
            ].map(s => (
              <div key={s.label} className="bg-white/10 rounded-xl p-2 text-center">
                <p className="text-white font-black text-base leading-none">{s.val}</p>
                <p className="text-slate-400 text-[10px] mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-black/20 rounded-xl p-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all
                  ${tab === t.id ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}>
                <t.icon size={12} />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.id.charAt(0).toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">

          {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
          {tab === 'overview' && adminStats && (
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${adminStats.totalRevenue.toLocaleString()}`}
                  sub={`₹${adminStats.todayRevenue || 0} today`} color="bg-green-100 text-green-600" />
                <StatCard icon={Car} label="Total Bookings" value={adminStats.totalBookings}
                  sub={`${adminStats.todayBookings} today`} color="bg-blue-100 text-blue-600" />
                <StatCard icon={Users} label="Total Users" value={adminStats.totalUsers}
                  sub={`Live database`} color="bg-purple-100 text-purple-600" />
                <StatCard icon={BadgeCheck} label="Avg Rating" value={avgRating}
                  sub={`${reviews.length} reviews`} color="bg-yellow-100 text-yellow-600" />
                <StatCard icon={RefreshCw} label="Needs Service" value={adminStats.fleetHealth?.needsService || 0}
                  sub="Requires Attention" color="bg-red-100 text-red-600" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Performance Chart */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingIcon size={18} className="text-orange-500" /> Weekly Bookings
                  </h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={adminStats.chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                        <Tooltip 
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px'}}
                          cursor={{fill: '#f97316', opacity: 0.1}}
                        />
                        <Bar dataKey="bookings" fill="#f97316" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Revenue Breakdown */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-black text-gray-900 mb-6 flex items-center gap-2">
                    <IndianRupee size={18} className="text-green-500" /> Revenue Split
                  </h3>
                  <div className="h-48 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Standard', value: adminStats.totalRevenue * 0.6 },
                            { name: 'Luxury', value: adminStats.totalRevenue * 0.4 }
                          ]}
                          cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                        >
                          <Cell fill="#f97316" />
                          <Cell fill="#1e293b" />
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Booking Status Breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2"><BarChart3 size={16} className="text-orange-500" /> Booking Status</h3>
                <div className="space-y-2">
                  {Object.entries(adminStats.statusStats).map(([status, count]: [string, any]) => (
                    <div key={status} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-20 font-medium capitalize">{status}</span>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${STATUS_COLORS[status.toLowerCase()]?.split(' ')[0] || 'bg-gray-400'} rounded-full transition-all`}
                          style={{ width: adminStats.totalBookings > 0 ? `${(count / adminStats.totalBookings) * 100}%` : '0%' }} />
                      </div>
                      <span className="text-xs font-bold text-gray-700 w-6 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Bookings */}
              <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-3">Recent Bookings</h3>
                <div className="space-y-2">
                  {bookings.slice(0, 5).map(b => (
                    <div key={b.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                      <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Car size={14} className="text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{b.user?.name}</p>
                        <p className="text-xs text-gray-400 truncate">{b.car?.name} · {new Date(b.pickupDate).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">₹{(b.totalAmount || 0).toLocaleString()}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${STATUS_COLORS[(b.status || 'pending').toLowerCase()] || STATUS_COLORS.pending}`}>
                          {b.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── BOOKINGS TAB ─────────────────────────────────────────────── */}
          {tab === 'bookings' && (
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5 overflow-x-auto flex-1 pb-1">
                  {['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'].map(s => (
                    <button key={s} onClick={() => setBookingFilter(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all flex-shrink-0
                        ${bookingFilter === s ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 bg-white'}`}>
                      {s === 'all' ? `All (${bookings.length})` : `${s} (${bookings.filter(b => b.status === s).length})`}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button onClick={exportCSV} title="Export CSV"
                    className="p-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-colors flex-shrink-0">
                    <Download size={16} />
                  </button>
                  <button onClick={exportPDF} title="Export PDF"
                    className="p-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex-shrink-0">
                    <Download size={16} />
                  </button>
                </div>
              </div>

              {/* Booking Detail Modal */}
              {selectedBooking && (
                <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-bold text-blue-800">Booking {selectedBooking.bookingId || selectedBooking.bookingNumber}</h4>
                    <button onClick={() => setSelectedBooking(null)} className="text-blue-600">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    {[
                      ['Customer', selectedBooking.user?.name || selectedBooking.userName],
                      ['Phone', selectedBooking.user?.phone || selectedBooking.userPhone],
                      ['Car', selectedBooking.car?.name || selectedBooking.carName],
                      ['Days', `${selectedBooking.days || '?'} days`],
                      ['Pickup', selectedBooking.pickupLocation],
                      ['Destination', selectedBooking.dropLocation || selectedBooking.destination],
                      ['Date', new Date(selectedBooking.pickupDate).toLocaleDateString()],
                      ['Amount', `₹${selectedBooking.totalAmount.toLocaleString()}`],
                    ].map(([k, v]) => (
                      <div key={k}><span className="text-gray-500">{k}: </span><span className="font-semibold text-gray-800">{v}</span></div>
                    ))}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-600 mb-2">Assign Driver & Update Status:</p>
                    
                    {selectedBooking.status === 'PENDING' && (
                      <div className="mb-3">
                        <select 
                          value={selectedDriverId}
                          onChange={(e) => setSelectedDriverId(e.target.value)}
                          className="w-full p-2 text-xs border rounded-lg bg-white"
                        >
                          <option value="">Select a Driver (Optional)</option>
                          {availableDrivers.map(d => (
                            <option key={d.id} value={d.id}>{d.name} ({d.phone})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                      {(['pending', 'confirmed', 'active', 'completed', 'cancelled'] as const).map(s => (
                        <button key={s} onClick={() => handleStatusChange(selectedBooking.id, s)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all
                            ${selectedBooking.status.toLowerCase() === s ? STATUS_COLORS[s] + ' ring-2 ring-offset-1 ring-current' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                          {statusUpdateId === selectedBooking.id ? <Loader2 size={10} className="animate-spin inline" /> : s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                {filteredBookings.map(b => (
                  <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:border-orange-200 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        <img src={b.car?.image} alt={b.car?.name} className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${b.carId}/80/80`; }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-bold text-sm text-gray-800">{b.user?.name}</p>
                            <p className="text-xs text-gray-500">{b.car?.name} · {Math.ceil((new Date(b.returnDate).getTime() - new Date(b.pickupDate).getTime()) / (1000 * 60 * 60 * 24))}d · {new Date(b.pickupDate).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-400">{b.pickupLocation} → {b.dropLocation}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="font-black text-gray-800">₹{b.totalAmount.toLocaleString()}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold block mt-0.5 ${STATUS_COLORS[b.status.toLowerCase()]}`}>
                              {b.status}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">{b.bookingId}</span>
                          <button onClick={() => setSelectedBooking(selectedBooking?.id === b.id ? null : b)}
                            className="text-[10px] text-orange-600 font-bold bg-orange-50 px-2 py-0.5 rounded flex items-center gap-1">
                            <Eye size={10} /> Manage
                          </button>
                          <a href={`tel:${b.userPhone}`} className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded flex items-center gap-1">
                            <Phone size={10} /> Call
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── USERS TAB ────────────────────────────────────────────────── */}
          {tab === 'users' && (
            <div className="p-4 space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                  placeholder="Search by name, email, phone..."
                  className="w-full pl-9 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
              </div>

              <div className="space-y-2">
                {filteredUsers.map(u => (
                  <div key={u.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-lg flex-shrink-0
                        ${u.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-orange-400 to-amber-500'}`}>
                        {u.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm text-gray-800">{u.name}</p>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                            ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                            {u.role}
                          </span>
                          {!u.isActive && <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-red-100 text-red-600">Inactive</span>}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        <p className="text-xs text-gray-400">{u.phone} · Joined {new Date(u.joinDate).toLocaleDateString('en-IN')}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs">
                          <span className="text-gray-600">🚗 {u.totalBookings} bookings</span>
                          <span className="text-green-600 font-semibold">₹{u.totalSpent.toLocaleString()} spent</span>
                        </div>
                      </div>
                      {u.role !== 'admin' && (
                        <button onClick={() => handleToggleUser(u.id, u.isActive)}
                          className={`text-xs px-3 py-1.5 rounded-xl font-bold border transition-all flex-shrink-0
                            ${u.isActive ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' : 'bg-green-50 text-green-600 border-green-200 hover:bg-green-100'}`}>
                          {u.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── FLEET HEALTH TAB ────────────────────────────────────────── */}
          {tab === 'fleet' && (
            <div className="p-4 space-y-4">
               <div className="grid grid-cols-2 gap-3 mb-2">
                <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">Total Fleet Odo</p>
                  <p className="text-2xl font-black text-gray-800">{(adminStats.fleetHealth?.totalMileage / 1000).toFixed(1)}K km</p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest">Critical Alert</p>
                  <p className="text-2xl font-black text-gray-800">{adminStats.fleetHealth?.needsService || 0} Cars</p>
                </div>
              </div>

              <div className="space-y-2">
                {fleet.map(car => {
                  const healthPercent = Math.max(0, 100 - (car.odometer / car.nextServiceKm * 100));
                  return (
                    <div key={car.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={car.image} alt={car.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-bold text-gray-800 text-sm">{car.brand} {car.name}</h4>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full
                              ${healthPercent > 20 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                              {healthPercent.toFixed(0)}% Health
                            </span>
                          </div>
                          <div className="mt-2 flex items-center gap-4">
                            <div className="flex-1">
                              <div className="flex items-center justify-between text-[10px] text-gray-400 mb-1">
                                <span>Odometer: {car.odometer} km</span>
                                <span>Service at {car.nextServiceKm} km</span>
                              </div>
                              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${healthPercent > 20 ? 'bg-orange-500' : 'bg-red-500'}`}
                                  style={{ width: `${Math.min(100, (car.odometer / car.nextServiceKm * 100))}%` }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* ── MAINTENANCE TAB ─────────────────────────────────────────── */}
          {tab === 'maintenance' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Vehicle Maintenance</h3>
                <button 
                  onClick={() => setIsAddingMaintenance(!isAddingMaintenance)}
                  className="px-3 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-orange-600 transition-colors flex items-center gap-1"
                >
                  {isAddingMaintenance ? <X size={14} /> : <TrendingUp size={14} />}
                  {isAddingMaintenance ? 'Cancel' : 'New Service'}
                </button>
              </div>

              {isAddingMaintenance && (
                <form onSubmit={handleAddMaintenance} className="bg-gray-50 p-4 rounded-2xl border border-dashed border-gray-300 space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Select Car</label>
                    <select 
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500"
                      value={newMaintenance.carId}
                      onChange={e => setNewMaintenance({...newMaintenance, carId: e.target.value})}
                    >
                      <option value="">Select a vehicle...</option>
                      {fleet.filter(c => c.available).map(c => (
                        <option key={c.id} value={c.id}>{c.brand} {c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Service Type</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Engine Oil Change"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500"
                      value={newMaintenance.serviceType}
                      onChange={e => setNewMaintenance({...newMaintenance, serviceType: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase ml-1">Notes</label>
                    <textarea 
                      placeholder="Details about the issue..."
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-orange-500 h-20"
                      value={newMaintenance.notes}
                      onChange={e => setNewMaintenance({...newMaintenance, notes: e.target.value})}
                    />
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-colors">
                    Add to Maintenance
                  </button>
                </form>
              )}
              
              <div className="space-y-3">
                {maintenance.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">No maintenance records found.</p>
                ) : (
                  maintenance.map(m => (
                    <div key={m.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase
                          ${m.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {m.status}
                        </span>
                        <span className="text-[10px] text-gray-400 font-mono">{m.car?.brand} {m.car?.name}</span>
                      </div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-gray-800">{m.serviceType}</p>
                          <p className="text-xs text-gray-500 mt-1">{m.notes}</p>
                        </div>
                        {m.status === 'IN_PROGRESS' && (
                          <button 
                            onClick={() => handleCompleteMaintenance(m.id)}
                            className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                            title="Complete Service"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-3 text-[10px] text-gray-400 border-t border-gray-50 pt-2">
                        <span>Started: {new Date(m.startDate).toLocaleDateString()}</span>
                        {m.status === 'COMPLETED' && <span>Ended: {new Date(m.endDate).toLocaleDateString()}</span>}
                        {m.cost && <span className="font-bold text-gray-700">Cost: ₹{m.cost}</span>}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ── DRIVERS TAB ─────────────────────────────────────────────── */}
          {tab === 'drivers' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-800">Professional Drivers</h3>
                <button 
                  onClick={() => setIsAddingDriver(!isAddingDriver)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  {isAddingDriver ? <X size={14} /> : <Plus size={14} />}
                  {isAddingDriver ? 'Cancel' : 'Add Driver'}
                </button>
              </div>

              {isAddingDriver && (
                <form onSubmit={handleAddDriver} className="bg-blue-50 p-4 rounded-2xl border border-dashed border-blue-200 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-blue-500 uppercase ml-1">Full Name</label>
                      <input 
                        type="text" required placeholder="Driver Name"
                        className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
                        value={newDriver.name}
                        onChange={e => setNewDriver({...newDriver, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-blue-500 uppercase ml-1">Phone</label>
                      <input 
                        type="tel" required placeholder="10-digit mobile"
                        className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
                        value={newDriver.phone}
                        onChange={e => setNewDriver({...newDriver, phone: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-blue-500 uppercase ml-1">Email (Optional)</label>
                      <input 
                        type="email" placeholder="email@driver.com"
                        className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
                        value={newDriver.email}
                        onChange={e => setNewDriver({...newDriver, email: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-blue-500 uppercase ml-1">License No.</label>
                      <input 
                        type="text" required placeholder="DL-XXXXXXXX"
                        className="w-full bg-white border border-blue-100 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500"
                        value={newDriver.licenseNo}
                        onChange={e => setNewDriver({...newDriver, licenseNo: e.target.value})}
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                    Register Driver
                  </button>
                </form>
              )}

              <div className="space-y-3">
                {drivers.length === 0 ? (
                  <p className="text-center text-gray-400 py-8 text-sm">No drivers registered.</p>
                ) : (
                  drivers.map(d => (
                    <div key={d.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                          {d.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-bold text-gray-800">{d.name}</p>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold
                              ${d.status === 'AVAILABLE' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                              {d.status}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500">{d.phone}</p>
                          <p className="text-[10px] text-gray-400 mt-1">License: {d.licenseNo}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
