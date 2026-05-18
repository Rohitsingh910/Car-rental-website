import { useState, useEffect } from 'react';
import {
  X, Car, Calendar, MapPin, CheckCircle, Clock,
  XCircle, Star, User, Phone, Mail, FileText, Bell, BellOff,
  Edit3, Save, BadgeCheck, Loader2, ChevronRight, Navigation,
  AlertCircle, Shield, Eye, Download, Trash2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { generateInvoice } from '../utils/pdfGenerator';
import { BookingDB, NotificationDB, DBBooking, DBNotification, UserDB } from '../db/database';

const STATUS_CONFIG: Record<string, { color: string; bg: string; icon: React.ElementType; label: string }> = {
  pending:   { color: 'text-yellow-700',  bg: 'bg-yellow-50  border-yellow-200',  icon: Clock,        label: 'Pending'   },
  confirmed: { color: 'text-blue-700',    bg: 'bg-blue-50    border-blue-200',    icon: CheckCircle,  label: 'Confirmed' },
  active:    { color: 'text-orange-700',  bg: 'bg-orange-50  border-orange-200',  icon: Navigation,   label: 'Active'    },
  completed: { color: 'text-green-700',   bg: 'bg-green-50   border-green-200',   icon: BadgeCheck,   label: 'Completed' },
  cancelled: { color: 'text-red-600',     bg: 'bg-red-50     border-red-200',     icon: XCircle,      label: 'Cancelled' },
};

function BookingCard({ booking, onCancel, onReview }: {
  booking: DBBooking;
  onCancel: (id: string) => void;
  onReview: (booking: DBBooking) => void;
}) {
  const cfg = STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  const [showTracking, setShowTracking] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Status Bar */}
      <div className={`px-4 py-2 border-b flex items-center justify-between ${cfg.bg} border`}>
        <div className="flex items-center gap-2">
          <Icon size={14} className={cfg.color} />
          <span className={`text-xs font-bold ${cfg.color}`}>{cfg.label}</span>
        </div>
        <span className="text-xs text-gray-500 font-mono font-bold">{booking.bookingId}</span>
      </div>

      <div className="p-4">
        {/* Car + Trip */}
        <div className="flex gap-3 mb-3">
          <img
            src={booking.car?.image}
            alt={booking.car?.name}
            className="w-20 h-14 object-cover rounded-xl bg-gray-100"
            onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${booking.carId}/200/140`; }}
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 text-sm">{booking.car?.name}</p>
            <p className="text-xs text-gray-500">{booking.car?.category} · {booking.withDriver ? '👨‍✈️ With Driver' : '🚗 Self Drive'}</p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
                {Math.ceil((new Date(booking.returnDate).getTime() - new Date(booking.pickupDate).getTime()) / (1000 * 60 * 60 * 24))} days
              </span>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">
                ₹{booking.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Route */}
        <div className="bg-gray-50 rounded-xl p-3 mb-3 text-xs">
          <div className="flex items-start gap-2">
            <div className="flex flex-col items-center mt-0.5 gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <div className="w-0.5 h-6 bg-gray-300 border-dashed" />
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            </div>
            <div className="flex-1 space-y-2">
              <div>
                <p className="text-gray-400">Pickup</p>
                <p className="font-semibold text-gray-700">{booking.pickupLocation}</p>
                <p className="text-gray-400">{new Date(booking.pickupDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-400">Drop-off</p>
                <p className="font-semibold text-gray-700">{booking.dropLocation}</p>
                <p className="text-gray-400">{new Date(booking.returnDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Driver Info */}
        {booking.withDriver && booking.driver && (
          <div className="bg-yellow-50 rounded-xl p-3 mb-3 flex items-center gap-3">
            <div className="w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {booking.driver.name.charAt(0)}
            </div>
            <div>
              <p className="text-xs text-gray-500">Your Assigned Driver</p>
              <p className="text-sm font-bold text-gray-800">{booking.driver.name}</p>
              <p className="text-xs text-gray-500">{booking.driver.phone}</p>
            </div>
            <a href={`tel:${booking.driver.phone}`}
              className="ml-auto p-2 bg-green-500 rounded-xl text-white">
              <Phone size={14} />
            </a>
          </div>
        )}

        {booking.withDriver && !booking.driver && booking.status === 'CONFIRMED' && (
          <div className="bg-blue-50 rounded-xl p-3 mb-3 text-center">
            <p className="text-xs text-blue-600 font-medium italic">Driver will be assigned shortly</p>
          </div>
        )}

        {/* Tracking */}
        {booking.trackingStatus && booking.trackingStatus.length > 0 && (
          <button onClick={() => setShowTracking(!showTracking)}
            className="w-full text-xs text-blue-600 font-semibold flex items-center justify-center gap-1 mb-3 py-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
            <Eye size={12} />
            {showTracking ? 'Hide' : 'View'} Live Status
            <ChevronRight size={12} className={`transition-transform ${showTracking ? 'rotate-90' : ''}`} />
          </button>
        )}

        {showTracking && booking.trackingStatus && (
          <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-0">
            {booking.trackingStatus.map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0
                    ${s.done ? 'bg-green-500' : s.active ? 'bg-orange-400 animate-pulse' : 'bg-gray-200'}`}>
                    {s.done ? <CheckCircle size={12} className="text-white" /> : s.active ? <Loader2 size={10} className="text-white animate-spin" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />}
                  </div>
                  {i < (booking.trackingStatus?.length ?? 0) - 1 && <div className={`w-0.5 h-6 ${s.done ? 'bg-green-400' : 'bg-gray-200'}`} />}
                </div>
                <div className="pb-1 pt-0.5">
                  <p className={`text-xs font-semibold ${s.done ? 'text-green-700' : s.active ? 'text-orange-600' : 'text-gray-400'}`}>{s.label}</p>
                  {s.time && <p className="text-[10px] text-gray-400">{s.time}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rating */}
        {booking.status === 'completed' && booking.rating && (
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xs text-gray-500">Your rating:</span>
            {[1,2,3,4,5].map(n => (
              <Star key={n} size={14} className={n <= booking.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'} />
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {booking.status === 'completed' && !booking.rating && (
            <button onClick={() => onReview(booking)}
              className="flex-1 py-2 bg-yellow-500 text-white text-xs font-bold rounded-xl hover:bg-yellow-600 transition-colors flex items-center justify-center gap-1">
              <Star size={12} /> Rate & Review
            </button>
          )}
          {['pending', 'confirmed'].includes(booking.status) && (
            <button onClick={() => onCancel(booking.id)}
              className="flex-1 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-xl hover:bg-red-100 transition-colors border border-red-200 flex items-center justify-center gap-1">
              <XCircle size={12} /> Cancel
            </button>
          )}
          <a href={`tel:+919876543210`}
            className="flex-1 py-2 bg-orange-50 text-orange-600 text-xs font-bold rounded-xl hover:bg-orange-100 transition-colors border border-orange-200 flex items-center justify-center gap-1">
            <Phone size={12} /> Help
          </a>
          <button 
            onClick={() => generateInvoice(booking)}
            className="flex-1 py-2 bg-gray-50 text-gray-600 text-xs font-bold rounded-xl hover:bg-gray-100 transition-colors border border-gray-200 flex items-center justify-center gap-1"
          >
            <Download size={12} /> Invoice
          </button>
        </div>
      </div>
    </div>
  );
}

function ReviewModal({ booking, onClose, onSubmit }: {
  booking: DBBooking;
  onClose: () => void;
  onSubmit: (rating: number, review: string) => void;
}) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hover, setHover] = useState(0);

  return (
    <div className="fixed inset-0 bg-black/60 z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-800">Rate Your Experience</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} />
          </button>
        </div>
        <img src={booking.carImage} alt={booking.carName}
          className="w-full h-28 object-cover rounded-xl mb-4 bg-gray-100"
          onError={e => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${booking.carId}/400/200`; }} />
        <p className="text-sm font-semibold text-gray-700 text-center mb-3">{booking.carName}</p>
        <div className="flex justify-center gap-2 mb-4">
          {[1,2,3,4,5].map(n => (
            <button key={n} onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)}>
              <Star size={32} className={`transition-all ${n <= (hover || rating) ? 'fill-yellow-400 text-yellow-400 scale-110' : 'text-gray-200'}`} />
            </button>
          ))}
        </div>
        <p className="text-center text-sm font-semibold text-gray-600 mb-3">
          {['', 'Poor 😞', 'Fair 😐', 'Good 🙂', 'Great 😊', 'Excellent 🌟'][rating]}
        </p>
        <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
          placeholder="Share your experience..."
          className="w-full border-2 border-gray-200 rounded-xl px-3 py-2 text-sm resize-none focus:outline-none focus:border-orange-400 mb-4" />
        <button onClick={() => onSubmit(rating, comment)}
          className="w-full py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
          Submit Review
        </button>
      </div>
    </div>
  );
}

export default function UserDashboard({ onClose }: { onClose: () => void }) {
  const { user, updateProfile, refreshUnread } = useAuth();
  const [tab, setTab] = useState<'bookings' | 'notifications' | 'profile'>('bookings');
  const [bookings, setBookings] = useState<DBBooking[]>([]);
  const [notifications, setNotifications] = useState<DBNotification[]>([]);
  const [reviewTarget, setReviewTarget] = useState<DBBooking | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    licenseNumber: '',
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [cancelMsg, setCancelMsg] = useState('');

  const loadBookings = async () => {
    if (!user) return;
    try {
      const data = await api.getMyBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load bookings", err);
    }
  };

  useEffect(() => {
    loadBookings();
    // For notifications, we still use NotificationDB for now or implement api.getNotifications
    if (user) {
      setNotifications(NotificationDB.getByUser(user.id));
      const fullUser = UserDB.getById(user.id);
      if (fullUser) setProfileForm({
        name: fullUser.name,
        phone: fullUser.phone,
        address: fullUser.address || '',
        licenseNumber: fullUser.licenseNumber || '',
      });
    }
  }, [user]);

  const handleCancel = async (id: string) => {
    if (!user) return;
    try {
      await api.cancelBooking(id);
      setCancelMsg("Booking cancelled successfully");
      loadBookings();
      refreshUnread();
    } catch (err: any) {
      setCancelMsg(err.message || "Failed to cancel booking");
    }
    setTimeout(() => setCancelMsg(''), 4000);
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (!reviewTarget) return;
    BookingDB.addReview(reviewTarget.id, rating, comment);
    setBookings(BookingDB.getByUser(user!.id));
    setReviewTarget(null);
  };

  const handleSaveProfile = () => {
    updateProfile(profileForm);
    setSaveSuccess(true);
    setEditingProfile(false);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const markAllRead = () => {
    if (!user) return;
    NotificationDB.markAllRead(user.id);
    setNotifications(NotificationDB.getByUser(user.id));
    refreshUnread();
  };

  const filteredBookings = filterStatus === 'all'
    ? bookings
    : bookings.filter(b => b.status === filterStatus);

  const unreadNotifs = notifications.filter(n => !n.read).length;
  const stats = {
    total: bookings.length,
    completed: bookings.filter(b => b.status === 'completed').length,
    active: bookings.filter(b => ['confirmed', 'active'].includes(b.status)).length,
    spent: bookings.filter(b => b.paymentStatus === 'paid').reduce((s, b) => s + b.totalAmount, 0),
  };

  const TABS = [
    { id: 'bookings', label: 'My Bookings', icon: Car },
    { id: 'notifications', label: 'Alerts', icon: Bell, badge: unreadNotifs },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  const NOTIF_COLORS: Record<string, string> = {
    booking: 'bg-blue-100 text-blue-600',
    payment: 'bg-green-100 text-green-600',
    promo: 'bg-purple-100 text-purple-600',
    system: 'bg-gray-100 text-gray-600',
  };

  return (
    <>
      {reviewTarget && (
        <ReviewModal booking={reviewTarget} onClose={() => setReviewTarget(null)} onSubmit={handleReviewSubmit} />
      )}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full sm:max-w-2xl max-h-[92vh] flex flex-col shadow-2xl">

          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 pt-6 pb-4 rounded-t-3xl sm:rounded-t-3xl flex-shrink-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white text-xl font-black">
                  {user?.avatar}
                </div>
                <div>
                  <h2 className="text-white font-black text-lg">{user?.name}</h2>
                  <p className="text-orange-100 text-xs">{user?.email}</p>
                </div>
              </div>
              <button onClick={onClose} className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30">
                <X size={18} />
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Bookings', val: stats.total },
                { label: 'Completed', val: stats.completed },
                { label: 'Active', val: stats.active },
                { label: 'Spent', val: `₹${(stats.spent/1000).toFixed(0)}K` },
              ].map(s => (
                <div key={s.label} className="bg-white/20 rounded-xl p-2 text-center">
                  <p className="text-white font-black text-lg leading-none">{s.val}</p>
                  <p className="text-orange-100 text-[10px] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-4 bg-black/10 rounded-xl p-1">
              {TABS.map(t => (
                <button key={t.id} onClick={() => setTab(t.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all
                    ${tab === t.id ? 'bg-white text-orange-600 shadow-sm' : 'text-orange-100 hover:text-white'}`}>
                  <t.icon size={13} />
                  {t.label}
                  {'badge' in t && t.badge > 0 && (
                    <span className="bg-red-500 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-black">
                      {t.badge}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">

            {/* ── BOOKINGS TAB ─── */}
            {tab === 'bookings' && (
              <div className="p-4 space-y-4">
                {cancelMsg && (
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-center gap-2 text-sm text-orange-700">
                    <AlertCircle size={16} /> {cancelMsg}
                  </div>
                )}

                {/* Filter */}
                <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
                  {['all', 'confirmed', 'active', 'completed', 'cancelled', 'pending'].map(s => (
                    <button key={s} onClick={() => setFilterStatus(s)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all
                        ${filterStatus === s ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}>
                      {s === 'all' ? 'All' : STATUS_CONFIG[s]?.label || s}
                      {' '}({s === 'all' ? bookings.length : bookings.filter(b => b.status === s).length})
                    </button>
                  ))}
                </div>

                {filteredBookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Car size={28} className="text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-semibold">No bookings found</p>
                    <p className="text-gray-400 text-sm">Book your first car today!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredBookings.map(b => (
                      <BookingCard key={b.id} booking={b} onCancel={handleCancel} onReview={setReviewTarget} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── NOTIFICATIONS TAB ─── */}
            {tab === 'notifications' && (
              <div className="p-4 space-y-3">
                {unreadNotifs > 0 && (
                  <button onClick={markAllRead}
                    className="w-full py-2 text-xs font-bold text-orange-600 bg-orange-50 rounded-xl hover:bg-orange-100 border border-orange-200 flex items-center justify-center gap-1">
                    <BellOff size={13} /> Mark all as read
                  </button>
                )}
                {notifications.length === 0 ? (
                  <div className="text-center py-12">
                    <Bell size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id}
                      onClick={() => { NotificationDB.markRead(n.id); setNotifications(NotificationDB.getByUser(user!.id)); refreshUnread(); }}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all
                        ${n.read ? 'bg-white border-gray-100' : 'bg-orange-50 border-orange-200 shadow-sm'}`}>
                      <div className="flex items-start gap-3">
                        <span className={`text-xs px-2 py-1 rounded-lg font-semibold flex-shrink-0 ${NOTIF_COLORS[n.type] || NOTIF_COLORS.system}`}>
                          {n.type}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-bold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {!n.read && <div className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0 mt-1" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* ── PROFILE TAB ─── */}
            {tab === 'profile' && (
              <div className="p-4 space-y-4">
                {saveSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2 text-sm text-green-700">
                    <CheckCircle size={16} /> Profile updated successfully!
                  </div>
                )}

                {/* Avatar */}
                <div className="flex flex-col items-center py-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white text-3xl font-black mb-2 shadow-lg">
                    {user?.avatar}
                  </div>
                  <p className="font-bold text-gray-800">{user?.name}</p>
                  <span className={`text-xs px-3 py-1 rounded-full mt-1 font-bold
                    ${user?.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {user?.role === 'admin' ? '👑 Admin' : '✅ Verified User'}
                  </span>
                </div>

                {/* Profile Fields */}
                <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-gray-800 text-sm">Personal Details</h3>
                    <button onClick={() => setEditingProfile(!editingProfile)}
                      className="flex items-center gap-1 text-xs text-orange-600 font-bold">
                      <Edit3 size={12} /> {editingProfile ? 'Cancel' : 'Edit'}
                    </button>
                  </div>

                  {[
                    { key: 'name', label: 'Full Name', icon: User, type: 'text' },
                    { key: 'phone', label: 'Mobile', icon: Phone, type: 'tel' },
                    { key: 'address', label: 'Address', icon: MapPin, type: 'text' },
                    { key: 'licenseNumber', label: 'License No.', icon: FileText, type: 'text' },
                  ].map(f => (
                    <div key={f.key} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                        <f.icon size={14} className="text-orange-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-gray-400 font-medium">{f.label}</p>
                        {editingProfile ? (
                          <input
                            type={f.type}
                            value={profileForm[f.key as keyof typeof profileForm]}
                            onChange={e => setProfileForm({ ...profileForm, [f.key]: e.target.value })}
                            className="w-full text-sm font-semibold text-gray-800 border-b-2 border-orange-300 bg-transparent focus:outline-none py-0.5"
                          />
                        ) : (
                          <p className="text-sm font-semibold text-gray-800 truncate">
                            {profileForm[f.key as keyof typeof profileForm] || <span className="text-gray-400 font-normal">Not set</span>}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Read-only */}
                  {[
                    { label: 'Email', val: user?.email, icon: Mail },
                    { label: 'Member Since', val: user?.joinDate ? new Date(user.joinDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '', icon: Calendar },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                        <f.icon size={14} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400">{f.label}</p>
                        <p className="text-sm font-semibold text-gray-600">{f.val}</p>
                      </div>
                    </div>
                  ))}

                  {editingProfile && (
                    <button onClick={handleSaveProfile}
                      className="w-full mt-2 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                      <Save size={16} /> Save Changes
                    </button>
                  )}
                </div>

                {/* Security */}
                <div className="bg-blue-50 rounded-2xl p-4 flex items-center gap-3">
                  <Shield size={20} className="text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-blue-800">Account Secured</p>
                    <p className="text-xs text-blue-600">Your data is encrypted and safe with DesiRent</p>
                  </div>
                  <BadgeCheck size={20} className="text-blue-500 ml-auto flex-shrink-0" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
