import { useState } from 'react';
import { Star, Users, Settings, Zap, IndianRupee, Fuel, Wind, Crown, CheckCircle2 } from 'lucide-react';
import { Car } from '../data/cars';

interface CarCardProps {
  car: Car;
  onBookNow: (car: Car) => void;
}

const fuelColors: Record<string, { text: string; bg: string; border: string; dot: string }> = {
  Petrol:   { text: 'text-emerald-700', bg: 'bg-emerald-50',  border: 'border-emerald-200', dot: 'bg-emerald-500' },
  Diesel:   { text: 'text-blue-700',    bg: 'bg-blue-50',     border: 'border-blue-200',    dot: 'bg-blue-500'   },
  CNG:      { text: 'text-teal-700',    bg: 'bg-teal-50',     border: 'border-teal-200',    dot: 'bg-teal-500'   },
  Electric: { text: 'text-violet-700',  bg: 'bg-violet-50',   border: 'border-violet-200',  dot: 'bg-violet-500' },
};

const transmissionColors: Record<string, { text: string; bg: string }> = {
  Manual:    { text: 'text-orange-700', bg: 'bg-orange-50'  },
  Automatic: { text: 'text-indigo-700', bg: 'bg-indigo-50'  },
  AMT:       { text: 'text-pink-700',   bg: 'bg-pink-50'    },
  CVT:       { text: 'text-violet-700', bg: 'bg-violet-50'  },
};

const brandColors: Record<string, { hex: string; light: string }> = {
  'Maruti Suzuki': { hex: '#003087', light: '#e8eef8' },
  'Hyundai':       { hex: '#002C5F', light: '#e8ecf5' },
  'Tata':          { hex: '#00539B', light: '#e8f0f9' },
  'Mahindra':      { hex: '#C41E3A', light: '#fce8eb' },
  'Honda':         { hex: '#CC0000', light: '#fce8e8' },
  'Toyota':        { hex: '#EB0A1E', light: '#fde8ea' },
  'Kia':           { hex: '#05141F', light: '#e8eaec' },
  'Volkswagen':    { hex: '#001E50', light: '#e8eaf2' },
  'MG':            { hex: '#A50034', light: '#fae8ee' },
  'Skoda':         { hex: '#4BA82E', light: '#edf7e9' },
  'Mercedes-Benz': { hex: '#00A19C', light: '#e8f7f6' },
  'BMW':           { hex: '#1C69D4', light: '#e8f0fb' },
  'Audi':          { hex: '#BB0A14', light: '#fce8e9' },
  'Jaguar':        { hex: '#2D2D2D', light: '#eeeeee' },
  'Land Rover':    { hex: '#005A2B', light: '#e8f3ed' },
};

// ─── Shimmer Placeholder ──────────────────────────────────────────────────────
function ShimmerPlaceholder() {
  return (
    <div className="w-full h-full bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 animate-pulse" />
  );
}

// ─── Brand Fallback Card ──────────────────────────────────────────────────────
function BrandPlaceholder({ car }: { car: Car }) {
  const meta = brandColors[car.brand] ?? { hex: '#374151', light: '#f3f4f6' };
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center gap-3 select-none relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${meta.light} 0%, ${meta.hex}22 100%)` }}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>
      
      {/* Brand badge */}
      <div
        className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg"
        style={{ backgroundColor: meta.hex }}
      >
        {car.brandLogo}
      </div>
      
      <div className="relative z-10 text-center px-4">
        <p className="text-sm font-bold text-gray-700 leading-tight">{car.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{car.year} · {car.category}</p>
      </div>
    </div>
  );
}

// ─── Smart Image Loader ───────────────────────────────────────────────────────
function CarImage({ car }: { car: Car }) {
  const fallbackArr = typeof car.fallbackImages === 'string' 
    ? JSON.parse(car.fallbackImages || '[]') 
    : (car.fallbackImages || []);
  
  const allSources = [car.image, ...fallbackArr];
  const [idx, setIdx]    = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  if (errored && idx >= allSources.length - 1) {
    return <BrandPlaceholder car={car} />;
  }

  return (
    <div className="w-full h-full relative group/img overflow-hidden">
      {!loaded && <ShimmerPlaceholder />}
      <img
        key={`${car.id}-${idx}`}
        src={allSources[idx]}
        alt={`${car.name} ${car.color} ${car.year} - DesiRent`}
        loading="lazy"
        decoding="async"
        onLoad={() => { setLoaded(true); setErrored(false); }}
        onError={() => {
          setLoaded(false);
          if (idx < allSources.length - 1) {
            setIdx(i => i + 1);
            setErrored(false);
          } else {
            setErrored(true);
          }
        }}
        className={`w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Premium Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

