import { Shield, Star, Clock, Headphones, Award, MapPin, CheckCircle } from 'lucide-react';

export default function AboutSection() {
  const stats = [
    { value: '500+', label: 'Premium Cars', desc: 'Maintained to perfection', color: 'text-orange-500' },
    { value: '10K+', label: 'Happy Users', desc: 'Across India', color: 'text-blue-500' },
    { value: '4.9/5', label: 'Average Rating', desc: 'From 5000+ reviews', color: 'text-amber-500' },
  ];

  const whyUs = [
    { icon: Shield, title: 'Fully Insured', desc: 'Complete peace of mind on every trip.' },
    { icon: Star, title: 'Top Rated', desc: 'Award-winning service across NCR.' },
    { icon: Clock, title: '24/7 Support', desc: 'We are always here when you need us.' },
    { icon: Headphones, title: 'Easy Booking', desc: '3-step instant confirmation.' },
    { icon: Award, title: 'Best Prices', desc: 'No hidden charges. Guaranteed.' },
    { icon: MapPin, title: 'Multiple Pickups', desc: '10+ locations for your convenience.' },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-50">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-orange-100/40 transform -skew-x-12 translate-x-20"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 text-orange-600 font-semibold text-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              About DesiRent
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight mb-6">
              Your Journey, <br/>
              <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Our Priority.</span>
            </h2>
            <p className="text-slate-600 text-lg leading-relaxed mb-8">
              Founded in Sector 37, Noida, <strong className="text-slate-900 font-bold">DesiRent (Let's Go)</strong> has revolutionized car rentals in the Delhi NCR region. We bridge the gap between luxury and affordability, ensuring every road trip across India is memorable, safe, and incredibly comfortable.
            </p>
            
            <div className="space-y-4 mb-8">
              {[
                "Wide range of Indian brands: Maruti, Hyundai, Tata, Mahindra",
                "Transparent, affordable pricing with zero hidden fees",
                "Immaculately maintained fleet for maximum safety"
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0" />
                  <span className="text-slate-700 font-medium">{item}</span>
                </div>
              ))}
            </div>
            
            <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-1">
              Explore Our Fleet
            </button>
          </div>

          {/* Right Image Composition */}
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-tr from-orange-400 to-red-400 rounded-3xl transform rotate-3 opacity-20 blur-xl"></div>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=800&fit=crop&auto=format" 
                alt="Driving in India" 
                className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/90 to-transparent p-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 inline-block">
                  <p className="text-white font-bold text-xl">10M+ Kilometers</p>
                  <p className="text-white/80 text-sm">Driven by our happy customers</p>
                </div>
              </div>
            </div>
            {/* Floating badge */}
            <div className="absolute -left-8 top-12 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-4 animate-bounce">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Star className="w-6 h-6 text-orange-500 fill-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900">4.9</p>
                <p className="text-xs font-bold text-slate-500 uppercase">Top Rated</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 text-center group hover:-translate-y-2 transition-transform duration-300">
              <h4 className={`text-5xl font-black mb-2 ${s.color}`}>{s.value}</h4>
              <p className="text-xl font-bold text-slate-900 mb-1">{s.label}</p>
              <p className="text-slate-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Why Choose DesiRent?</h3>
          <p className="text-slate-600 text-lg">Everything you need for a perfect and hassle-free road trip.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyUs.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-default">
              <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-orange-500 transition-colors duration-300">
                <item.icon className="w-7 h-7 text-orange-600 group-hover:text-white transition-colors" />
              </div>
              <h4 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h4>
              <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
