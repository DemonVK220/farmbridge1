import React, { useState } from 'react';
import {
  Sprout,
  Search,
  Mic,
  ShoppingCart,
  User,
  ShieldCheck,
  PhoneCall,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Users,
  CalendarCheck,
  Scale,
  Truck,
  Building2,
  Lock,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { UserRole } from '../types';
import { VoiceSearchModal } from './VoiceSearchModal';
import { RupeeSymbol } from './Currency';

export const Navbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentView,
    setCurrentView,
    cartCount,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useApp();

  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [voiceSearchOpen, setVoiceSearchOpen] = useState(false);

  const roles: { role: UserRole; label: string; icon: any } = [
    { role: 'visitor' as UserRole, label: t.visitor, icon: User },
    { role: 'farmer' as UserRole, label: t.farmer, icon: Sprout },
    { role: 'customer' as UserRole, label: t.customer, icon: ShoppingCart },
    { role: 'business' as UserRole, label: t.business, icon: Building2 },
    { role: 'fpo' as UserRole, label: t.fpo, icon: Users },
    { role: 'delivery' as UserRole, label: t.delivery, icon: Truck },
    { role: 'admin' as UserRole, label: t.admin, icon: ShieldCheck },
  ] as any;

  const handleRoleSelect = (role: UserRole) => {
    setCurrentRole(role);
    setRoleDropdownOpen(false);
    // Route to appropriate initial dashboard if switched
    if (role === 'farmer') setCurrentView('farmer_dashboard');
    else if (role === 'customer') setCurrentView('customer_dashboard');
    else if (role === 'business') setCurrentView('business_dashboard');
    else if (role === 'fpo') setCurrentView('fpo_dashboard');
    else if (role === 'delivery') setCurrentView('delivery_dashboard');
    else if (role === 'admin') setCurrentView('admin_dashboard');
    else setCurrentView('home');
  };

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Millets', 'Spices'];

  return (
    <>
      {/* Top Banner: Pilot Transparency & Zero Platform Fee Notice */}
      <div className="bg-emerald-950 text-emerald-100 text-xs px-4 py-1.5 border-b border-emerald-900 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="bg-emerald-700 text-white font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">
            Fair Direct Trade
          </span>
          <span className="inline-flex items-center">
            Platform Fee: <RupeeSymbol size={10} className="mx-0.5 text-white" />0 for Farmers & Customers
          </span>
          <span className="hidden md:inline text-emerald-300">• 5-Level Evidence Verification • Batch QR Traceability</span>
        </div>

        {/* Quick Role & Language Switcher in Top Bar */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 text-emerald-200 hover:text-white font-medium text-xs py-0.5 px-2 rounded hover:bg-emerald-900 transition-colors cursor-pointer"
            >
              <span>{language === 'en' ? 'English' : language === 'ta' ? 'தமிழ்' : 'हिन्दी'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-28 bg-white text-stone-900 rounded-xl shadow-xl border border-stone-200 py-1 z-50 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('en');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 ${language === 'en' ? 'font-bold text-emerald-800' : ''}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('ta');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 ${language === 'ta' ? 'font-bold text-emerald-800' : ''}`}
                >
                  தமிழ் (Tamil)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLanguage('hi');
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-emerald-50 ${language === 'hi' ? 'font-bold text-emerald-800' : ''}`}
                >
                  हिन्दी (Hindi)
                </button>
              </div>
            )}
          </div>

          {/* Quick Active Role Indicator & Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-medium text-xs py-0.5 px-2.5 rounded-full transition-colors cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="capitalize">{currentRole} Mode</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1 w-56 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 text-xs">
                <div className="px-3 py-1.5 border-b border-stone-100 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  Switch Active Role Interface
                </div>
                {roles.map((r: any) => {
                  const Icon = r.icon;
                  return (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => handleRoleSelect(r.role)}
                      className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-emerald-50 transition-colors cursor-pointer ${
                        currentRole === r.role ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-stone-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-emerald-700" />
                        <span>{r.label}</span>
                      </div>
                      {currentRole === r.role && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      )}
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
            {/* Logo */}
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
              aria-label="FarmBridge India Home"
            >
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
                <Sprout className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <span className="font-extrabold text-xl md:text-2xl tracking-tight text-emerald-950 flex items-center gap-1 font-serif">
                  FarmBridge<span className="text-emerald-700">.in</span>
                </span>
                <span className="block text-[10px] md:text-[11px] text-stone-500 font-medium -mt-1 tracking-tight">
                  {t.tagline}
                </span>
              </div>
            </button>

            {/* Central Search Bar (Desktop) */}
            <div className="hidden lg:flex items-center flex-1 max-w-xl mx-4">
              <div className="relative w-full flex items-center bg-stone-100 rounded-2xl border border-stone-300 focus-within:border-emerald-700 focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="text-xs font-semibold text-stone-700 bg-transparent pl-3 pr-2 py-2.5 border-r border-stone-300 focus:outline-none cursor-pointer"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <div className="flex items-center flex-1 px-3">
                  <Search className="w-4 h-4 text-stone-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.searchPlaceholder}
                    className="w-full bg-transparent text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') setCurrentView('browse');
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => setVoiceSearchOpen(true)}
                  className="p-2 mr-1 text-stone-500 hover:text-emerald-800 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
                  title="Voice Search in Indian Languages"
                  aria-label="Voice Search"
                >
                  <Mic className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('browse')}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold px-4 py-2.5 rounded-r-2xl transition-colors cursor-pointer"
                >
                  Search
                </button>
              </div>
            </div>

            {/* Navigation Actions */}
            <div className="flex items-center gap-1.5 md:gap-3">
              <button
                type="button"
                onClick={() => setCurrentView('browse')}
                className={`hidden md:inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  currentView === 'browse'
                    ? 'bg-emerald-50 text-emerald-900'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                Browse Produce
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('farmer_directory')}
                className={`hidden md:inline-flex items-center px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  currentView === 'farmer_directory'
                    ? 'bg-emerald-50 text-emerald-900'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                Farmers
              </button>

              <button
                type="button"
                onClick={() => setCurrentView('helplines')}
                className={`hidden lg:inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  currentView === 'helplines'
                    ? 'bg-emerald-50 text-emerald-900'
                    : 'text-stone-700 hover:bg-stone-100'
                }`}
              >
                <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                <span>Helplines</span>
              </button>

              {/* Basket / Cart Icon */}
              <button
                type="button"
                onClick={() => setCurrentView('cart')}
                className="relative p-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
                aria-label={`Shopping Basket (${cartCount} items)`}
              >
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-800 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Role Action Button */}
              {currentRole === 'visitor' ? (
                <button
                  type="button"
                  onClick={() => handleRoleSelect('farmer')}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Sell on FarmBridge
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (currentRole === 'farmer') setCurrentView('farmer_dashboard');
                    else if (currentRole === 'customer') setCurrentView('customer_dashboard');
                    else if (currentRole === 'business') setCurrentView('business_dashboard');
                    else if (currentRole === 'fpo') setCurrentView('fpo_dashboard');
                    else if (currentRole === 'delivery') setCurrentView('delivery_dashboard');
                    else if (currentRole === 'admin') setCurrentView('admin_dashboard');
                  }}
                  className="bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="capitalize">{currentRole} Desk</span>
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-xl cursor-pointer"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Row */}
          <div className="lg:hidden pb-3 pt-1">
            <div className="relative flex items-center bg-stone-100 rounded-xl border border-stone-300 focus-within:border-emerald-700">
              <Search className="w-4 h-4 text-stone-400 ml-3 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tomatoes, onions, millets..."
                className="w-full bg-transparent text-xs py-2 text-stone-900 placeholder:text-stone-400 focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCurrentView('browse');
                }}
              />
              <button
                type="button"
                onClick={() => setVoiceSearchOpen(true)}
                className="p-2 text-stone-500 hover:text-emerald-800"
                aria-label="Voice Search"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-2 text-sm shadow-xl">
            <button
              type="button"
              onClick={() => {
                setCurrentView('home');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 font-semibold text-stone-900"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('browse');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700"
            >
              Browse Fresh Produce
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('farmer_directory');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700"
            >
              Verified Farmers Directory
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('surplus_deals');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center justify-between"
            >
              <span>Surplus Harvest Deals</span>
              <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                Discounts
              </span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('group_orders');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700"
            >
              Neighbourhood Group Orders
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('weekly_basket');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700"
            >
              Weekly Produce Basket
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('verification_centre');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700"
            >
              5-Level Trust Ladder
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('yield_sanity_check');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700"
            >
              Yield Sanity & Anti-Reseller Tool
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('assisted_onboarding');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700"
            >
              CSC Assisted Onboarding (Proposed)
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('helplines');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700 flex items-center gap-2"
            >
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <span>Helplines (Kisan, PMFBY, Consumer)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('pricing');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700"
            >
              Pricing Plans (Marketplace is ₹0)
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentView('impact');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100 text-stone-700"
            >
              Social Impact & Pilot Metrics
            </button>
          </div>
        )}
      </header>

      {/* Voice Search Modal */}
      <VoiceSearchModal
        isOpen={voiceSearchOpen}
        onClose={() => setVoiceSearchOpen(false)}
        onSearch={(query) => {
          setSearchQuery(query);
          setCurrentView('browse');
        }}
      />
    </>
  );
};