// ─── CarCard ──────────────────────────────────────────────────────────────────
export default function CarCard({ car, onBookNow }: CarCardProps) {
  const fuel  = fuelColors[car.fuel]                   ?? { text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', dot: 'bg-slate-400' };
  const trans = transmissionColors[car.transmission]   ?? { text: 'text-slate-600', bg: 'bg-slate-50' };
  const isLuxury = car.segment === 'Luxury';

  return (
    <div className={`
      relative bg-white rounded-3xl overflow-hidden flex flex-col group
      transition-all duration-300 hover:-translate-y-2
      ${isLuxury
        ? 'shadow-xl hover:shadow-2xl border-2 border-amber-200 hover:border-amber-400'
        : 'shadow-lg hover:shadow-2xl border border-slate-100 hover:border-orange-200'
      }
    `}>
      
      {/* ── Luxury Crown Ribbon ── */}
      {isLuxury && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-1.5 px-3 flex items-center justify-center gap-1.5 shadow-md">
          <Crown className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-[10px] font-black tracking-widest uppercase">Premium Luxury</span>
          <Crown className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      {/* ── IMAGE SECTION ── */}
      <div className={`relative overflow-hidden bg-slate-50 ${isLuxury ? 'h-52 mt-7' : 'h-48'}`}>
        <CarImage car={car} />

        {/* Top Badges Area */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start z-10">
          <div className="bg-white/80 backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-white/50">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-slate-900">{car.rating}</span>
            <span className="text-slate-400 font-medium text-[10px]">({car.reviewsCount || car.reviews || 0})</span>
          </div>

          {!car.available ? (
            <div className="bg-red-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm animate-pulse border border-red-400">
              Booked Out
            </div>
          ) : (
            <div className="bg-emerald-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1 border border-emerald-400">
               <CheckCircle2 className="w-3 h-3" /> Available
            </div>
          )}
        </div>

        {/* Bottom Badges Area */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end z-10">
          <div className="flex gap-2">
            {car.ac && (
              <div className="bg-slate-900/70 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 border border-white/10">
                <Wind className="w-3 h-3" /> AC
              </div>
            )}
            <div className="bg-slate-900/70 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-md font-semibold border border-white/10">
              {car.year}
            </div>
          </div>

          {(car as any).isDynamic && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-md shadow-lg animate-bounce border border-orange-400">
              Hot Deal
            </div>
          )}
        </div>
      </div>

      {/* ── CARD BODY ── */}
      <div className="p-5 flex flex-col flex-1 gap-4">

        {/* Brand + Name + Category */}
        <div>
          <div className="flex items-start justify-between gap-1 mb-1">
            <h3 className={`font-black text-lg leading-tight transition-colors line-clamp-1 ${
              isLuxury ? 'text-slate-900 group-hover:text-amber-600' : 'text-slate-900 group-hover:text-orange-600'
            }`}>
              {car.name}
            </h3>
          </div>
          <span className={`inline-block text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md ${
            isLuxury ? 'bg-amber-100 text-amber-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {car.category}
          </span>
        </div>

        {/* Specs Row */}
        <div className="flex items-center gap-2 text-xs flex-wrap">
          <span className="flex items-center gap-1.5 text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold">{car.seats} Seats</span>
          </span>

          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold ${trans.text} ${trans.bg} border border-current/20`}>
            <Settings className="w-3.5 h-3.5" />
            {car.transmission}
          </span>

          <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold border ${fuel.text} ${fuel.bg} ${fuel.border}`}>
            <span className={`w-2 h-2 rounded-full ${fuel.dot}`} />
            {car.fuel}
          </span>
        </div>

        {/* Mileage + Color */}
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
          <Fuel className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="font-bold text-slate-700">{car.mileage}</span>
          <span className="text-slate-300">|</span>
          <span className="truncate italic">{car.color}</span>
        </div>

        {/* Top Feature */}
        {(() => {
          const featuresArr = typeof car.features === 'string' 
            ? JSON.parse(car.features || '[]') 
            : (car.features || []);
          
          if (featuresArr.length === 0) return null;
          
          return (
            <div className="flex items-center gap-2">
              <Zap className={`w-3.5 h-3.5 flex-shrink-0 ${isLuxury ? 'text-amber-500' : 'text-orange-500'}`} />
              <span className="text-xs font-medium text-slate-500 truncate">{featuresArr.slice(0, 2).join(' • ')}</span>
            </div>
          );
        })()}

        {/* Price + Book Button */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex flex-col">
            {(car as any).isDynamic && (
               <span className="text-[10px] text-slate-400 line-through">₹{(car as any).originalPrice}</span>
            )}
            <div className="flex items-baseline gap-0.5">
              <IndianRupee className={`w-4 h-4 font-black ${isLuxury ? 'text-amber-600' : 'text-slate-900'}`} />
              <span className={`text-xl font-black tracking-tight ${isLuxury ? 'text-amber-600' : 'text-slate-900'}`}>
                {car.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">/ day</span>
            </div>
          </div>

          {car.available ? (
            <button
              onClick={() => onBookNow(car)}
              className={`
                relative overflow-hidden text-white text-sm font-black px-5 py-2.5 rounded-xl
                transition-all duration-300 active:scale-95 shadow-md group/btn
                ${isLuxury
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:shadow-amber-500/30 hover:scale-105'
                  : 'bg-slate-900 hover:bg-slate-800 hover:shadow-slate-900/30 hover:scale-105'
                }
              `}
            >
              <span className="relative z-10 flex items-center gap-2">
                Book <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
              </span>
            </button>
          ) : (
            <button
              disabled
              className="bg-slate-100 text-slate-400 text-sm font-bold px-5 py-2.5 rounded-xl cursor-not-allowed border border-slate-200"
            >
              Booked
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
