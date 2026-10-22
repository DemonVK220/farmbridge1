import React, { useState, useRef } from 'react';
import {
  Sprout, Search, Mic, ShoppingCart, User, ShieldCheck, PhoneCall, Menu, X,
  ChevronDown, Heart, Bell, LogIn, Settings, LogOut, Truck, Building2, Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { VoiceSearchModal } from './VoiceSearchModal';
import { SearchHistoryDropdown } from './SearchHistoryDropdown';
import { RupeeSymbol } from './Currency';

export const Navbar: React.FC = () => {
  const {
    currentRole, setCurrentRole, currentView, setCurrentView,
    cartCount, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    currentUser, logout, unreadCount, savedProductIds,
  } = useApp();

  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [voiceSearchOpen, setVoiceSearchOpen] = useState(false);
  const desktopSearchRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Millets', 'Spices'];

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
    if (role === 'farmer') setCurrentView('farmer_dashboard');
    else if (role === 'customer') setCurrentView('customer_dashboard');
    else if (role === 'business') setCurrentView('business_dashboard');
    else if (role === 'fpo') setCurrentView('fpo_dashboard');
    else if (role === 'delivery') setCurrentView('delivery_dashboard');
    else if (role === 'admin') setCurrentView('admin_dashboard');
    else setCurrentView('home');
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 border-b border-emerald-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="bg-emerald-700 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Fair Direct Trade</span>
          <span className="inline-flex items-center">Platform Fee: <RupeeSymbol size={10} className="mx-0.5 text-white" />0 for Farmers & Customers</span>
          <span className="hidden md:inline text-emerald-300">• 5-Level Evidence Verification • Batch QR Traceability</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button onClick={() => setLangDropdownOpen(!langDropdownOpen)} className="flex items-center gap-1 text-emerald-200 hover:text-white font-medium text-xs py-0.5 px-2 rounded hover:bg-emerald-900 transition-colors cursor-pointer">
              <span>{language === 'en' ? 'English' : language === 'ta' ? 'தமிழ்' : 'हिन्दी'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white text-stone-900 rounded-xl shadow-xl border border-stone-200 py-1 z-50 text-xs font-medium">
                {(['en', 'ta', 'hi'] as const).map((lang) => (
                  <button key={lang} onClick={() => { setLanguage(lang); setLangDropdownOpen(false); }} className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 ${language === lang ? 'font-bold text-emerald-800' : ''}`}>
                    {lang === 'en' ? 'English' : lang === 'ta' ? 'தமிழ் (Tamil)' : 'हिन्दी (Hindi)'}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button onClick={() => setRoleDropdownOpen(!roleDropdownOpen)} className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-xs py-0.5 px-2.5 rounded-full transition-colors cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="capitalize">{currentRole} Mode</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-stone-100 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">Switch Active Role</div>
                {([
                  { role: 'visitor' as UserRole, label: t.visitor, icon: User },
                  { role: 'farmer' as UserRole, label: t.farmer, icon: Sprout },
                  { role: 'customer' as UserRole, label: t.customer, icon: ShoppingCart },
                  { role: 'business' as UserRole, label: t.business, icon: Building2 },
                  { role: 'fpo' as UserRole, label: t.fpo, icon: Users },
                  { role: 'delivery' as UserRole, label: t.delivery, icon: Truck },
                  { role: 'admin' as UserRole, label: t.admin, icon: ShieldCheck },
                ]).map((r) => {
                  const Icon = r.icon;
                  return (
                    <button key={r.role} onClick={() => handleRoleSelect(r.role)} className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-emerald-50 ${currentRole === r.role ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-stone-700'}`}>
                      <div className="flex items-center gap-2"><Icon className="w-4 h-4 text-emerald-700" /><span>{r.label}</span></div>
                      {currentRole === r.role && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            <button onClick={() => setCurrentView('home')} className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group" aria-label="FarmBridge Home">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="font-extrabold text-xl md:text-2xl tracking-tight text-emerald-950 flex items-center gap-1 font-serif">FarmBridge<span className="text-emerald-700">.in</span></span>
                <span className="block text-[10px] md:text-[11px] text-stone-500 font-medium -mt-1 tracking-tight">{t.tagline}</span>
              </div>
            </button>

            {/* Desktop search */}
            <div className="hidden lg:flex items-center flex-1 max-w-xl mx-4">
              <div className="relative w-full flex items-center bg-stone-100 rounded-2xl border border-stone-300 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="text-xs font-semibold text-stone-700 bg-transparent pl-3 pr-2 py-2.5 border-r border-stone-300 focus:outline-none cursor-pointer">
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="flex items-center flex-1 px-3 relative">
                  <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input ref={desktopSearchRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t.searchPlaceholder}
                    className="w-full bg-transparent text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none"
                    onKeyDown={(e) => { if (e.key === 'Enter') setCurrentView('browse'); }} />
                  <SearchHistoryDropdown inputRef={desktopSearchRef} query={searchQuery} onSelect={(q) => setSearchQuery(q)} onCommit={() => setCurrentView('browse')} />
                </div>
                <button onClick={() => setVoiceSearchOpen(true)} className="p-2 mr-1 text-stone-500 hover:text-emerald-800 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer" aria-label="Voice Search"><Mic className="w-4 h-4" /></button>
                <button onClick={() => setCurrentView('browse')} className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-r-2xl transition-colors cursor-pointer">Search</button>
              </div>
            </div>

            {/* Nav actions */}
            <div className="flex items-center gap-1.5 md:gap-2">
              <button onClick={() => setCurrentView('how_it_works')} className={`hidden lg:inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${currentView === 'how_it_works' ? 'bg-emerald-50 text-emerald-900' : 'text-stone-700 hover:bg-stone-100'}`}>How It Works</button>
              <button onClick={() => setCurrentView('farmer_directory')} className={`hidden md:inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${currentView === 'farmer_directory' ? 'bg-emerald-50 text-emerald-900' : 'text-stone-700 hover:bg-stone-100'}`}>Farmers</button>

              <button onClick={() => setCurrentView('saved')} className="relative p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer" aria-label="Saved items">
                <Heart className="w-5 h-5" />
                {savedProductIds.length > 0 && <span className="absolute -top-1 -right-1 bg-emerald-800 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{savedProductIds.length}</span>}
              </button>

              <button onClick={() => setCurrentView('notifications')} className="relative p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer" aria-label="Notifications">
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{unreadCount > 9 ? '9+' : unreadCount}</span>}
              </button>

              <button onClick={() => setCurrentView('cart')} className="relative p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer" aria-label={`Cart (${cartCount})`}>
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute -top-1 -right-1 bg-emerald-800 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{cartCount}</span>}
              </button>

              {currentUser ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-2xl bg-emerald-50 hover:bg-emerald-100 transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xs">{currentUser.name.charAt(0).toUpperCase()}</div>
                    <span className="hidden md:inline text-xs font-bold text-emerald-950 max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-emerald-800" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-1 w-56 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 text-xs">
                      <div className="px-3.5 py-2 border-b border-stone-100">
                        <strong className="block text-stone-900 text-sm truncate">{currentUser.name}</strong>
                        <span className="text-[11px] text-stone-500 block truncate">{currentUser.phone}</span>
                        <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider mt-1 inline-block">{currentUser.role}</span>
                      </div>
                      <button onClick={() => { setUserMenuOpen(false); setCurrentView('profile'); }} className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-emerald-50">
                        <Settings className="w-4 h-4 text-emerald-700" /><span>Profile & Settings</span>
                      </button>
                      <button onClick={() => { setUserMenuOpen(false); setCurrentView('notifications'); }} className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-emerald-50">
                        <Bell className="w-4 h-4 text-emerald-700" /><span>Notifications</span>
                        {unreadCount > 0 && <span className="ml-auto bg-red-600 text-white text-[10px] font-bold px-1.5 rounded-full">{unreadCount}</span>}
                      </button>
                      <button onClick={() => { setUserMenuOpen(false); setCurrentView('saved'); }} className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-emerald-50">
                        <Heart className="w-4 h-4 text-emerald-700" /><span>Saved Items</span>
                      </button>
                      <button onClick={() => { setUserMenuOpen(false); setCurrentView('accessibility'); }} className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-emerald-50">
                        <Settings className="w-4 h-4 text-emerald-700" /><span>Accessibility</span>
                      </button>
                      <div className="border-t border-stone-100 mt-1 pt-1">
                        <button onClick={() => { setUserMenuOpen(false); logout(); }} className="w-full text-left px-3.5 py-2 flex items-center gap-2 hover:bg-red-50 text-red-700">
                          <LogOut className="w-4 h-4" /><span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setCurrentView('login')} className="bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5">
                  <LogIn className="w-3.5 h-3.5" /><span className="hidden sm:inline">Sign In</span>
                </button>
              )}

              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer" aria-label="Menu">
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative flex items-center bg-stone-100 rounded-xl border border-stone-300 focus-within:border-emerald-700">
              <Search className="w-4 h-4 text-stone-400 ml-3 mr-2 shrink-0" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search tomatoes, onions, millets..." className="w-full bg-transparent text-xs py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none" onKeyDown={(e) => { if (e.key === 'Enter') setCurrentView('browse'); }} />
              <button onClick={() => setVoiceSearchOpen(true)} className="p-2 text-stone-500 hover:text-emerald-800" aria-label="Voice Search"><Mic className="w-4 h-4" /></button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-2 text-sm shadow-xl">
            {[
              ['Home', 'home'], ['Browse Produce', 'browse'], ['How It Works', 'how_it_works'],
              ['Verified Farmers', 'farmer_directory'], ['Surplus Deals', 'surplus_deals'],
              ['Group Orders', 'group_orders'], ['Weekly Basket', 'weekly_basket'],
              ['Verification Centre', 'verification_centre'], ['Yield Sanity Tool', 'yield_sanity_check'],
              ['Assisted Onboarding', 'assisted_onboarding'], ['Helplines', 'helplines'],
              ['Pricing Plans', 'pricing'], ['About & Impact', 'impact'],
              ['Contact Us', 'contact'], ['Accessibility', 'accessibility'],
            ].map(([label, view]) => (
              <button key={view} onClick={() => { setCurrentView(view as any); setMobileMenuOpen(false); }} className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700">{label}</button>
            ))}
          </div>
        )}
      </header>

      <VoiceSearchModal isOpen={voiceSearchOpen} onClose={() => setVoiceSearchOpen(false)} onSearch={(q) => { setSearchQuery(q); setCurrentView('browse'); }} />
    </>
  );
};