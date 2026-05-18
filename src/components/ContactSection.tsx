import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Instagram, Facebook, Twitter } from 'lucide-react';

export default function ContactSection() {
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setContactForm({ name: '', phone: '', email: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call / WhatsApp',
      lines: ['+91 98765 43210', '+91 87654 32109'],
      sub: 'Mon–Sun: 7:00 AM – 10:00 PM',
      color: 'text-green-600 bg-green-50',
      action: { label: 'Call Now', href: 'tel:+919876543210' },
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Us',
      lines: ['+91 98765 43210'],
      sub: 'Instant reply on WhatsApp',
      color: 'text-green-500 bg-green-50',
      action: { label: 'Chat on WhatsApp', href: 'https://web.whatsapp.com/send?phone=919876543210&text=Hi%20DesiRent%2C%20I%20want%20to%20book%20a%20car' },
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: ['support@desirent.in', 'bookings@desirent.in'],
      sub: 'Reply within 2 hours',
      color: 'text-blue-600 bg-blue-50',
      action: { label: 'Send Email', href: 'mailto:support@desirent.in' },
    },
    {
      icon: MapPin,
      title: 'Visit Our Office',
      lines: ['Shop No. 14, Block C Market', 'Sector 37, Noida – 201301', 'Uttar Pradesh, India'],
      sub: 'Open 7 days a week',
      color: 'text-orange-600 bg-orange-50',
      action: { label: 'Get Directions', href: 'https://www.google.com/maps/search/Sector+37+Noida+Uttar+Pradesh/@28.5706,77.3410,15z' },
    },
  ];

  return (
    <section id="contact" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
            📞 Get In Touch
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Contact Us</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            We're here 7 days a week to help you plan your perfect road trip
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {contactInfo.map((info) => (
              <div key={info.title} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${info.color}`}>
                  <info.icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{info.title}</h3>
                {info.lines.map((line, i) => (
                  <p key={i} className="text-gray-700 text-sm font-medium">{line}</p>
                ))}
                <p className="text-gray-400 text-xs mt-1 mb-3">{info.sub}</p>
                <a
                  href={info.action.href}
                  target={info.action.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-orange-600 text-sm font-semibold hover:text-orange-700 transition"
                >
                  {info.action.label} →
                </a>
              </div>
            ))}

            {/* Working Hours */}
            <div className="sm:col-span-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-6 text-white">
              <Clock className="w-6 h-6 mb-3 opacity-80" />
              <h3 className="font-bold text-lg mb-3">Working Hours</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {[
                  { day: 'Monday – Friday', time: '7:00 AM – 10:00 PM' },
                  { day: 'Saturday', time: '6:00 AM – 11:00 PM' },
                  { day: 'Sunday & Holidays', time: '7:00 AM – 9:00 PM' },
                  { day: 'Emergency 24/7', time: '+91 98765 43210' },
                ].map((h) => (
                  <div key={h.day} className="bg-white/10 rounded-xl p-3">
                    <div className="font-semibold text-white/90 text-xs">{h.day}</div>
                    <div className="text-white/70 text-xs mt-0.5">{h.time}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Media */}
            <div className="sm:col-span-2 flex flex-wrap gap-3">
              {[
                { icon: Instagram, label: '@desirent.in', href: '#', color: 'bg-pink-500' },
                { icon: Facebook, label: 'DesiRent India', href: '#', color: 'bg-blue-600' },
                { icon: Twitter, label: '@desirent', href: '#', color: 'bg-sky-500' },
                { icon: MessageCircle, label: 'WhatsApp', href: 'https://web.whatsapp.com/send?phone=919876543210&text=Hi%20DesiRent!', color: 'bg-green-500' },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl transition text-sm font-medium text-gray-700"
                >
                  <div className={`w-6 h-6 ${s.color} rounded-lg flex items-center justify-center`}>
                    <s.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-md">
            <h3 className="font-bold text-gray-800 text-lg mb-1">Send a Message</h3>
            <p className="text-gray-400 text-sm mb-5">We'll get back to you within 30 minutes</p>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl">✅</span>
                </div>
                <h4 className="font-bold text-gray-800 mb-1">Message Sent!</h4>
                <p className="text-gray-500 text-sm">We'll contact you shortly on your phone/email.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleChange}
                    placeholder="Rahul Sharma"
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={contactForm.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleChange}
                    placeholder="rahul@gmail.com"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">Message *</label>
                  <textarea
                    name="message"
                    value={contactForm.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="I want to rent a car for..."
                    required
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}

            {/* Map Embed — OpenStreetMap (always works, no API key needed) */}
            <div className="mt-5 rounded-xl overflow-hidden bg-gray-100 relative">
              <iframe
                title="DesiRent Location - Sector 37 Noida"
                src="https://www.openstreetmap.org/export/embed.html?bbox=77.3310%2C28.5606%2C77.3510%2C28.5806&layer=mapnik&marker=28.5706%2C77.3410"
                className="w-full border-0"
                style={{ height: '180px' }}
                loading="lazy"
              />
              <a
                href="https://www.google.com/maps/search/Sector+37+Noida+Uttar+Pradesh/@28.5706,77.3410,15z"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2.5 rounded-xl transition"
              >
                <MapPin className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
