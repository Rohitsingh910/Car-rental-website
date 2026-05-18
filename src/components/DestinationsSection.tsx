import { MapPin, Clock, Car } from 'lucide-react';
import { popularDestinations } from '../data/cars';

interface DestinationsSectionProps {
  onSelectDestination: (name: string) => void;
}

export default function DestinationsSection({ onSelectDestination }: DestinationsSectionProps) {
  return (
    <section id="destinations" className="py-16 bg-gradient-to-br from-gray-50 to-orange-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
            🗺️ Destinations
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
            Popular Destinations
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Most loved road trips from <span className="font-semibold text-orange-600">Noida, Sector 37</span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {popularDestinations.map((dest, idx) => (
            <div
              key={idx}
              onClick={() => onSelectDestination(dest.name)}
              className="relative rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300"
              style={{ minHeight: '200px' }}
            >
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dest.bg} opacity-90`}></div>

              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-2 right-2 text-6xl transform rotate-12 group-hover:rotate-6 transition">{dest.emoji}</div>
              </div>

              {/* Content */}
              <div className="relative z-10 p-4 flex flex-col justify-between h-full min-h-[200px]">
                <div>
                  <span className="text-3xl">{dest.emoji}</span>
                  <h3 className="text-white font-extrabold text-lg mt-2 leading-tight">{dest.name}</h3>
                  <p className="text-white/80 text-xs mt-1 leading-relaxed">{dest.highlight}</p>
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-white/90 text-xs">
                    <MapPin className="w-3 h-3 flex-shrink-0" />
                    <span>{dest.distance} from Noida</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-white/90 text-xs">
                    <Clock className="w-3 h-3 flex-shrink-0" />
                    <span>{dest.duration} drive</span>
                  </div>
                  <div className="text-white/70 text-[11px]">{dest.highlight}</div>
                </div>

                {/* Book Button */}
                <div className="mt-3">
                  <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white text-xs font-semibold px-3 py-1.5 rounded-full inline-flex items-center gap-1 group-hover:bg-white/30 transition">
                    <Car className="w-3 h-3" /> Book Trip
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Distance Info Bar */}
        <div className="mt-10 bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" /> All Distances from Noida, Sector 37
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {popularDestinations.map((d) => (
              <div key={d.name} className="flex items-center justify-between bg-orange-50 rounded-xl px-3 py-2.5 hover:bg-orange-100 transition cursor-pointer"
                onClick={() => onSelectDestination(d.name)}>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{d.emoji}</span>
                  <div>
                    <div className="font-semibold text-gray-800 text-xs">{d.name}</div>
                    <div className="text-gray-400 text-[10px]">{d.duration}</div>
                  </div>
                </div>
                <span className="text-orange-600 font-bold text-xs">{d.distance}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
