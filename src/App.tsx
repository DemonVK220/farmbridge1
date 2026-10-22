import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { BrowseProducePage } from './pages/BrowseProducePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { FarmerDirectoryPage } from './pages/FarmerDirectoryPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';
import { BatchTraceabilityPage } from './pages/BatchTraceabilityPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { GroupOrdersPage } from './pages/GroupOrdersPage';
import { WeeklyBasketPage } from './pages/WeeklyBasketPage';
import { SurplusDealsPage } from './pages/SurplusDealsPage';
import { VerificationCentrePage } from './pages/VerificationCentrePage';
import { YieldSanityCheckPage } from './pages/YieldSanityCheckPage';
import { AssistedOnboardingPage } from './pages/AssistedOnboardingPage';
import { FarmerDashboardPage } from './pages/FarmerDashboardPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { BusinessBuyerDashboardPage } from './pages/BusinessBuyerDashboardPage';
import { FpoDashboardPage } from './pages/FpoDashboardPage';
import { DeliveryPartnerDashboardPage } from './pages/DeliveryPartnerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { HelplineDirectoryPage } from './pages/HelplineDirectoryPage';
import { AboutAndImpactPage } from './pages/AboutAndImpactPage';
import { PricingPlansPage } from './pages/PricingPlansPage';
import { LegalAndFaqPage } from './pages/LegalAndFaqPage';

import { X, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

function AppContent() {
  const { currentView, toasts, removeToast } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'browse':
        return <BrowseProducePage />;
      case 'product_detail':
        return <ProductDetailPage />;
      case 'farmer_directory':
        return <FarmerDirectoryPage />;
      case 'farmer_profile':
        return <FarmerProfilePage />;
      case 'batch_traceability':
        return <BatchTraceabilityPage />;
      case 'cart':
        return <CartPage />;
      case 'checkout':
        return <CheckoutPage />;
      case 'order_confirmation':
        return <OrderConfirmationPage />;
      case 'order_tracking':
        return <OrderTrackingPage />;
      case 'group_orders':
        return <GroupOrdersPage />;
      case 'weekly_basket':
        return <WeeklyBasketPage />;
      case 'surplus_deals':
        return <SurplusDealsPage />;
      case 'verification_centre':
        return <VerificationCentrePage />;
      case 'yield_sanity_check':
        return <YieldSanityCheckPage />;
      case 'assisted_onboarding':
        return <AssistedOnboardingPage />;
      case 'farmer_dashboard':
        return <FarmerDashboardPage />;
      case 'customer_dashboard':
        return <CustomerDashboardPage />;
      case 'business_dashboard':
        return <BusinessBuyerDashboardPage />;
      case 'fpo_dashboard':
        return <FpoDashboardPage />;
      case 'delivery_dashboard':
        return <DeliveryPartnerDashboardPage />;
      case 'admin_dashboard':
        return <AdminDashboardPage />;
      case 'helplines':
        return <HelplineDirectoryPage />;
      case 'about':
      case 'impact':
        return <AboutAndImpactPage />;
      case 'pricing':
        return <PricingPlansPage />;
      case 'legal_privacy':
        return <LegalAndFaqPage initialSection="privacy" />;
      case 'legal_terms':
        return <LegalAndFaqPage initialSection="terms" />;
      case 'legal_refunds':
        return <LegalAndFaqPage initialSection="refunds" />;
      case 'faq':
        return <LegalAndFaqPage initialSection="faq" />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-emerald-200">
      <Navbar />

      <main className="flex-1">
        {renderCurrentView()}
      </main>

      <Footer />

      {/* Floating Toast Alerts */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-3.5 rounded-2xl shadow-xl border pointer-events-auto flex items-start gap-2.5 text-xs font-medium transition-all transform animate-in slide-in-from-bottom-2 ${
              toast.type === 'success'
                ? 'bg-emerald-950 text-emerald-100 border-emerald-800'
                : toast.type === 'warning'
                ? 'bg-amber-950 text-amber-100 border-amber-800'
                : toast.type === 'error'
                ? 'bg-red-950 text-red-100 border-red-800'
                : 'bg-stone-900 text-stone-100 border-stone-800'
            }`}
          >
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />}

            <p className="flex-1 leading-snug">{toast.message}</p>

            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-stone-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LanguageProvider>
  );
}
