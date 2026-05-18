import { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import DestinationsSection from './components/DestinationsSection';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import CarCard from './components/CarCard';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
// Removed BackendDocs for production feel
import { cars as staticCars, Car } from './data/cars';
import { api } from './services/api';
import { socketService } from './services/socket';
import {
  IndianRupee, Star, Filter, SlidersHorizontal, Search,
  ChevronUp, ChevronDown, Phone, Shield, Clock, Award, Crown, Car as CarIcon,
  CheckCircle, AlertCircle, X, RefreshCw,
} from 'lucide-react';

const STANDARD_CATEGORIES = ['All', 'Hatchback', 'Sedan', 'SUV', 'Premium SUV', 'MUV'];
const LUXURY_CATEGORIES    = ['All Luxury', 'Luxury Sedan', 'Luxury SUV'];

// Dynamic brand stats from car data
const brandStats = (() => {
  const map: Record<string, { count: number; totalRating: number; emoji: string }> = {};
  const brandEmoji: Record<string, string> = {
    'Maruti Suzuki': '🔵', 'Hyundai': '🟦', 'Tata': '🔷',
    'Mahindra': '🟥', 'Honda': '🔴', 'Toyota': '🟠',
    'Kia': '⬛', 'Mercedes-Benz': '⭐', 'BMW': '🔵', 'Audi': '💎',
    'Jaguar': '🖤', 'Land Rover': '🟩',
  };
  staticCars.forEach(c => {
    if (!map[c.brand]) map[c.brand] = { count: 0, totalRating: 0, emoji: brandEmoji[c.brand] ?? '⚪' };
    map[c.brand].count++;
    map[c.brand].totalRating += c.rating;
  });
  return Object.entries(map)
    .filter(([, v]) => v.count >= 2)
    .slice(0, 4)
    .map(([brand, v]) => ({
      brand,
      cars: v.count,
      rating: (v.totalRating / v.count).toFixed(1),
      emoji: v.emoji,
    }));
})();

function AppContent() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const data = await api.getCars();
        setCars(data);
      } catch (error) {
        console.error("Failed to fetch cars, falling back to static data", error);
        setCars(staticCars);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();

    // Socket.io Real-time setup
    socketService.connect();
    socketService.on('booking:new', (booking) => {
      // Update local car state if booking is confirmed
      setCars(prevCars => prevCars.map(car => 
        car.id === booking.carId ? { ...car, available: false } : car
      ));
      showToast(`New booking: ${booking.car?.name} was just booked!`, 'success');
    });

    socketService.on('car:status_updated', (updatedCar) => {
      setCars(prevCars => prevCars.map(car => 
        car.id === updatedCar.id ? updatedCar : car
      ));
    });

    return () => {
      socketService.off('booking:new');
      socketService.off('car:status_updated');
    };
  }, []);

  const standardCars = cars.filter(c => c.segment === 'Standard');
  const luxuryCars   = cars.filter(c => c.segment === 'Luxury');

  const [activeSection, setActiveSection]         = useState('home');
  const [stdCategory, setStdCategory]             = useState('All');
  const [luxCategory, setLuxCategory]             = useState('All Luxury');
  const [selectedCar, setSelectedCar]             = useState<Car | null>(null);
  const [showAdmin, setShowAdmin]                 = useState(false);
  const [showAuthModal, setShowAuthModal]         = useState(false);
  const [searchQuery, setSearchQuery]             = useState('');
  const [priceRange, setPriceRange]               = useState<[number, number]>([0, 20000]);
  const [filters, setFilters]                     = useState({
    transmission: 'All',
    fuel: 'All',
    seats: 'All'
  });
  const [sortBy, setSortBy]                       = useState<'price-asc' | 'price-desc' | 'rating' | 'default'>('default');
  const [showFilters, setShowFilters]             = useState(false);
  const [showBackToTop, setShowBackToTop]         = useState(false);
  const [_heroDestination, setHeroDestination]    = useState('');
  // Toast System State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
      const sections = ['home', 'cars', 'luxury', 'destinations', 'about', 'contact'];
      for (const s of [...sections].reverse()) {
        const el = document.getElementById(s);
        if (el && window.scrollY >= el.offsetTop - 80) {
          setActiveSection(s);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id);
  };

  const handleHeroSearch = (_pickup: string, destination: string, _date: string) => {
    setHeroDestination(destination);
    scrollToSection('cars');
  };

  const handleSelectDestination = (dest: string) => {
    setHeroDestination(dest);
    scrollToSection('cars');
  };

  // ── Standard fleet filter + sort ──────────────────────────────────────────
  const filteredStandard = standardCars
    .filter(car => {
      const matchCat    = stdCategory === 'All' || car.category === stdCategory;
      const matchSearch = car.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          car.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchPrice  = car.price >= priceRange[0] && car.price <= priceRange[1];
      const matchTrans  = filters.transmission === 'All' || car.transmission === filters.transmission;
      const matchFuel   = filters.fuel === 'All' || car.fuel === filters.fuel;
      const matchSeats  = filters.seats === 'All' || car.seats.toString() === filters.seats;
      
      return matchCat && matchSearch && matchPrice && matchTrans && matchFuel && matchSeats;
    })
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating')     return b.rating - a.rating;
      return 0;
    });

  // ── Luxury fleet filter ───────────────────────────────────────────────────
  const filteredLuxury = luxuryCars.filter(car => {
    const matchCat = luxCategory === 'All Luxury' || car.category === luxCategory;
    return matchCat;
  });

  const avgRating      = (cars.reduce((s, c) => s + c.rating, 0) / cars.length).toFixed(1);
  const availableCount = cars.filter(c => c.available).length;

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar
        activeSection={activeSection}
        onNavClick={scrollToSection}
        onAdminClick={() => setShowAdmin(true)}
        onOpenAuth={() => setShowAuthModal(true)}
      />

      {/* ── Hero ── */}
      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <HeroSection onSearch={handleHeroSearch} />
      </div>

      {/* ── Why Choose Us ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
              The <span className="text-orange-600">DesiRent</span> Advantage 🇮🇳
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              We understand Indian roads and Indian drivers. That's why we've built a rental experience that's transparent, affordable, and premium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: '🚚', 
                title: 'Doorstep Delivery', 
                desc: 'Get your car delivered to your home, office, or airport at Noida & Delhi NCR.',
                color: 'bg-blue-50 text-blue-600'
              },
              { 
                icon: '💰', 
                title: 'Zero Hidden Charges', 
                desc: 'What you see is what you pay. Transparent pricing with no surprises at checkout.',
                color: 'bg-emerald-50 text-emerald-600'
              },
              { 
                icon: '🛠️', 
                title: '24/7 Roadside Support', 
                desc: 'Breakdown? Flat tire? Our team is just a call away, anywhere, anytime.',
                color: 'bg-orange-50 text-orange-600'
              }
            ].map((feature, i) => (
              <div key={i} className="group p-8 rounded-3xl border border-gray-100 hover:border-orange-200 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500">
                <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Strip ── */}
      <section className="bg-gray-50/50 border-y border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: IndianRupee, title: 'Best Prices',   sub: 'Starting ₹1,500/day',          color: 'text-orange-600 bg-orange-50'  },
              { icon: Shield,      title: 'Fully Insured', sub: 'Zero worry drives',             color: 'text-green-600 bg-green-50'    },
              { icon: Clock,       title: '24/7 Support',  sub: 'Always available',              color: 'text-blue-600 bg-blue-50'      },
              { icon: Award,       title: 'Top Rated',     sub: `${avgRating}★ avg rating`,      color: 'text-purple-600 bg-purple-50'  },
            ].map(f => (
              <div key={f.title} className="flex items-center gap-3 p-3 rounded-xl hover:shadow-sm transition">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${f.color}`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{f.title}</div>
                  <div className="text-gray-400 text-xs">{f.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
           STANDARD FLEET — 15 CARS
          ════════════════════════════════════════════════════════════ */}
      <section id="cars" className="py-14 bg-gradient-to-br from-gray-50 to-orange-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
              <CarIcon className="w-4 h-4" /> Standard Fleet
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
              Our Car Collection
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              {availableCount} cars available · All well-maintained, GPS-equipped & fully insured
            </p>
          </div>

          {/* Search + Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search by car name or brand..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 outline-none transition-all placeholder:text-gray-400"
                />
              </div>
              
              <div className="flex gap-2">
                <div className="relative flex-1 md:flex-none">
                  <select
                    value={sortBy}
                    onChange={e => setSortBy(e.target.value as typeof sortBy)}
                    className="w-full md:w-auto px-4 py-3.5 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:ring-4 focus:ring-orange-500/10 outline-none appearance-none pr-10 cursor-pointer"
                  >
                    <option value="default">Sort: Recommended</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold border transition-all ${
                    showFilters 
                      ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/30' 
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-orange-50 hover:border-orange-200'
                  }`}
                >
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
              </div>
            </div>
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Transmission</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500"
                      value={filters.transmission}
                      onChange={e => setFilters({...filters, transmission: e.target.value})}
                    >
                      <option value="All">All Transmissions</option>
                      <option value="Manual">Manual</option>
                      <option value="Automatic">Automatic</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Fuel Type</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500"
                      value={filters.fuel}
                      onChange={e => setFilters({...filters, fuel: e.target.value})}
                    >
                      <option value="All">All Fuels</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="EV">Electric</option>
                      <option value="CNG">CNG</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Seating</label>
                    <select 
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-orange-500"
                      value={filters.seats}
                      onChange={e => setFilters({...filters, seats: e.target.value})}
                    >
                      <option value="All">Any Capacity</option>
                      <option value="4">4 Seater</option>
                      <option value="5">5 Seater</option>
                      <option value="7">7 Seater</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block">Max Price: ₹{priceRange[1].toLocaleString()}</label>
                    <input
                      type="range" min={0} max={20000} step={500}
                      value={priceRange[1]}
                      onChange={e => setPriceRange([0, Number(e.target.value)])}
                      className="w-full accent-orange-500 mt-2"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => { 
                      setPriceRange([0, 20000]); 
                      setSearchQuery(''); 
                      setSortBy('default'); 
                      setStdCategory('All');
                      setFilters({ transmission: 'All', fuel: 'All', seats: 'All' });
                    }}
                    className="text-xs text-red-500 font-bold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset All Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {STANDARD_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setStdCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  stdCategory === cat
                    ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-md shadow-orange-200'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-orange-50 hover:text-orange-600 hover:border-orange-200'
                }`}
              >
                {cat}
                {cat !== 'All' && (
                  <span className={`ml-1.5 text-xs ${stdCategory === cat ? 'opacity-80' : 'text-gray-400'}`}>
                    ({standardCars.filter(c => c.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Results count */}
          {(searchQuery || stdCategory !== 'All' || priceRange[1] < 20000) && (
            <p className="text-sm text-gray-500 mb-4">
              Showing <span className="font-bold text-orange-600">{filteredStandard.length}</span> car(s)
              {searchQuery && <> matching "<span className="font-semibold">{searchQuery}</span>"</>}
              {stdCategory !== 'All' && <> in <span className="font-semibold">{stdCategory}</span></>}
            </p>
          )}

          {/* Standard Car Grid */}
          {filteredStandard.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredStandard.map(car => (
                <CarCard key={car.id} car={car} onBookNow={c => setSelectedCar(c)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No cars found</h3>
              <p className="text-gray-400 mb-4">Try adjusting your filters or search terms</p>
              <button
                onClick={() => { setSearchQuery(''); setStdCategory('All'); setPriceRange([0, 20000]); }}
                className="bg-orange-500 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-orange-600 transition"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Brand Rating Pills */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">
            {brandStats.map(b => (
              <div key={b.brand} className="bg-white rounded-xl p-4 flex items-center gap-3 border border-gray-100 shadow-sm hover:shadow-md transition">
                <span className="text-2xl">{b.emoji}</span>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{b.brand}</div>
                  <div className="text-xs text-gray-400">{b.cars} models</div>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-xs font-semibold text-gray-600">{b.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════
           LUXURY FLEET — 5 CARS
          ════════════════════════════════════════════════════════════ */}
      <section id="luxury" className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Decorative top glow */}
        <div className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-40 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-400 border border-amber-500/30 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              <Crown className="w-4 h-4" /> Luxury Collection
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Luxury</span> Fleet
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto text-lg">
              World-class vehicles for the most discerning travellers. 
              <span className="text-amber-400 font-semibold"> Chauffeur available on request.</span>
            </p>
          </div>

          {/* Luxury Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {LUXURY_CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setLuxCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all border ${
                  luxCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-white border-transparent shadow-lg shadow-amber-500/30'
                    : 'border-amber-500/30 text-amber-300 hover:bg-amber-500/10 hover:border-amber-400'
                }`}
              >
                {cat}
                {cat !== 'All Luxury' && (
                  <span className={`ml-1.5 text-xs ${luxCategory === cat ? 'opacity-80' : 'text-amber-500/60'}`}>
                    ({luxuryCars.filter(c => c.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Luxury Car Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredLuxury.map(car => (
              <CarCard key={car.id} car={car} onBookNow={c => setSelectedCar(c)} />
            ))}
          </div>

          {/* Luxury Perks */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '🛡️', title: 'Premium Insurance',  sub: 'Comprehensive zero-dep coverage' },
              { icon: '👔', title: 'Chauffeur Service',  sub: 'Professional trained drivers'      },
              { icon: '🌹', title: 'Welcome Hamper',     sub: 'Flowers, chocolates & water'       },
              { icon: '📍', title: 'GPS Tracked',        sub: 'Real-time live tracking'           },
            ].map(p => (
              <div key={p.title} className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition text-center">
                <span className="text-3xl block mb-2">{p.icon}</span>
                <div className="font-bold text-amber-300 text-sm">{p.title}</div>
                <div className="text-gray-400 text-xs mt-1">{p.sub}</div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-10 text-center">
            <p className="text-gray-400 text-sm mb-4">
              Need a luxury car for a wedding, corporate event, or airport transfer?
            </p>
            <a
              href="tel:+919876543210"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-white font-bold px-8 py-3.5 rounded-2xl shadow-xl hover:shadow-amber-500/30 hover:from-amber-600 hover:to-yellow-500 transition-all text-sm"
            >
              📞 Call for Luxury Booking — +91 98765 43210
            </a>
          </div>
        </div>
      </section>

      {/* ── Destinations ── */}
      <DestinationsSection onSelectDestination={handleSelectDestination} />

      {/* ── About ── */}
      <AboutSection />

      {/* ── Contact ── */}
      <ContactSection />

      {/* ── Footer ── */}
      <Footer />

      {/* ── Floating WhatsApp ── */}
      <a
        href="https://web.whatsapp.com/send?phone=919876543210&text=Hi%20DesiRent%2C%20I%20want%20to%20book%20a%20car"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 left-6 z-40 w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition transform hover:scale-110"
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* ── Back to Top ── */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition transform hover:scale-110"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* ── Sticky Mobile Bar ── */}
      <div className="fixed bottom-0 left-0 right-0 z-30 md:hidden">
        <div className="flex">
          <a
            href="tel:+919876543210"
            className="flex-1 bg-orange-500 text-white py-3.5 text-center text-sm font-bold flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" /> Call Now
          </a>
          <button
            onClick={() => scrollToSection('cars')}
            className="flex-1 bg-red-600 text-white py-3.5 text-center text-sm font-bold flex items-center justify-center gap-2"
          >
            🚗 Book Car
          </button>
        </div>
      </div>

      {/* ── Booking Modal ── */}
      {selectedCar && (
        <BookingModal
          car={selectedCar}
          onClose={() => setSelectedCar(null)}
          onOpenAuth={() => setShowAuthModal(true)}
          showToast={showToast}
        />
      )}

      {/* ── Admin Dashboard ── */}
      {showAdmin && <AdminDashboard onClose={() => setShowAdmin(false)} />}

      {/* ── Auth Modal ── */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* ── Toast Notification System ── */}
      {toast && (
        <div className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl glass animate-fade-in ${
          toast.type === 'success' ? 'border-green-500/50' : 'border-red-500/50'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          <span className="text-sm font-semibold text-gray-800">{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-4 text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
