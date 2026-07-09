import { useState, useEffect } from 'react';
import {
  X, MapPin, Users, Calendar, Phone, Mail, User, IndianRupee,
  Clock, Navigation, CheckCircle, CreditCard,
  Smartphone, Building, ChevronRight, ChevronDown, Star, Shield, Zap, AlertCircle,
  FileText, Loader2, BadgeCheck
} from 'lucide-react';
import { Car, pickupLocations, popularDestinations } from '../data/cars';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import LocationPickerMap from './LocationPickerMap';
import LiveTrackingMap from './LiveTrackingMap';
// import { BookingDB } from '../db/database';

declare var Razorpay: any;

interface BookingModalProps {
  car: Car;
  initialTripType?: string;
  onClose: () => void;
  onOpenAuth: () => void;
  showToast: (message: string, type: 'success' | 'error') => void;
}

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / GPay / PhonePe', icon: Smartphone, color: 'text-purple-600' },
  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, color: 'text-blue-600' },
  { id: 'netbanking', label: 'Net Banking', icon: Building, color: 'text-green-600' },
  { id: 'cash', label: 'Pay at Pickup (Cash)', icon: IndianRupee, color: 'text-orange-600' },
];

function StepIndicator({ step, total }: { step: number; total: number }) {
  const steps = ['Trip Details', 'Your Info', 'Payment', 'Confirmed'];
  return (
    <div className="flex items-center justify-between px-2 mb-6">
      {steps.slice(0, total).map((label, i) => {
        const num = i + 1;
        const done = num < step;
        const active = num === step;
        return (
          <div key={num} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all
                ${done ? 'bg-green-500 text-white' : active ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-gray-100 text-gray-400'}`}>
                {done ? <CheckCircle size={16} /> : num}
              </div>
              <span className={`text-[10px] mt-1 font-medium whitespace-nowrap
                ${active ? 'text-orange-600' : done ? 'text-green-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </div>
            {num < total && (
              <div className={`flex-1 h-0.5 mx-1 mb-4 rounded transition-all
                ${done ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function TrackingTimeline({ steps }: { steps: { label: string; time: string; done: boolean; active: boolean }[] }) {
  return (
    <div className="space-y-0">
      {steps.map((s, i) => (
        <div key={i} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 
              ${s.done ? 'bg-green-500' : s.active ? 'bg-orange-500 animate-pulse' : 'bg-gray-100 border-2 border-dashed border-gray-300'}`}>
              {s.done
                ? <CheckCircle size={16} className="text-white" />
                : s.active
                  ? <Loader2 size={16} className="text-white animate-spin" />
                  : <div className="w-2 h-2 rounded-full bg-gray-300" />}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-0.5 h-8 ${s.done ? 'bg-green-400' : 'bg-gray-200'}`} />
            )}
          </div>
          <div className="pb-2 pt-1">
            <p className={`text-sm font-semibold ${s.done ? 'text-green-700' : s.active ? 'text-orange-600' : 'text-gray-400'}`}>
              {s.label}
            </p>
            {s.time && <p className="text-xs text-gray-400">{s.time}</p>}
            {s.active && <p className="text-xs text-orange-500 font-medium animate-pulse">In progress...</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

const TIME_OPTIONS = (() => {
  const options = [];
  for(let i=0; i<24; i++) {
    for(let j=0; j<60; j+=30) {
      const hh = i.toString().padStart(2, '0');
      const mm = j.toString().padStart(2, '0');
      let ampm = i >= 12 ? 'PM' : 'AM';
      let h = i % 12;
      if (h === 0) h = 12;
      options.push({ value: `${hh}:${mm}`, label: `${h.toString().padStart(2, '0')}:${mm} ${ampm}` });
    }
  }
  return options;
})();

export default function BookingModal({ car, initialTripType, onClose, onOpenAuth, showToast }: BookingModalProps) {
  const { user, isAuthenticated, refreshUnread } = useAuth();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [processingPayment, setProcessingPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoCode, setPromoCode] = useState<{code: string, discount: number} | null>(null);
  const [validatingPromo, setValidatingPromo] = useState(false);

  const [form, setForm] = useState({
    pickupLocation: 'Noida, Sector 37',
    destination: '',
    pickupDate: '',
    pickupTime: '09:00',
    dropDate: '',
    dropTime: '18:00',
    passengers: 1,
    tripType: (initialTripType || 'self-drive') as 'self-drive' | 'with-driver',
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    license: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: user.name, phone: user.phone, email: user.email }));
  }, [user]);

  const calcDays = () => {
    if (!form.pickupDate || !form.dropDate) return 1;
    const diff = new Date(form.dropDate).getTime() - new Date(form.pickupDate).getTime();
    const d = Math.ceil(diff / 86400000);
    return d > 0 ? d : 1;
  };

  const days = calcDays();
  const driverCharge = form.tripType === 'with-driver' ? 800 * days : 0;
  const baseCost = car.price * days;
  const preDiscountCost = baseCost + driverCharge;
  const promoDiscount = promoCode ? promoCode.discount : 0;
  const taxableAmount = Math.max(0, preDiscountCost - promoDiscount);
  const gst = Math.round(taxableAmount * 0.05);
  const totalCost = taxableAmount + gst;

  const handleApplyPromo = async () => {
    if (!promoCodeInput.trim()) return;
    setValidatingPromo(true);
    try {
      const res = await api.validatePromo(promoCodeInput.trim(), preDiscountCost);
      setPromoCode({ code: res.code, discount: res.discount });
      showToast(res.message, 'success');
      setPromoCodeInput('');
    } catch (err: any) {
      showToast(err.message || 'Invalid promo code', 'error');
      setPromoCode(null);
    } finally {
      setValidatingPromo(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!form.pickupLocation) e.pickupLocation = 'Pick a pickup location';
    if (!form.destination) e.destination = 'Enter destination';
    if (!form.pickupDate) e.pickupDate = 'Select pickup date';
    if (!form.dropDate) e.dropDate = 'Select drop date';
    if (form.pickupDate && form.dropDate && new Date(form.dropDate) <= new Date(form.pickupDate))
      e.dropDate = 'Drop date must be after pickup date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.phone || !/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Valid 10-digit mobile number required';
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.license.trim()) e.license = 'Driving license number required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep(s => s + 1);
  };

  const handleConfirmPayment = async () => {
    if (!isAuthenticated) { onClose(); onOpenAuth(); return; }
    
    // For 'cash' payment, keep existing simple flow but update backend
    if (paymentMethod === 'cash') {
      setProcessingPayment(true);
      try {
        const bookingData = {
          carId: car.id,
          pickupDate: form.pickupDate,
          returnDate: form.dropDate,
          pickupLocation: form.pickupLocation,
          dropLocation: form.destination,
          totalAmount: totalCost,
          withDriver: form.tripType === 'with-driver',
          promoCodeId: promoCode ? promoCode.code : undefined,
        };
        const booking = await api.createBooking(bookingData);
        setConfirmedBooking(booking);
        setStep(4);
        refreshUnread();
        showToast('Booking confirmed! Pay at pickup.', 'success');
      } catch (err: any) {
        showToast(err.message || "Booking failed", "error");
      } finally {
        setProcessingPayment(false);
      }
      return;
    }

    // Razorpay Flow for Online Payments
    setProcessingPayment(true);
    try {
      // 1. Create Booking first (PENDING)
      const bookingData = {
        carId: car.id,
        pickupDate: form.pickupDate,
        returnDate: form.dropDate,
        pickupLocation: form.pickupLocation,
        dropLocation: form.destination,
        totalAmount: totalCost,
        withDriver: form.tripType === 'with-driver',
        promoCodeId: promoCode ? promoCode.code : undefined,
      };
      const booking = await api.createBooking(bookingData);

      // 2. Create Payment Order
      const order = await api.createPaymentOrder(totalCost, `receipt_${booking.bookingId}`, booking.id);

      // 3. Open Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_your_id',
        amount: order.amount,
        currency: order.currency,
        name: "DesiRent Car Rental",
        description: `Booking for ${car.name}`,
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyData = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              bookingId: booking.id
            };
            const result = await api.verifyPayment(verifyData);
            setConfirmedBooking(result.booking);
            setStep(4);
            refreshUnread();
            showToast('Payment successful & booking confirmed!', 'success');
          } catch (err: any) {
            showToast("Payment verification failed", "error");
          } finally {
            setProcessingPayment(false);
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone
        },
        theme: { color: "#f97316" },
        modal: {
          ondismiss: () => {
            setProcessingPayment(false);
            showToast("Payment cancelled", "info");
          }
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error("Payment flow failed:", error);
      showToast(error.message || "Payment initiation failed", 'error');
      setProcessingPayment(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  // ── CONFIRMED SCREEN ─────────────────────────────────────────────────────────
  if (step === 4 && confirmedBooking) {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-in zoom-in duration-300">
          {/* Success Header */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 rounded-t-3xl text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle size={40} className="text-white" />
            </div>
            <h2 className="text-2xl font-black">Booking Confirmed! 🎉</h2>
            <p className="text-green-100 mt-1 text-sm">Your ride is booked successfully</p>
            <div className="bg-white/20 rounded-2xl px-6 py-3 mt-4 inline-block">
              <p className="text-xs text-green-100 uppercase tracking-widest font-bold">Booking ID</p>
              <p className="text-2xl font-black tracking-wider">{confirmedBooking.bookingId}</p>
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Car Info */}
            <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4">
              <img src={confirmedBooking.car?.image || car.image} alt={car.name} className="w-20 h-14 object-cover rounded-xl" />
              <div>
                <p className="font-bold text-gray-800">{confirmedBooking.car?.name || car.name}</p>
                <p className="text-sm text-gray-500">{car.category} · {car.transmission}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={12} className="fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-semibold text-gray-600">{car.rating}</span>
                </div>
              </div>
            </div>

            {/* Trip Details */}
            <div className="bg-orange-50 rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 text-sm uppercase tracking-wider">
                <Navigation size={16} className="text-orange-500" /> Trip Details
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Pickup</p>
                  <p className="font-bold text-gray-800">{confirmedBooking.pickupLocation}</p>
                  <p className="text-gray-600 text-xs">{new Date(confirmedBooking.pickupDate).toLocaleDateString()} · {form.pickupTime}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Drop-off</p>
                  <p className="font-bold text-gray-800">{confirmedBooking.dropLocation}</p>
                  <p className="text-gray-600 text-xs">{new Date(confirmedBooking.returnDate).toLocaleDateString()} · {form.dropTime}</p>
                </div>
              </div>
              <div className="border-t border-orange-200 pt-3 flex items-center justify-between">
                <span className="text-gray-600 text-xs font-medium">{days} day{days > 1 ? 's' : ''} · {form.passengers} passenger{form.passengers > 1 ? 's' : ''}</span>
                <span className="bg-orange-500 text-white text-[10px] px-3 py-1 rounded-full font-black uppercase">
                  {confirmedBooking.withDriver ? '👨‍✈️ With Driver' : '🚗 Self Drive'}
                </span>
              </div>
            </div>

            {/* Live Tracking */}
            <div className="bg-blue-50 rounded-2xl p-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-blue-500" /> Live Booking Status
              </h3>
              {confirmedBooking.withDriver ? (
                <LiveTrackingMap bookingId={confirmedBooking.id} initialLocation={{ lat: 28.5678, lng: 77.3421 }} />
              ) : null}
              <div className="mt-4">
                <TrackingTimeline steps={confirmedBooking.trackingStatus || []} />
              </div>
            </div>

            {/* Bill Summary */}
            <div className="border border-gray-100 rounded-2xl p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <FileText size={16} className="text-gray-500" /> Bill Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>₹{car.price.toLocaleString()} × {days} day{days > 1 ? 's' : ''}</span>
                  <span>₹{baseCost.toLocaleString()}</span>
                </div>
                {driverCharge > 0 && (
                  <div className="flex justify-between text-gray-600">
                    <span>Driver Charge (₹800 × {days}d)</span>
                    <span>₹{driverCharge.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>GST (5%)</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-black text-gray-800 text-base">
                  <span>Total Paid</span>
                  <span className="text-green-600">₹{totalCost.toLocaleString()}</span>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-green-600 bg-green-50 rounded-xl p-2">
                <BadgeCheck size={14} />
                <span>Payment received via {PAYMENT_METHODS.find(p => p.id === paymentMethod)?.label}</span>
              </div>
            </div>

            {/* Contact Driver (if with-driver) */}
            {confirmedBooking.tripType === 'with-driver' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center text-white font-bold">S</div>
                <div>
                  <p className="font-bold text-gray-800">Driver will be assigned soon</p>
                  <p className="text-sm text-gray-500">You'll receive driver details via SMS & WhatsApp</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href={`https://web.whatsapp.com/send?phone=919876543210&text=Hi! My booking ID is ${confirmedBooking.bookingNumber} for ${car.name}`}
                target="_blank" rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-green-600 transition-colors"
              >
                💬 WhatsApp
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center justify-center gap-2 bg-orange-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors"
              >
                📞 Call Us
              </a>
            </div>

            <button onClick={onClose} className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] overflow-y-auto shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 bg-white z-10 px-6 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-lg font-black text-gray-800">Book {car.name}</h2>
              <p className="text-sm text-gray-500">₹{car.price.toLocaleString()}/day · {car.category}</p>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <X size={18} />
            </button>
          </div>
          <StepIndicator step={step} total={4} />
        </div>

        <div className="px-6 py-4">

          {/* ── STEP 1: TRIP DETAILS ─────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 flex items-center gap-3 border border-orange-100">
                <img src={car.image} alt={car.name} className="w-16 h-12 object-cover rounded-xl" />
                <div>
                  <p className="font-bold text-gray-800">{car.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{car.seats} Seats</span>
                    <span>·</span>
                    <span>{car.transmission}</span>
                    <span>·</span>
                    <span>{car.fuel}</span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-lg font-black text-orange-600">₹{car.price.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">per day</p>
                </div>
              </div>

              {/* Trip Type Toggle */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Trip Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { val: 'self-drive', label: '🚗 Self Drive', sub: 'You drive the car' },
                    { val: 'with-driver', label: '👨‍✈️ With Driver', sub: '+₹800/day extra' },
                  ].map(opt => (
                    <button
                      key={opt.val}
                      onClick={() => setForm({ ...form, tripType: opt.val as 'self-drive' | 'with-driver' })}
                      className={`p-3 rounded-xl border-2 text-left transition-all
                        ${form.tripType === opt.val ? 'border-orange-500 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}
                    >
                      <p className="font-bold text-sm text-gray-800">{opt.label}</p>
                      <p className="text-xs text-gray-500">{opt.sub}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup Location */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  <MapPin size={14} className="inline mr-1 text-orange-500" /> Pickup Location
                </label>
                <div className="relative">
                  <input
                    name="pickupLocation" value={form.pickupLocation} onChange={handleChange}
                    placeholder="Enter pickup address or pick on map"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400
                      ${errors.pickupLocation ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  <LocationPickerMap 
                    initialLocation={{lat: 28.5678, lng: 77.3421}} 
                    onLocationSelect={(loc) => { setForm(prev => ({...prev, pickupLocation: loc})); if (errors.pickupLocation) setErrors(e => ({...e, pickupLocation: ''})); }} 
                  />
                </div>
                {errors.pickupLocation && <p className="text-red-500 text-xs mt-1">{errors.pickupLocation}</p>}
              </div>

              {/* Destination */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  <Navigation size={14} className="inline mr-1 text-green-500" /> Destination
                </label>
                <div className="relative">
                  <input
                    name="destination" value={form.destination} onChange={handleChange}
                    list="destinations-list" placeholder="Where are you going or pick on map"
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400
                      ${errors.destination ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  <datalist id="destinations-list">
                    {popularDestinations.map(d => <option key={d.name} value={d.name} />)}
                  </datalist>
                  <LocationPickerMap 
                    initialLocation={{lat: 28.6139, lng: 77.2090}} 
                    onLocationSelect={(loc) => { setForm(prev => ({...prev, destination: loc})); if (errors.destination) setErrors(e => ({...e, destination: ''})); }} 
                  />
                </div>
                {errors.destination && <p className="text-red-500 text-xs mt-1">{errors.destination}</p>}
                {/* Popular chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {popularDestinations.slice(0, 6).map(d => (
                    <button key={d.name} onClick={() => setForm({ ...form, destination: d.name })}
                      className={`text-xs px-3 py-1 rounded-full border transition-colors
                        ${form.destination === d.name ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                      {d.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    <Calendar size={14} className="inline mr-1" /> Pickup Date
                  </label>
                  <input type="date" name="pickupDate" value={form.pickupDate} min={today}
                    onChange={handleChange}
                    className={`w-full border-2 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400
                      ${errors.pickupDate ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.pickupDate && <p className="text-red-500 text-xs mt-1">{errors.pickupDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    <Clock size={14} className="inline mr-1" /> Pickup Time
                  </label>
                  <div className="relative">
                    <select name="pickupTime" value={form.pickupTime} onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 appearance-none cursor-pointer">
                      {TIME_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    <Calendar size={14} className="inline mr-1" /> Drop Date
                  </label>
                  <input type="date" name="dropDate" value={form.dropDate} min={form.pickupDate || today}
                    onChange={handleChange}
                    className={`w-full border-2 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400
                      ${errors.dropDate ? 'border-red-400' : 'border-gray-200'}`} />
                  {errors.dropDate && <p className="text-red-500 text-xs mt-1">{errors.dropDate}</p>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    <Clock size={14} className="inline mr-1" /> Drop Time
                  </label>
                  <div className="relative">
                    <select name="dropTime" value={form.dropTime} onChange={handleChange}
                      className="w-full border-2 border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 appearance-none cursor-pointer">
                      {TIME_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Passengers */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">
                  <Users size={14} className="inline mr-1" /> Passengers
                </label>
                <select name="passengers" value={form.passengers} onChange={handleChange}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400">
                  {Array.from({ length: car.seats }, (_, i) => i + 1).map(n => (
                    <option key={n} value={n}>{n} Passenger{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Cost Preview */}
              {form.pickupDate && form.dropDate && (
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-4 text-white">
                  <div className="flex justify-between text-sm mb-1">
                    <span>₹{car.price.toLocaleString()} × {days} day{days > 1 ? 's' : ''}</span>
                    <span>₹{baseCost.toLocaleString()}</span>
                  </div>
                  {driverCharge > 0 && (
                    <div className="flex justify-between text-sm mb-1">
                      <span>Driver (₹800 × {days}d)</span>
                      <span>₹{driverCharge.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm mb-1 opacity-80">
                    <span>GST (5%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-white/30 mt-2 pt-2 flex justify-between font-black text-lg">
                    <span>Total</span>
                    <span>₹{totalCost.toLocaleString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: PERSONAL INFO ────────────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-4">
              {!isAuthenticated && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-amber-700">Login for faster booking</p>
                    <p className="text-xs text-amber-600 mt-0.5">
                      <button onClick={() => { onClose(); onOpenAuth(); }} className="underline font-semibold">Login or Register</button>
                      {' '}to auto-fill your details & track bookings
                    </p>
                  </div>
                </div>
              )}

              {[
                { name: 'name', label: 'Full Name', icon: User, placeholder: 'Rahul Sharma', type: 'text' },
                { name: 'phone', label: 'Mobile Number', icon: Phone, placeholder: '9XXXXXXXXX', type: 'tel' },
                { name: 'email', label: 'Email Address', icon: Mail, placeholder: 'you@email.com', type: 'email' },
                { name: 'license', label: 'Driving License No.', icon: FileText, placeholder: 'UP16-XXXXXXXXXX', type: 'text' },
              ].map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">
                    <field.icon size={14} className="inline mr-1" /> {field.label}
                  </label>
                  <input
                    name={field.name}
                    type={field.type}
                    value={(form as Record<string, string | number>)[field.name] as string}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className={`w-full border-2 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400
                      ${errors[field.name] ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                  />
                  {errors[field.name] && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12} />{errors[field.name]}</p>}
                </div>
              ))}

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Special Requests (Optional)</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                  placeholder="Child seat, GPS, any special requirement..."
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-orange-400" />
              </div>

              {/* Includes */}
              <div className="bg-green-50 rounded-2xl p-4">
                <p className="text-sm font-bold text-green-800 mb-2 flex items-center gap-1"><Shield size={14} />Included in your booking</p>
                <div className="grid grid-cols-2 gap-2">
                  {['Basic Insurance', 'Roadside Help', '24×7 Support', 'Fuel Included*'].map(item => (
                    <div key={item} className="flex items-center gap-1.5 text-xs text-green-700">
                      <CheckCircle size={12} className="text-green-500" /> {item}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">*First 200 km per day. ₹10/km thereafter</p>
              </div>
            </div>
          )}

          {/* ── STEP 3: PAYMENT ─────────────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-4">
              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h3 className="font-bold text-gray-700 text-sm mb-3">Booking Summary</h3>
                <div className="flex items-center gap-3 mb-3">
                  <img src={car.image} alt={car.name} className="w-14 h-10 object-cover rounded-lg" />
                  <div>
                    <p className="font-bold text-sm text-gray-800">{car.name}</p>
                    <p className="text-xs text-gray-500">{form.pickupDate} → {form.dropDate} · {days} day{days > 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-sm border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-gray-600">
                    <span>📍 From</span><span className="font-medium">{form.pickupLocation}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>🎯 To</span><span className="font-medium">{form.destination}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>👤</span><span className="font-medium">{form.name} · {form.phone}</span>
                  </div>
                </div>
              </div>

              {/* Bill */}
              <div className="border-2 border-orange-100 rounded-2xl p-4">
                <h3 className="font-bold text-gray-800 mb-3">Bill Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Car Rental (₹{car.price.toLocaleString()} × {days}d)</span>
                    <span>₹{baseCost.toLocaleString()}</span>
                  </div>
                  {driverCharge > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Driver Charge</span>
                      <span>₹{driverCharge.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>GST (5%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                  {promoCode && (
                    <div className="flex justify-between text-green-600 font-bold text-sm">
                      <span>🏷️ {promoCode.code} Applied</span>
                      <span>-₹{promoCode.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="border-t-2 border-dashed border-gray-200 pt-2 flex justify-between font-black text-gray-800 text-lg">
                    <span>Total Amount</span>
                    <span className="text-orange-600">₹{totalCost.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Promo Code Input */}
              {!promoCode && (
                <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
                  <h3 className="font-bold text-gray-800 mb-2">Apply Promo Code</h3>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-2 text-sm font-bold uppercase focus:outline-none focus:border-orange-400"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      disabled={validatingPromo || !promoCodeInput.trim()}
                      className="bg-gray-900 text-white px-6 rounded-xl font-bold text-sm hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {validatingPromo ? <Loader2 size={16} className="animate-spin" /> : 'Apply'}
                    </button>
                  </div>
                </div>
              )}
              {promoCode && (
                <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <BadgeCheck size={16} className="text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-800">'{promoCode.code}' applied</p>
                      <p className="text-xs text-green-600">You saved ₹{promoCode.discount.toLocaleString()}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setPromoCode(null)}
                    className="text-xs font-bold text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Payment Methods */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3">Payment Method</h3>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map(pm => {
                    const Icon = pm.icon;
                    return (
                      <button key={pm.id} onClick={() => setPaymentMethod(pm.id)}
                        className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left
                          ${paymentMethod === pm.id ? 'border-orange-400 bg-orange-50' : 'border-gray-200 hover:border-gray-300'}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white shadow-sm`}>
                          <Icon size={20} className={pm.color} />
                        </div>
                        <span className="font-semibold text-gray-700 text-sm">{pm.label}</span>
                        {paymentMethod === pm.id && (
                          <CheckCircle size={18} className="ml-auto text-orange-500" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
                <Shield size={14} className="text-green-500" />
                <span>100% secure payment · Encrypted · PCI DSS Compliant</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-6 flex gap-3">
            {step > 1 && step < 4 && (
              <button onClick={() => setStep(s => s - 1)}
                className="flex-1 py-3.5 rounded-2xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
                ← Back
              </button>
            )}
            {step < 3 && (
              <button onClick={handleNext}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
                Continue <ChevronRight size={18} />
              </button>
            )}
            {step === 3 && (
              <button onClick={handleConfirmPayment} disabled={processingPayment}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-black text-sm hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2 disabled:opacity-70">
                {processingPayment
                  ? <><Loader2 size={18} className="animate-spin" /> Processing...</>
                  : <><Zap size={18} /> Pay ₹{totalCost.toLocaleString()} Now</>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
