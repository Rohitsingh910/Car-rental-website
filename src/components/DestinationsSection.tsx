import { MapPin, Clock, Car, Compass } from 'lucide-react';
import { popularDestinations } from '../data/cars';

interface DestinationsSectionProps {
  onSelectDestination: (name: string) => void;
}

export default function DestinationsSection({ onSelectDestination }: DestinationsSectionProps) {
  return (
    <section id="destinations" className="py-24 bg-slate-50 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-100/40 via-slate-50 to-slate-50 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 text-sm font-semibold px-5 py-2 rounded-full mb-4 shadow-sm border border-orange-200/50">
            <Compass className="w-4 h-4 animate-spin-slow" /> Discover India
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
            Popular Destinations
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Unforgettable road trips starting from <span className="font-bold text-slate-800">Noida, Sector 37</span>. Book your ride and start making memories.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest, idx) => (
            <div
              key={idx}
              onClick={() => onSelectDestination(dest.name)}
              className="group relative rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 h-[280px]"
            >
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dest.bg} opacity-100 group-hover:scale-110 transition-transform duration-700 ease-in-out`}></div>
              
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>

              {/* Huge Background Emoji */}
              <div className="absolute -bottom-4 -right-4 text-9xl opacity-20 transform rotate-12 group-hover:-rotate-12 group-hover:scale-125 transition-all duration-700 ease-in-out">
                {dest.emoji}
              </div>

              {/* Content */}
              <div className="relative z-10 p-6 flex flex-col justify-between h-full">
                <div className="transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-2xl mb-3 shadow-inner border border-white/20">
                    {dest.emoji}
                  </div>
                  <h3 className="text-white font-black text-2xl leading-tight mb-1">{dest.name}</h3>
                  <p className="text-orange-200 font-medium text-sm leading-relaxed">{dest.highlight}</p>
                </div>

                <div className="space-y-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 text-white/90 text-sm bg-black/20 backdrop-blur-sm w-fit px-3 py-1.5 rounded-lg border border-white/10">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span>{dest.distance}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90 text-sm bg-black/20 backdrop-blur-sm w-fit px-3 py-1.5 rounded-lg border border-white/10">
                    <Clock className="w-4 h-4 text-orange-400" />
                    <span>{dest.duration} drive</span>
                  </div>
                </div>

                {/* Floating Book Button */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                  <div className="bg-white text-slate-900 text-xs font-black px-4 py-2 rounded-xl shadow-xl flex items-center gap-1.5">
                    <Car className="w-4 h-4" /> Book
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Bar */}
        <div className="mt-16 bg-white rounded-3xl p-8 shadow-xl border border-slate-100 relative overflow-hidden">
          {/* subtle glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <h3 className="font-black text-slate-800 text-xl mb-6 flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            Quick Distances from Noida
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularDestinations.map((d) => (
              <div 
                key={d.name} 
                className="group flex items-center justify-between bg-slate-50 border border-slate-100 rounded-2xl p-4 hover:bg-orange-50 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer"
                onClick={() => onSelectDestination(d.name)}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl group-hover:scale-110 transition-transform">{d.emoji}</span>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{d.name}</div>
                    <div className="text-slate-500 text-xs">{d.duration}</div>
                  </div>
                </div>
                <div className="bg-white px-2 py-1 rounded-md shadow-sm text-orange-600 font-bold text-xs border border-slate-100 group-hover:border-orange-200">
                  {d.distance}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
