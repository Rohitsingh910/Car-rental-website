import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, Instagram, Facebook, Twitter, HeadphonesIcon } from 'lucide-react';

export default function ContactSection() {
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

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
      title: 'Call Support',
      lines: ['+91 98765 43210', '+91 87654 32109'],
      sub: 'Mon–Sun: 7:00 AM – 10:00 PM',
      color: 'from-orange-400 to-red-500',
      action: { label: 'Call Now', href: 'tel:+919876543210' },
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp Chat',
      lines: ['+91 98765 43210'],
      sub: 'Instant replies in 5 mins',
      color: 'from-emerald-400 to-green-500',
      action: { label: 'Message Us', href: 'https://web.whatsapp.com/send?phone=919876543210' },
    },
    {
      icon: Mail,
      title: 'Email Us',
      lines: ['support@desirent.in', 'bookings@desirent.in'],
      sub: 'Reply within 2 hours',
      color: 'from-blue-400 to-indigo-500',
      action: { label: 'Send Email', href: 'mailto:support@desirent.in' },
    },
    {
      icon: MapPin,
      title: 'Visit Office',
      lines: ['Shop 14, Block C Market', 'Sector 37, Noida – 201301'],
      sub: 'Open all 7 days',
      color: 'from-purple-400 to-fuchsia-500',
      action: { label: 'Get Directions', href: 'https://www.google.com/maps/search/Sector+37+Noida' },
    },
  ];

  return (
    <section id="contact" className="py-24 bg-white relative">
      {/* Background decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-2 bg-orange-50 text-orange-600 text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-orange-100">
            <HeadphonesIcon className="w-4 h-4" /> 24/7 Support
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Let's Get In Touch</h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Have questions about your booking? Need a custom itinerary? We're here to help you plan the perfect road trip.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left: Contact Info Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {contactInfo.map((info) => (
              <div key={info.title} className="group bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-orange-100 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center mb-5 shadow-inner transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <info.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{info.title}</h3>
                {info.lines.map((line, i) => (
                  <p key={i} className="text-slate-600 font-medium text-sm leading-relaxed">{line}</p>
                ))}
                <p className="text-slate-400 text-xs mt-2 mb-4 font-medium">{info.sub}</p>
                <a
                  href={info.action.href}
                  target={info.action.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-orange-600 text-sm font-bold group-hover:text-orange-500 transition-colors"
                >
                  {info.action.label} 
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            ))}

            {/* Social Media Strip */}
            <div className="sm:col-span-2 bg-slate-50 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-100">
              <div className="text-slate-600 font-bold text-sm">Follow our journeys:</div>
              <div className="flex gap-3">
                {[
                  { icon: Instagram, href: '#', color: 'bg-pink-500 text-white' },
                  { icon: Facebook, href: '#', color: 'bg-blue-600 text-white' },
                  { icon: Twitter, href: '#', color: 'bg-sky-500 text-white' },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className={`w-10 h-10 ${s.color} rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform`}
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-5 bg-white border border-slate-100 rounded-3xl p-8 md:p-10 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
            {/* Soft decorative glow behind form */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            
            <h3 className="font-black text-slate-900 text-2xl mb-2 relative z-10">Send a Message</h3>
            <p className="text-slate-500 text-sm mb-8 relative z-10">We'll get back to you within 30 minutes.</p>

            {submitted ? (
              <div className="text-center py-12 animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                    <Send className="w-6 h-6" />
                  </div>
                </div>
                <h4 className="font-black text-slate-900 text-xl mb-2">Message Sent!</h4>
                <p className="text-slate-500 text-sm">Our support team will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                {/* Floating Label Input for Name */}
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={contactForm.name}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="peer w-full px-4 py-4 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-transparent focus:border-orange-500 focus:ring-0 outline-none transition-colors bg-slate-50/50 focus:bg-white"
                    placeholder="Full Name"
                  />
                  <label 
                    htmlFor="name" 
                    className={`absolute left-4 transition-all duration-200 pointer-events-none font-medium
                      ${focusedField === 'name' || contactForm.name ? '-top-2.5 bg-white px-2 text-xs text-orange-600' : 'top-4 text-sm text-slate-400'}`}
                  >
                    Full Name *
                  </label>
                </div>

                {/* Floating Label Input for Phone */}
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={contactForm.phone}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    required
                    className="peer w-full px-4 py-4 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-transparent focus:border-orange-500 focus:ring-0 outline-none transition-colors bg-slate-50/50 focus:bg-white"
                    placeholder="Phone Number"
                  />
                  <label 
                    htmlFor="phone" 
                    className={`absolute left-4 transition-all duration-200 pointer-events-none font-medium
                      ${focusedField === 'phone' || contactForm.phone ? '-top-2.5 bg-white px-2 text-xs text-orange-600' : 'top-4 text-sm text-slate-400'}`}
                  >
                    Phone Number *
                  </label>
                </div>

                {/* Floating Label Input for Email */}
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={contactForm.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="peer w-full px-4 py-4 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-transparent focus:border-orange-500 focus:ring-0 outline-none transition-colors bg-slate-50/50 focus:bg-white"
                    placeholder="Email Address"
                  />
                  <label 
                    htmlFor="email" 
                    className={`absolute left-4 transition-all duration-200 pointer-events-none font-medium
                      ${focusedField === 'email' || contactForm.email ? '-top-2.5 bg-white px-2 text-xs text-orange-600' : 'top-4 text-sm text-slate-400'}`}
                  >
                    Email Address (Optional)
                  </label>
                </div>

                {/* Floating Label Textarea for Message */}
                <div className="relative">
                  <textarea
                    name="message"
                    id="message"
                    value={contactForm.message}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows={4}
                    required
                    className="peer w-full px-4 py-4 border-2 border-slate-100 rounded-2xl text-slate-900 placeholder-transparent focus:border-orange-500 focus:ring-0 outline-none transition-colors bg-slate-50/50 focus:bg-white resize-none"
                    placeholder="How can we help?"
                  />
                  <label 
                    htmlFor="message" 
                    className={`absolute left-4 transition-all duration-200 pointer-events-none font-medium
                      ${focusedField === 'message' || contactForm.message ? '-top-2.5 bg-white px-2 text-xs text-orange-600' : 'top-4 text-sm text-slate-400'}`}
                  >
                    How can we help? *
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                >
                  <span>Send Message</span>
                  <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
