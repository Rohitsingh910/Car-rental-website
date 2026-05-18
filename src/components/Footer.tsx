import { Car, Phone, Mail, MapPin, Instagram, Facebook, Twitter, MessageCircle, ArrowRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* Top CTA Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-xl text-white">Ready to hit the road? 🚗</h3>
            <p className="text-white/80 text-sm mt-0.5">Book your car today — Starting from ₹1,500/day</p>
          </div>
          <a
            href="#cars"
            className="flex items-center gap-2 bg-white text-orange-600 font-bold px-6 py-3 rounded-xl hover:shadow-xl transition"
          >
            Book Now <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 p-2 rounded-xl">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-extrabold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">DesiRent</span>
                <div className="text-[10px] text-gray-500 -mt-0.5">Let's Go — Car Rental</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              India's most trusted car rental service based in Noida, Sector 37. Serving Delhi NCR and beyond since 2020.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Instagram, href: '#', bg: 'bg-pink-500' },
                { icon: Facebook, href: '#', bg: 'bg-blue-600' },
                { icon: Twitter, href: '#', bg: 'bg-sky-500' },
                { icon: MessageCircle, href: 'https://web.whatsapp.com/send?phone=919876543210&text=Hi%20DesiRent!', bg: 'bg-green-500' },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 ${s.bg} rounded-lg flex items-center justify-center hover:opacity-80 transition`}
                >
                  <s.icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '#home' },
                { label: 'Our Cars', href: '#cars' },
                { label: 'Destinations', href: '#destinations' },
                { label: 'About Us', href: '#about' },
                { label: 'Contact', href: '#contact' },
              ].map((l) => (
                <li key={l.label}>
                  <a href={l.href} className="text-gray-400 hover:text-orange-400 text-sm transition flex items-center gap-1.5 group">
                    <ArrowRight className="w-3 h-3 text-orange-500/0 group-hover:text-orange-500 transition" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Car Categories */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Car Categories</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Hatchbacks', sub: 'Swift, Baleno, i20' },
                { label: 'Sedans', sub: 'City, Dzire, Verna' },
                { label: 'SUVs', sub: 'Creta, Nexon, Seltos' },
                { label: 'Premium SUVs', sub: 'XUV700, Harrier' },
                { label: 'MUVs / MPVs', sub: 'Innova, Ertiga' },
              ].map((c) => (
                <li key={c.label} className="text-sm">
                  <span className="text-gray-300 font-medium">{c.label}</span>
                  <span className="text-gray-500 ml-1 text-xs">— {c.sub}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-400">
                  <div className="text-gray-300 font-medium">Shop No. 14, Block C Market</div>
                  <div>Sector 37, Noida – 201301</div>
                  <div>Uttar Pradesh, India</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <div className="text-sm">
                  <a href="tel:+919876543210" className="text-gray-300 hover:text-orange-400 transition block">+91 98765 43210</a>
                  <a href="tel:+918765432109" className="text-gray-400 hover:text-orange-400 transition text-xs">+91 87654 32109</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <div className="text-sm">
                  <a href="mailto:support@desirent.in" className="text-gray-300 hover:text-orange-400 transition block">support@desirent.in</a>
                  <a href="mailto:bookings@desirent.in" className="text-gray-400 hover:text-orange-400 transition text-xs">bookings@desirent.in</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <p>© 2024 DesiRent (Let's Go Car Rental). All rights reserved. Made with ❤️ in India 🇮🇳</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-300 transition">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition">Terms & Conditions</a>
            <a href="#" className="hover:text-gray-300 transition">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
