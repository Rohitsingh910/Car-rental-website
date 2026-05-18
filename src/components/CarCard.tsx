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
      className="w-full h-full flex flex-col items-center justify-center gap-3 select-none"
      style={{ background: `linear-gradient(135deg, ${meta.light} 0%, ${meta.hex}22 100%)` }}
    >
      {/* Brand badge */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg"
        style={{ backgroundColor: meta.hex }}
      >
        {car.brandLogo}
      </div>
      {/* Car silhouette SVG */}
      <svg viewBox="0 0 200 80" className="w-36 opacity-30" fill={meta.hex}>
        <path d="M20,60 L30,60 L30,52 Q38,28 65,24 L135,24 Q162,28 170,52 L170,60 L180,60 L180,64 L20,64 Z" />
        <circle cx="58" cy="64" r="10" />
        <circle cx="142" cy="64" r="10" />
        <path d="M70,24 Q82,10 100,9 Q118,10 130,24 Z" opacity="0.6"/>
        <rect x="78" y="12" width="44" height="12" rx="2" opacity="0.3"/>
      </svg>
      <div className="text-center px-4">
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

  // All sources exhausted — show branded placeholder
  if (errored && idx >= allSources.length - 1) {
    return <BrandPlaceholder car={car} />;
  }

  return (
    <div className="w-full h-full relative">
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
        className={`w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-110 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      {/* Premium Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  );
}

// ─── CarCard ──────────────────────────────────────────────────────────────────
export default function CarCard({ car, onBookNow }: CarCardProps) {
  const fuel  = fuelColors[car.fuel]                   ?? { text: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200', dot: 'bg-gray-400' };
  const trans = transmissionColors[car.transmission]   ?? { text: 'text-gray-600', bg: 'bg-gray-50' };
  const isLuxury = car.segment === 'Luxury';

  return (
    <div className={`
      relative bg-white rounded-2xl overflow-hidden flex flex-col group
      transition-all duration-300 hover:-translate-y-1.5
      ${isLuxury
        ? 'shadow-lg hover:shadow-2xl border-2 border-amber-200 hover:border-amber-400'
        : 'shadow-md hover:shadow-xl border border-gray-100 hover:border-orange-200'
      }
    `}>

      {/* ── Luxury Crown Ribbon ── */}
      {isLuxury && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 py-1 px-3 flex items-center justify-center gap-1.5">
          <Crown className="w-3 h-3 text-white" />
          <span className="text-white text-[10px] font-bold tracking-widest uppercase">Premium Luxury</span>
          <Crown className="w-3 h-3 text-white" />
        </div>
      )}

      {/* ── IMAGE SECTION ── */}
      <div className={`relative overflow-hidden bg-slate-50 ${isLuxury ? 'h-48 mt-6' : 'h-44'}`}>
        <CarImage car={car} />

        {/* Rating badge */}
        <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
          <span className="text-gray-800">{car.rating}</span>
          <span className="text-gray-400 font-normal">({car.reviewsCount || car.reviews || 0})</span>
        </div>

        {/* Not Available badge */}
        {!car.available && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-10 animate-pulse">
            Booked Out
          </div>
        )}

        {/* Verified Badge */}
        {car.available && (
          <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-emerald-600 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md z-10 flex items-center gap-1 border border-emerald-100">
             <CheckCircle2 className="w-3 h-3" /> Verified
          </div>
        )}

        {/* AC badge */}
        {car.ac && (
          <div className="absolute bottom-2 left-2 bg-blue-500/90 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded-full font-semibold flex items-center gap-1 z-10">
            <Wind className="w-2.5 h-2.5" /> AC
          </div>
        )}

        {/* Year badge */}
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur text-white text-[10px] px-2 py-0.5 rounded-full font-medium z-10">
          {car.year}
        </div>

        {/* Dynamic Pricing Badge */}
        {(car as any).isDynamic && (
          <div className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg z-10 animate-bounce">
            Weekend Deal!
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 z-[5]" />
      </div>

      {/* ── CARD BODY ── */}
      <div className="p-3.5 flex flex-col flex-1 gap-2.5">

        {/* Brand + Name + Category */}
        <div>
          <div className="flex items-start justify-between gap-1">
            <h3 className={`font-extrabold text-sm leading-tight transition-colors line-clamp-1 ${
              isLuxury ? 'text-gray-900 group-hover:text-amber-600' : 'text-gray-800 group-hover:text-orange-600'
            }`}>
              {car.name}
            </h3>
          </div>
          <span className={`text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
            isLuxury ? 'bg-amber-100 text-amber-700' : 'bg-orange-100 text-orange-700'
          }`}>
            {car.category}
          </span>
        </div>

        {/* Specs Row */}
        <div className="flex items-center gap-1.5 text-xs flex-wrap">
          {/* Seats */}
          <span className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
            <Users className="w-3 h-3 text-gray-400" />
            <span className="font-medium">{car.seats} Seats</span>
          </span>

          {/* Transmission */}
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium ${trans.text} ${trans.bg} border border-current/10`}>
            <Settings className="w-3 h-3" />
            {car.transmission}
          </span>

          {/* Fuel */}
          <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full font-medium border ${fuel.text} ${fuel.bg} ${fuel.border}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${fuel.dot}`} />
            {car.fuel}
          </span>
        </div>

        {/* Mileage + Color */}
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Fuel className="w-3 h-3 text-gray-300 flex-shrink-0" />
          <span className="font-semibold text-gray-600">{car.mileage}</span>
          <span className="text-gray-200">·</span>
          <span className="truncate text-gray-400 italic">{car.color}</span>
        </div>

        {/* Top Feature */}
        {(() => {
          const featuresArr = typeof car.features === 'string' 
            ? JSON.parse(car.features || '[]') 
            : (car.features || []);
          
          if (featuresArr.length === 0) return null;
          
          return (
            <div className="flex items-center gap-1.5">
              <Zap className={`w-3 h-3 flex-shrink-0 ${isLuxury ? 'text-amber-400' : 'text-orange-400'}`} />
              <span className="text-xs text-gray-500 truncate">{featuresArr.slice(0, 2).join(' · ')}</span>
            </div>
          );
        })()}

        {/* Price + Book Button */}
        <div className="flex items-center justify-between mt-auto pt-2.5 border-t border-gray-100">
          <div className="flex flex-col">
            {(car as any).isDynamic && (
               <span className="text-[10px] text-gray-400 line-through">₹{(car as any).originalPrice}</span>
            )}
            <div className="flex items-baseline gap-0.5">
              <IndianRupee className={`w-3.5 h-3.5 font-black ${isLuxury ? 'text-amber-600' : 'text-gray-800'}`} />
              <span className={`text-lg font-extrabold ${isLuxury ? 'text-amber-600' : 'text-gray-900'}`}>
                {car.price.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-gray-400 ml-0.5">/day</span>
            </div>
          </div>

          {car.available ? (
            <button
              onClick={() => onBookNow(car)}
              className={`
                relative overflow-hidden text-white text-xs font-bold px-4 py-2 rounded-xl
                transition-all duration-200 active:scale-95 shadow-md hover:shadow-lg
                ${isLuxury
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600'
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                }
              `}
            >
              <span className="relative z-10">Book Now</span>
            </button>
          ) : (
            <button
              disabled
              className="bg-gray-100 text-gray-400 text-xs font-bold px-4 py-2 rounded-xl cursor-not-allowed border border-gray-200"
            >
              Unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
