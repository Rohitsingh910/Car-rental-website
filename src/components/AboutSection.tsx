import { Shield, Star, Clock, Headphones, Award, MapPin } from 'lucide-react';

export default function AboutSection() {
  const stats = [
    { value: '500+', label: 'Cars in Fleet', color: 'from-orange-500 to-red-500' },
    { value: '10K+', label: 'Happy Customers', color: 'from-green-500 to-emerald-600' },
    { value: '4.9', label: 'Average Rating', color: 'from-blue-500 to-indigo-600' },
  ];

  const whyUs = [
    { icon: Shield, title: 'Fully Insured', desc: 'All cars come with comprehensive insurance for complete peace of mind.' },
    { icon: Star, title: 'Top Rated Service', desc: 'Rated 4.9/5 by 10,000+ customers across Delhi NCR and India.' },
    { icon: Clock, title: '24/7 Support', desc: 'Round the clock customer support — call, WhatsApp, or email.' },
    { icon: Headphones, title: 'Easy Booking', desc: 'Book in 3 simple steps. Instant confirmation on WhatsApp.' },
    { icon: Award, title: 'Best Prices', desc: 'Guaranteed lowest prices for Indian cars. No hidden charges.' },
    { icon: MapPin, title: 'Multiple Pickups', desc: 'Pickup from 10+ locations across Noida, Delhi NCR.' },
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
            About DesiRent
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">About Let's Go</h2>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-10 border border-gray-100">
          {/* Driving Image */}
          <div className="relative h-56 md:h-72 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1200&h=400&fit=crop&auto=format"
              alt="Drive across India"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex items-end p-6">
              <div>
                <h3 className="text-white text-2xl font-bold">Drive Anywhere in India</h3>
                <p className="text-white/80 text-sm mt-1">From Noida to the Himalayas and back</p>
              </div>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <h3 className="font-bold text-gray-900 text-xl mb-4">Our Story</h3>
            <div className="space-y-3 text-gray-600 text-sm leading-relaxed">
              <p>
                <strong className="text-orange-600">DesiRent (Let's Go)</strong> is Noida's premier car rental service, located in Sector 37.
                We have been serving customers since 2020 with a commitment to providing reliable, affordable, and comfortable
                transportation solutions across Delhi NCR and beyond.
              </p>
              <p className="text-orange-600">
                Our fleet includes a wide range of vehicles from popular Indian brands like Maruti, Hyundai, Tata, Mahindra, Toyota,
                Honda and more. Whether you need a compact hatchback for city driving, a spacious SUV for family trips, or a
                comfortable MUV for group travel, we have the perfect car for you.
              </p>
              <p>
                We pride ourselves on our transparent pricing, well-maintained vehicles, and exceptional customer service.
                Your journey is our priority!
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {stats.map((s) => (
            <div key={s.label} className={`bg-gradient-to-r ${s.color} text-white rounded-xl p-5 text-center shadow-lg`}>
              <div className="text-3xl md:text-4xl font-extrabold">{s.value}</div>
              <div className="text-sm md:text-base opacity-90 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Why Choose Us */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900">Why Choose DesiRent?</h3>
          <p className="text-gray-500 mt-2">Everything you need for a perfect road trip</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyUs.map((item) => (
            <div key={item.title} className="flex gap-4 p-5 bg-orange-50 rounded-xl hover:shadow-md transition group">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition">
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 text-sm">{item.title}</h4>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
