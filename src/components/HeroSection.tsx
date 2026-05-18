import { useState } from 'react';
import { MapPin, Calendar, Users, Search, Navigation, ChevronDown } from 'lucide-react';
import { pickupLocations, popularDestinations } from '../data/cars';

interface HeroSectionProps {
  onSearch: (pickup: string, destination: string, date: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [pickup, setPickup] = useState('Noida, Sector 37');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [passengers, setPassengers] = useState('2');

  const handleSearch = () => {
    if (!destination) {
      alert('Please enter a destination');
      return;
    }
    onSearch(pickup, destination, date);
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] flex items-center"
      style={{
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 30%, #4c1d95 60%, #7c3aed 100%)',
      }}
    >
      {/* Background overlay patterns */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            🇮🇳 India's Most Trusted Car Rental — Noida, Sector 37
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4">
            Drive Your Way
            <span className="block bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
              Across India 🇮🇳
            </span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-4">
            Rent top Indian cars — Maruti, Hyundai, Tata, Mahindra & more.
            Starting from <span className="text-orange-300 font-bold">₹1,500/day</span>.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-6 mb-10 text-sm">
            {[
              { val: '500+', label: 'Cars in Fleet' },
              { val: '10K+', label: 'Happy Customers' },
              { val: '4.9★', label: 'Average Rating' },
              { val: '24/7', label: 'Support' },
            ].map((s) => (
              <div key={s.label} className="text-white/90">
                <span className="font-extrabold text-orange-300 text-lg">{s.val}</span>
                <span className="ml-1.5 text-white/60">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 md:p-6 max-w-4xl mx-auto shadow-2xl">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
            <Search className="w-4 h-4 text-orange-400" /> Find Your Perfect Car
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Pickup */}
            <div className="relative group">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider block mb-1.5 ml-1">
                <MapPin className="w-3 h-3 inline mr-1 text-orange-400" />Pickup Location
              </label>
              <div className="relative transition-transform duration-300 group-focus-within:scale-[1.02]">
                <select
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white px-3 py-3 pr-8 rounded-2xl text-sm focus:ring-2 focus:ring-orange-400/50 focus:bg-white/10 outline-none appearance-none transition-all cursor-pointer"
                >
                  {pickupLocations.map((loc) => (
                    <option key={loc} value={loc} className="text-gray-800 bg-white">{loc}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
              </div>
            </div>

            {/* Destination */}
            <div className="group">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider block mb-1.5 ml-1">
                <Navigation className="w-3 h-3 inline mr-1 text-orange-400" />Destination
              </label>
              <div className="transition-transform duration-300 group-focus-within:scale-[1.02]">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Delhi, Agra, Jaipur..."
                  list="hero-destinations"
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-white/30 px-4 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-orange-400/50 focus:bg-white/10 outline-none transition-all"
                />
              </div>
              <datalist id="hero-destinations">
                {popularDestinations.map((d) => (
                  <option key={d.name} value={d.name} />
                ))}
              </datalist>
            </div>

            {/* Date */}
            <div className="group">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider block mb-1.5 ml-1">
                <Calendar className="w-3 h-3 inline mr-1 text-orange-400" />Pickup Date
              </label>
              <div className="transition-transform duration-300 group-focus-within:scale-[1.02]">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white px-4 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-orange-400/50 focus:bg-white/10 outline-none [color-scheme:dark] transition-all"
                />
              </div>
            </div>

            {/* Passengers */}
            <div className="group">
              <label className="text-white/60 text-[10px] font-bold uppercase tracking-wider block mb-1.5 ml-1">
                <Users className="w-3 h-3 inline mr-1 text-orange-400" />Passengers
              </label>
              <div className="flex gap-2 transition-transform duration-300 group-focus-within:scale-[1.02]">
                <div className="relative flex-1">
                  <select
                    value={passengers}
                    onChange={(e) => setPassengers(e.target.value)}
                    className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white px-3 py-3 rounded-2xl text-sm focus:ring-2 focus:ring-orange-400/50 focus:bg-white/10 outline-none appearance-none cursor-pointer"
                  >
                    {[1,2,3,4,5,6,7].map((n) => (
                      <option key={n} value={n} className="text-gray-800 bg-white">{n} {n === 1 ? 'Person' : 'People'}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all active:scale-95 whitespace-nowrap flex items-center gap-2"
                >
                  <Search className="w-4 h-4" /> Go
                </button>
              </div>
            </div>
          </div>

          {/* Quick Destination Pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="text-white/50 text-xs self-center">Popular:</span>
            {popularDestinations.slice(0, 5).map((d) => (
              <button
                key={d.name}
                onClick={() => setDestination(d.name)}
                className={`text-xs px-3 py-1 rounded-full transition border ${
                  destination === d.name
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {d.emoji} {d.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full fill-white">
          <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z" />
        </svg>
      </div>
    </section>
  );
}
