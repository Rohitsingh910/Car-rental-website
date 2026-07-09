import { useState, useEffect, useRef } from 'react';
import { Car, Menu, X, LogOut, User, Shield, ChevronDown, Bell, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserDashboard from './UserDashboard';

interface NavbarProps {
  activeSection: string;
  onNavClick: (section: string) => void;
  onAdminClick: () => void;
  onOpenAuth: () => void;
}

export default function Navbar({ activeSection, onNavClick, onAdminClick, onOpenAuth }: NavbarProps) {
  const { user, logout, isAuthenticated, isAdmin, unreadCount } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showUserDashboard, setShowUserDashboard] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const navLinks = [
    { id: 'home',         label: 'Home'         },
    { id: 'cars',         label: 'Our Fleet'     },
    { id: 'destinations', label: 'Destinations'  },
    { id: 'about',        label: 'About Us'      },
    { id: 'contact',      label: 'Contact'       },
  ];

  return (
    <>
      {showUserDashboard && <UserDashboard onClose={() => setShowUserDashboard(false)} />}

      <nav className={`sticky top-0 z-50 transition-all duration-500
        ${scrolled ? 'bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] border-b border-slate-200/50' : 'bg-white border-b border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* ── Logo ── */}
            <button onClick={() => onNavClick('home')} className="flex items-center gap-2.5 group">
              <div className="bg-gradient-to-br from-orange-500 to-red-600 p-2 rounded-xl shadow-md group-hover:shadow-orange-200 transition-shadow">
                <Car className="h-5 w-5 text-white" />
              </div>
              <div className="text-left">
                <div className="text-xl font-extrabold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent tracking-tight leading-none">
                  DesiRent
                </div>
                <div className="text-[10px] text-gray-400 font-medium">Let's Go · Noida, Sector 37</div>
              </div>
            </button>

            {/* ── Desktop Nav ── */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => onNavClick(link.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${activeSection === link.id
                      ? 'bg-orange-50 text-orange-600 font-semibold'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'}`}>
                  {link.label}
                </button>
              ))}
            </div>

            {/* ── Auth Area ── */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  {/* Notification Bell */}
                  <button onClick={() => { setShowUserDashboard(true); }}
                    className="relative p-2 rounded-xl hover:bg-orange-50 transition-colors mr-1">
                    <Bell size={18} className="text-gray-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* User Button */}
                  <button onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 bg-orange-50 hover:bg-orange-100 px-3 py-2 rounded-xl transition-all border border-orange-100">
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm">
                      {user?.avatar}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-gray-800 leading-none">{user?.name.split(' ')[0]}</div>
                      <div className={`text-[10px] font-semibold capitalize ${user?.role === 'admin' ? 'text-purple-600' : 'text-orange-600'}`}>
                        {user?.role === 'admin' ? '👑 Admin' : '✅ User'}
                      </div>
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Dropdown */}
                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                      {/* User Info */}
                      <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white font-black">
                            {user?.avatar}
                          </div>
                          <div>
                            <div className="font-bold text-gray-800 text-sm">{user?.name}</div>
                            <div className="text-xs text-gray-500 truncate max-w-[120px]">{user?.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        <button onClick={() => { setShowUserDashboard(true); setShowUserDropdown(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                          <BookOpen size={16} className="text-orange-500" />
                          <span>My Bookings</span>
                          {unreadCount > 0 && (
                            <span className="ml-auto bg-red-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                              {unreadCount}
                            </span>
                          )}
                        </button>

                        <button onClick={() => { setShowUserDashboard(true); setShowUserDropdown(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">
                          <User size={16} className="text-blue-500" />
                          <span>My Profile</span>
                        </button>

                        {isAdmin && (
                          <button onClick={() => { onAdminClick(); setShowUserDropdown(false); }}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors">
                            <Shield size={16} className="text-purple-500" />
                            <span>Admin Panel</span>
                            <span className="ml-auto text-[10px] bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full font-bold">Admin</span>
                          </button>
                        )}
                      </div>

                      <div className="border-t border-gray-100 py-1">
                        <button onClick={() => { logout(); setShowUserDropdown(false); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button onClick={onOpenAuth}
                    className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all">
                    Login
                  </button>
                  <button onClick={onOpenAuth}
                    className="px-5 py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm font-bold rounded-xl hover:from-orange-600 hover:to-red-700 transition-all shadow-md shadow-orange-200 hover:shadow-orange-300">
                    Sign Up Free
                  </button>
                </div>
              )}
            </div>

            {/* ── Mobile: Notif + Hamburger ── */}
            <div className="md:hidden flex items-center gap-2">
              {isAuthenticated && (
                <button onClick={() => setShowUserDashboard(true)} className="relative p-2">
                  <Bell size={20} className="text-gray-600" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>
              )}
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-xl text-gray-600 hover:bg-orange-50 hover:text-orange-600 transition-all">
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map(link => (
                <button key={link.id} onClick={() => { onNavClick(link.id); setIsMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${activeSection === link.id ? 'bg-orange-50 text-orange-600 font-bold' : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'}`}>
                  {link.label}
                </button>
              ))}

              <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
                {isAuthenticated ? (
                  <>
                    {/* User info */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-orange-50 rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center text-white font-black">
                        {user?.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-800 text-sm">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                    <button onClick={() => { setShowUserDashboard(true); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-gray-100 rounded-xl text-sm font-semibold text-gray-700 hover:border-orange-200">
                      <BookOpen size={16} className="text-orange-500" /> My Bookings
                      {unreadCount > 0 && <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">{unreadCount}</span>}
                    </button>
                    {isAdmin && (
                      <button onClick={() => { onAdminClick(); setIsMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 bg-purple-50 rounded-xl text-sm font-semibold text-purple-700">
                        <Shield size={16} /> Admin Dashboard
                      </button>
                    )}
                    <button onClick={() => { logout(); setIsMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 rounded-xl text-sm font-semibold text-red-600">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { onOpenAuth(); setIsMenuOpen(false); }}
                      className="py-3 border-2 border-orange-200 text-orange-600 font-bold rounded-xl text-sm hover:bg-orange-50 transition-colors">
                      Login
                    </button>
                    <button onClick={() => { onOpenAuth(); setIsMenuOpen(false); }}
                      className="py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold rounded-xl text-sm">
                      Sign Up Free
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
