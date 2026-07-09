import { Car, Phone, Mail, MapPin, Instagram, Facebook, Twitter, MessageCircle, ArrowRight, ShieldCheck, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300 overflow-hidden relative">
      {/* Decorative Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Top CTA Bar */}
      <div className="relative bg-gradient-to-r from-orange-600 to-red-600 py-10 px-4 shadow-2xl border-b border-white/10">
        {/* Pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <h3 className="font-black text-2xl md:text-3xl text-white mb-1">Ready to hit the road? 🚗</h3>
            <p className="text-white/80 font-medium">Book your premium car today — Starting from <span className="font-bold text-white">₹1,500/day</span></p>
          </div>
          <a
            href="#cars"
            className="group flex items-center gap-2 bg-slate-950 text-white font-bold px-8 py-4 rounded-xl hover:bg-slate-900 shadow-xl shadow-slate-900/20 transition-all hover:scale-105"
          >
            Explore Fleet 
            <ArrowRight className="w-5 h-5 text-orange-500 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Brand Info */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2.5 rounded-2xl shadow-lg shadow-orange-500/20">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  Desi<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">Rent</span>
                </span>
                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Let's Go India</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              India's most trusted car rental service based in Noida, Sector 37. Providing top-tier, fully-insured vehicles for memorable journeys across the nation since 2020.
            </p>
            
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: '#', hover: 'hover:text-pink-500 hover:border-pink-500 hover:shadow-[0_0_15px_rgba(236,72,153,0.5)]' },
                { icon: Facebook, href: '#', hover: 'hover:text-blue-500 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]' },
                { icon: Twitter, href: '#', hover: 'hover:text-sky-400 hover:border-sky-400 hover:shadow-[0_0_15px_rgba(56,189,248,0.5)]' },
                { icon: MessageCircle, href: 'https://web.whatsapp.com/send?phone=919876543210', hover: 'hover:text-green-500 hover:border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.5)]' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 bg-slate-900 transition-all duration-300 ${s.hover}`}
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '#home' },
                { label: 'Our Fleet', href: '#cars' },
                { label: 'Top Destinations', href: '#destinations' },
                { label: 'About Us', href: '#about' },
                { label: 'Contact', href: '#contact' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-slate-400 hover:text-orange-500 text-sm font-medium transition-colors flex items-center gap-2 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Car Categories */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Our Garage</h4>
            <ul className="space-y-4">
              {[
                { label: 'Compact Hatchbacks', sub: 'Swift, Baleno, i20' },
                { label: 'Comfort Sedans', sub: 'City, Dzire, Verna' },
                { label: 'Adventure SUVs', sub: 'Creta, Nexon, Seltos' },
                { label: 'Luxury & Premium', sub: 'Mercedes, Audi, BMW' },
              ].map((c) => (
                <li key={c.label} className="group cursor-default">
                  <div className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{c.label}</div>
                  <div className="text-xs text-slate-500 mt-1">{c.sub}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="lg:col-span-3">
            <h4 className="font-bold text-white mb-6 text-sm uppercase tracking-widest">Contact Us</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-sm text-slate-400 leading-relaxed pt-1">
                  <strong className="text-slate-200 block mb-1">Sector 37, Noida</strong>
                  Shop No. 14, Block C Market<br/>
                  UP 201301, India
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-sm">
                  <a href="tel:+919876543210" className="text-slate-200 font-bold hover:text-orange-500 transition block">+91 98765 43210</a>
                  <a href="tel:+918765432109" className="text-slate-500 hover:text-orange-500 transition text-xs">+91 87654 32109</a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-orange-500" />
                </div>
                <div className="text-sm">
                  <a href="mailto:support@desirent.in" className="text-slate-200 font-bold hover:text-orange-500 transition block">support@desirent.in</a>
                  <a href="mailto:bookings@desirent.in" className="text-slate-500 hover:text-orange-500 transition text-xs">bookings@desirent.in</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter / Trust Badge */}
        <div className="mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-white font-bold text-sm">100% Safe & Secure</div>
              <div className="text-slate-500 text-xs">Verified Cars • Fully Insured • 24/7 Support</div>
            </div>
          </div>
          
          <div className="flex bg-slate-900 border border-slate-800 rounded-xl p-1 max-w-sm w-full">
            <input 
              type="email" 
              placeholder="Subscribe to newsletter" 
              className="bg-transparent border-none outline-none text-sm text-white px-4 w-full placeholder:text-slate-600"
            />
            <button className="bg-orange-600 hover:bg-orange-500 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors">
              Join
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-slate-950 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-500">
          <p className="flex items-center gap-1">
            © {new Date().getFullYear()} DesiRent. Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> in India 🇮🇳
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Refunds</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
