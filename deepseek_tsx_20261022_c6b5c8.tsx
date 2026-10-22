import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole, FarmerProfile, HarvestBatch, ProductListing, CartItem, OrderRecord,
  GroupOrderRecord, BasketSubscriptionRecord, HelplineRecord, RFQRecord,
  AppNotification, LoggedInUser, CookieConsent, AccessibilityPreferences,
} from '../types';
import {
  SEED_FARMERS, SEED_BATCHES, SEED_PRODUCTS, SEED_GROUP_ORDERS,
  SEED_BASKET_SUBSCRIPTIONS, SEED_HELPLINES, SEED_ORDERS, SEED_RFQS,
} from '../data/seedData';
import { calculateSurplusDiscount, calculateCheckoutPricing, evaluateYieldSanity } from '../utils/rules';
import { usePersistedState } from '../utils/usePersistedState';
import { apiClient, API_MODE } from '../api/client';
import { tokenStore } from '../utils/tokenStore';

export type AppView =
  | 'home' | 'browse' | 'product_detail' | 'farmer_directory' | 'farmer_profile'
  | 'batch_traceability' | 'cart' | 'checkout' | 'order_confirmation' | 'order_tracking'
  | 'group_orders' | 'weekly_basket' | 'surplus_deals' | 'verification_centre'
  | 'yield_sanity_check' | 'assisted_onboarding' | 'farmer_dashboard' | 'customer_dashboard'
  | 'business_dashboard' | 'fpo_dashboard' | 'delivery_dashboard' | 'admin_dashboard'
  | 'helplines' | 'about' | 'impact' | 'pricing' | 'faq'
  | 'legal_privacy' | 'legal_terms' | 'legal_refunds'
  | 'how_it_works' | 'login' | 'profile' | 'notifications' | 'saved'
  | 'contact' | 'accessibility' | 'not_found' | 'dev_diagnostics';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface AppContextType {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  selectedBatchId: string | null;
  setSelectedBatchId: (id: string | null) => void;
  selectedFarmerId: string | null;
  setSelectedFarmerId: (id: string | null) => void;
  selectedOrderId: string | null;
  setSelectedOrderId: (id: string | null) => void;

  farmers: FarmerProfile[];
  batches: HarvestBatch[];
  products: ProductListing[];
  cartItems: CartItem[];
  orders: OrderRecord[];
  groupOrders: GroupOrderRecord[];
  subscriptions: BasketSubscriptionRecord[];
  helplines: HelplineRecord[];
  rfqs: RFQRecord[];

  addToCart: (product: ProductListing, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;

  placeOrder: (
    deliveryAddress: string, customerName: string, customerPhone: string,
    deliveryMethod: 'home_delivery' | 'farm_pickup',
    paymentMethod: 'UPI' | 'Card' | 'CashOnDelivery',
    deliverySlot?: OrderRecord['deliverySlot']
  ) => OrderRecord;
  placeOrderAsync: (
    deliveryAddress: string, customerName: string, customerPhone: string,
    deliveryMethod: 'home_delivery' | 'farm_pickup',
    paymentMethod: 'UPI' | 'Card' | 'CashOnDelivery',
    deliverySlot?: OrderRecord['deliverySlot']
  ) => Promise<OrderRecord>;
  updateOrderStatus: (orderId: string, status: OrderRecord['orderStatus'], note: string) => void;
  updateOrderStatusAsync: (orderId: string, status: OrderRecord['orderStatus'], note: string) => Promise<void>;
  getNextOrderStatus: (current: OrderRecord['orderStatus']) => OrderRecord['orderStatus'] | null;
  rateOrder: (orderId: string, qualityRating: number, freshnessRating: number, deliveryRating: number, comment?: string) => void;
  reportOrderIssue: (orderId: string, category: 'quality' | 'quantity' | 'packaging' | 'delivery' | 'wrong_produce', description: string) => void;

  addFarmerListing: (listing: Partial<ProductListing> & { acreage: number }) => { flagged: boolean; reason?: string };
  verifyFarmerBadge: (farmerId: string, level: 1 | 2 | 3 | 4 | 5) => void;
  approveFlaggedListing: (productId: string) => void;

  joinGroupOrder: (groupId: string, quantityKg: number) => void;
  updateHelplineVerification: (helplineId: string, isVerified: boolean, notes: string) => void;

  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'warning' | 'error', message: string) => void;
  removeToast: (id: string) => void;

  navigateToProduct: (productId: string) => void;
  navigateToBatch: (batchId: string) => void;
  navigateToFarmer: (farmerId: string) => void;
  navigateToOrder: (orderId: string) => void;

  currentUser: LoggedInUser | null;
  login: (params: { name: string; phone: string; email?: string; role: UserRole }) => LoggedInUser;
  logout: () => void;
  updateUserProfile: (partial: Partial<LoggedInUser>, opts?: { silent?: boolean }) => void;
  apiMode: 'mock' | 'real';

  notifications: AppNotification[];
  unreadCount: number;
  addNotification: (n: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearAllNotifications: () => void;

  savedProductIds: string[];
  toggleSaveProduct: (productId: string) => void;
  isSaved: (productId: string) => boolean;

  recentlyViewedIds: string[];
  pushRecentlyViewed: (productId: string) => void;
  clearRecentlyViewed: () => void;

  cookieConsent: CookieConsent | null;
  setCookieConsent: (c: CookieConsent) => void;
  accessibilityPrefs: AccessibilityPreferences;
  updateAccessibilityPrefs: (p: Partial<AccessibilityPreferences>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEMO_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-demo-1', type: 'order',
    title: 'Order FB-2026-9921 is out for delivery',
    message: 'Your tomato and spinach order is en route.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isRead: false, actionView: 'order_tracking', actionId: 'order-fb-9921', actionLabel: 'Track Order',
  },
  {
    id: 'notif-demo-2', type: 'group',
    title: 'Whitefield group order is 78% funded',
    message: 'Add 5 more kg to unlock the 10% bulk tier.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    isRead: false, actionView: 'group_orders', actionLabel: 'View Group',
  },
  {
    id: 'notif-demo-3', type: 'surplus',
    title: 'Surplus deal: Country Tomatoes at 10% off',
    message: 'S. Muthuvel’s heirloom tomatoes enter the surplus window in ~3 days.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    isRead: true, actionView: 'surplus_deals', actionLabel: 'View Deal',
  },
  {
    id: 'notif-demo-4', type: 'verification',
    title: 'Level 5 residue report verified',
    message: 'NABL report for Batch #batch-tom-01 is now public.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    isRead: true, actionView: 'batch_traceability', actionId: 'batch-tom-01', actionLabel: 'View Batch',
  },
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentRole, setCurrentRole] = useState<UserRole>('visitor');
  const [currentView, setCurrentView] = useState<AppView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-tomatoes-01');
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>('batch-tom-01');
  const [selectedFarmerId, setSelectedFarmerId] = useState<string | null>('farmer-muthuvel');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>('order-fb-9921');

  const [farmers, setFarmers] = useState<FarmerProfile[]>(SEED_FARMERS);
  const [batches, setBatches] = useState<HarvestBatch[]>(SEED_BATCHES);
  const [products, setProducts] = useState<ProductListing[]>(SEED_PRODUCTS);
  const [orders, setOrders] = useState<OrderRecord[]>(SEED_ORDERS);
  const [groupOrders, setGroupOrders] = useState<GroupOrderRecord[]>(SEED_GROUP_ORDERS);
  const [subscriptions, setSubscriptions] = useState<BasketSubscriptionRecord[]>(SEED_BASKET_SUBSCRIPTIONS);
  const [helplines, setHelplines] = useState<HelplineRecord[]>(SEED_HELPLINES);
  const [rfqs, setRfqs] = useState<RFQRecord[]>(SEED_RFQS);

  const [cartItems, setCartItems] = usePersistedState<CartItem[]>('farmbridge.cart', []);
  const [currentUser, setCurrentUser] = usePersistedState<LoggedInUser | null>('farmbridge.user', null);
  const [savedProductIds, setSavedProductIds] = usePersistedState<string[]>('farmbridge.saved', ['prod-millet-01', 'prod-onions-01']);
  const [recentlyViewedIds, setRecentlyViewedIds] = usePersistedState<string[]>('farmbridge.recentlyViewed', []);
  const [cookieConsent, setCookieConsentState] = usePersistedState<CookieConsent | null>('farmbridge.cookieConsent', null);
  const [accessibilityPrefs, setAccessibilityPrefs] = usePersistedState<AccessibilityPreferences>('farmbridge.a11y', {
    fontSize: 'normal', highContrast: false, reducedMotion: false,
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>(DEMO_NOTIFICATIONS);

  /* ─── Hash-based routing ──────────────────────────────── */
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) return;
      if (hash.startsWith('batch/')) { setSelectedBatchId(hash.replace('batch/', '')); setCurrentView('batch_traceability'); }
      else if (hash.startsWith('product/')) { setSelectedProductId(hash.replace('product/', '')); setCurrentView('product_detail'); }
      else if (hash.startsWith('farmer/')) { setSelectedFarmerId(hash.replace('farmer/', '')); setCurrentView('farmer_profile'); }
      else if (hash.startsWith('order/')) { setSelectedOrderId(hash.replace('order/', '')); setCurrentView('order_tracking'); }
      else if (hash === 'browse') setCurrentView('browse');
      else if (hash === 'farmers') setCurrentView('farmer_directory');
      else if (hash === 'group-orders') setCurrentView('group_orders');
      else if (hash === 'weekly-basket') setCurrentView('weekly_basket');
      else if (hash === 'surplus') setCurrentView('surplus_deals');
      else if (hash === 'verification') setCurrentView('verification_centre');
      else if (hash === 'yield-sanity') setCurrentView('yield_sanity_check');
      else if (hash === 'assisted-onboarding') setCurrentView('assisted_onboarding');
      else if (hash === 'helplines') setCurrentView('helplines');
      else if (hash === 'pricing') setCurrentView('pricing');
      else if (hash === 'about') setCurrentView('about');
      else if (hash === 'faq') setCurrentView('faq');
      else if (hash === 'how-it-works') setCurrentView('how_it_works');
      else if (hash === 'login') setCurrentView('login');
      else if (hash === 'profile') setCurrentView('profile');
      else if (hash === 'notifications') setCurrentView('notifications');
      else if (hash === 'saved') setCurrentView('saved');
      else if (hash === 'contact') setCurrentView('contact');
      else if (hash === 'accessibility') setCurrentView('accessibility');
      else if (hash === 'dev-diagnostics') setCurrentView('dev_diagnostics');
      else if (hash === 'cart') setCurrentView('cart');
      else if (hash === 'checkout') setCurrentView('checkout');
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  /* ─── Toasts ─────────────────────────────────────────── */
  const addToast = (type: 'success' | 'info' | 'warning' | 'error', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => removeToast(id), 4500);
  };
  const removeToast = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  /* ─── Notifications ──────────────────────────────────── */
  const addNotification = (n: Omit<AppNotification, 'id' | 'timestamp' | 'isRead'>) => {
    const newN: AppNotification = {
      ...n,
      id: `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    setNotifications((prev) => [newN, ...prev]);
  };
  const markNotificationRead = (id: string) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  const markAllNotificationsRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  const clearAllNotifications = () => setNotifications([]);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* ─── Session ────────────────────────────────────────── */
  const login = ({ name, phone, email, role }: { name: string; phone: string; email?: string; role: UserRole }) => {
    const user: LoggedInUser = {
      id: `user-${Date.now()}`,
      name, phone, email, role,
      preferredLanguage: currentUser?.preferredLanguage || 'en',
      notificationsEnabled: true,
      smsAlertsEnabled: true,
      whatsappAlertsEnabled: false,
      joinedDate: new Date().toISOString(),
    };
    setCurrentUser(user);
    setCurrentRole(role);
    addToast('success', `Welcome to FarmBridge, ${name}!`);
    return user;
  };
  const logout = () => {
    setCurrentUser(null);
    setCurrentRole('visitor');
    tokenStore.clear();
    addToast('info', 'You have been signed out.');
    setCurrentView('home');
    window.location.hash = '';
  };
  const updateUserProfile = (partial: Partial<LoggedInUser>, opts?: { silent?: boolean }) => {
    setCurrentUser((u) => (u ? { ...u, ...partial } : u));
    if (!opts?.silent) addToast('success', 'Profile updated.');
  };

  /* ─── Cart ───────────────────────────────────────────── */
  const addToCart = (product: ProductListing, quantity: number = 1) => {
    const farmer = farmers.find((f) => f.id === product.farmerId) || farmers[0];
    const surplusInfo = calculateSurplusDiscount(
      product.harvestDate, product.expectedShelfLifeDays,
      product.basePricePerUnit, product.minFloorPricePerUnit
    );
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, {
        product, farmer, quantity,
        baseUnitPrice: product.basePricePerUnit,
        effectiveUnitPrice: surplusInfo.finalPricePerUnit,
        discountPercent: surplusInfo.discountPercent,
      }];
    });
    addToast('success', `Added ${quantity} ${product.unit} of ${product.title}.`);
  };
  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.product.id !== productId));
    addToast('info', 'Item removed from your basket.');
  };
  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return removeFromCart(productId);
    setCartItems((prev) => prev.map((i) => (i.product.id === productId ? { ...i, quantity } : i)));
  };
  const clearCart = () => setCartItems([]);
  const cartCount = cartItems.reduce((a, i) => a + i.quantity, 0);

  /* ─── Orders ─────────────────────────────────────────── */
  const placeOrder = (
    deliveryAddress: string, customerName: string, customerPhone: string,
    deliveryMethod: 'home_delivery' | 'farm_pickup',
    paymentMethod: 'UPI' | 'Card' | 'CashOnDelivery',
    deliverySlot?: OrderRecord['deliverySlot']
  ): OrderRecord => {
    const pricing = calculateCheckoutPricing(
      cartItems.map((i) => ({
        farmerId: i.farmer.id, farmerName: i.farmer.name,
        quantity: i.quantity, basePrice: i.baseUnitPrice, discountedPrice: i.effectiveUnitPrice,
      })),
      deliveryMethod
    );
    const orderId = `order-${Date.now().toString().slice(-6)}`;
    const orderCode = `FB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder: OrderRecord = {
      id: orderId, orderCode,
      customerName: customerName || 'Guest Buyer',
      customerPhone: customerPhone || '+91 00000 00000',
      deliveryAddress, deliveryMethod, deliverySlot,
      items: cartItems.map((i) => ({
        productId: i.product.id, title: i.product.title, cropKey: i.product.cropKey,
        farmerId: i.farmer.id, farmerName: i.farmer.name,
        quantity: i.quantity, unit: i.product.unit,
        unitPrice: i.effectiveUnitPrice, totalPrice: i.effectiveUnitPrice * i.quantity,
        batchId: i.product.batchId,
      })),
      produceSubtotal: pricing.itemsSubtotal,
      surplusSavings: pricing.totalSurplusSavings,
      deliveryFee: pricing.deliveryCharge,
      platformFee: 0,
      totalPayable: pricing.totalPayable + (deliverySlot?.fee || 0),
      paymentMethod, paymentStatus: 'demo_paid',
      orderStatus: 'order_placed',
      timeline: [{
        status: 'order_placed',
        timestamp: new Date().toISOString(),
        note: `Order confirmed via ${paymentMethod} (Simulated Demo Payment). Zero platform fee applied.`,
      }],
      confirmationOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString(),
      farmerSplits: pricing.farmerSplits.map((s) => ({
        farmerId: s.farmerId, farmerName: s.farmerName, amount: s.subtotal,
      })),
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setSelectedOrderId(newOrder.id);
    setCurrentView('order_confirmation');
    window.location.hash = `order/${newOrder.id}`;
    addToast('success', `Order ${newOrder.orderCode} placed successfully!`);
    addNotification({
      type: 'order',
      title: `Order ${newOrder.orderCode} confirmed`,
      message: `Your order is on the way to ${deliveryAddress.split(',')[0]}.`,
      actionView: 'order_tracking',
      actionId: newOrder.id,
      actionLabel: 'Track Order',
    });
    return newOrder;
  };

  const placeOrderAsync = async (
    deliveryAddress: string, customerName: string, customerPhone: string,
    deliveryMethod: 'home_delivery' | 'farm_pickup',
    paymentMethod: 'UPI' | 'Card' | 'CashOnDelivery',
    deliverySlot?: OrderRecord['deliverySlot']
  ): Promise<OrderRecord> => {
    if (API_MODE === 'mock') {
      return placeOrder(deliveryAddress, customerName, customerPhone, deliveryMethod, paymentMethod, deliverySlot);
    }
    try {
      const slotFee = deliverySlot?.fee || 0;
      const res = await apiClient.createOrder({
        items: cartItems.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        deliveryAddress, deliveryMethod, paymentMethod,
        customerName: customerName || 'Guest Buyer',
        customerPhone: customerPhone || '+91 00000 00000',
        deliverySlot: deliverySlot ? { ...deliverySlot, fee: slotFee } : undefined,
      });
      const serverOrder = res.order as any;
      const orderId = serverOrder.id || `order-${Date.now()}`;
      const newOrder: OrderRecord = {
        id: orderId,
        orderCode: serverOrder.orderCode || `FB-${new Date().getFullYear()}-0000`,
        customerName, customerPhone, deliveryAddress, deliveryMethod, deliverySlot,
        items: cartItems.map((i) => ({
          productId: i.product.id, title: i.product.title, cropKey: i.product.cropKey,
          farmerId: i.farmer.id, farmerName: i.farmer.name,
          quantity: i.quantity, unit: i.product.unit,
          unitPrice: i.effectiveUnitPrice, totalPrice: i.effectiveUnitPrice * i.quantity,
          batchId: i.product.batchId,
        })),
        produceSubtotal: serverOrder.produceSubtotal ?? 0,
        surplusSavings: serverOrder.surplusSavings ?? 0,
        deliveryFee: serverOrder.deliveryFee ?? 0,
        platformFee: 0,
        totalPayable: serverOrder.totalPayable ?? 0,
        paymentMethod, paymentStatus: 'demo_paid',
        orderStatus: 'order_placed',
        timeline: [{ status: 'order_placed', timestamp: new Date().toISOString(),
          note: `Order confirmed via ${paymentMethod} against real backend. Zero platform fee.` }],
        confirmationOtp: serverOrder.confirmationOtp || '0000',
        createdAt: new Date().toISOString(),
        farmerSplits: [],
      };
      setOrders((prev) => [newOrder, ...prev]);
      clearCart();
      setSelectedOrderId(newOrder.id);
      setCurrentView('order_confirmation');
      window.location.hash = `order/${newOrder.id}`;
      addToast('success', `Order ${newOrder.orderCode} placed successfully!`);
      addNotification({
        type: 'order',
        title: `Order ${newOrder.orderCode} confirmed`,
        message: `Your order is on the way to ${deliveryAddress.split(',')[0]}.`,
        actionView: 'order_tracking', actionId: newOrder.id, actionLabel: 'Track Order',
      });
      return newOrder;
    } catch (err: any) {
      addToast('error', err?.message || 'Order creation failed. Please try again.');
      throw err;
    }
  };

  const updateOrderStatus = (orderId: string, status: OrderRecord['orderStatus'], note: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o, orderStatus: status,
        timeline: [...o.timeline, { status, timestamp: new Date().toISOString(), note }],
      };
    }));
    addToast('info', `Order status updated to ${status}.`);

    const statusMessages: Record<string, { title: string; message: string } | null> = {
      farmer_confirmed: { title: 'Farmer confirmed your order', message: 'The batch is reserved and will be prepared for dispatch.' },
      produce_prepared: { title: 'Your produce is packed', message: 'Crates have been sorted, weighed, and tagged.' },
      picked_up: { title: 'Delivery partner picked up your order', message: 'Your harvest is on the way to the last-mile hub.' },
      in_transit: { title: 'Out for delivery', message: 'Your order arrives today. Have your OTP ready.' },
      delivered: { title: 'Delivered successfully', message: 'Your produce has been handed over. Please rate your experience.' },
      issue_reported: { title: 'Issue report received', message: 'Our dispute desk is reviewing this order.' },
    };
    const msg = statusMessages[status];
    if (msg) {
      addNotification({
        type: 'order', title: msg.title, message: msg.message,
        actionView: 'order_tracking', actionId: orderId, actionLabel: 'View Order',
      });
    }
  };

  const updateOrderStatusAsync = async (orderId: string, status: OrderRecord['orderStatus'], note: string): Promise<void> => {
    if (API_MODE === 'mock') {
      updateOrderStatus(orderId, status, note);
      return;
    }
    try {
      await apiClient.updateOrderStatus(orderId, status, note);
      updateOrderStatus(orderId, status, note);
    } catch (err: any) {
      addToast('error', err?.message || 'Failed to update order status.');
      throw err;
    }
  };

  const getNextOrderStatus = (current: OrderRecord['orderStatus']): OrderRecord['orderStatus'] | null => {
    const map: Partial<Record<OrderRecord['orderStatus'], OrderRecord['orderStatus']>> = {
      order_placed: 'farmer_confirmed',
      farmer_confirmed: 'produce_prepared',
      produce_prepared: 'picked_up',
      picked_up: 'in_transit',
      in_transit: 'delivered',
    };
    return map[current] || null;
  };

  const rateOrder = (orderId: string, qualityRating: number, freshnessRating: number, deliveryRating: number, comment?: string) => {
    setOrders((prev) => prev.map((o) =>
      o.id === orderId
        ? { ...o, rating: { qualityRating, freshnessRating, deliveryRating, comment, submittedAt: new Date().toISOString() } }
        : o
    ));
    addToast('success', 'Thank you! Your verified rating has been published.');
  };

  const reportOrderIssue = (orderId: string, category: 'quality' | 'quantity' | 'packaging' | 'delivery' | 'wrong_produce', description: string) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== orderId) return o;
      return {
        ...o, orderStatus: 'issue_reported',
        issueReport: { category, description, status: 'investigating', submittedAt: new Date().toISOString() },
        timeline: [...o.timeline, {
          status: 'issue_reported', timestamp: new Date().toISOString(),
          note: `Issue reported: ${category}. FarmBridge support is reviewing.`,
        }],
      };
    }));
    addToast('warning', 'Problem report received. Our verification desk is reviewing it.');
  };

  /* ─── Farmer operations ──────────────────────────────── */
  const addFarmerListing = (listingData: Partial<ProductListing> & { acreage: number }): { flagged: boolean; reason?: string } => {
    const cropKey = listingData.cropKey || 'tomatoes';
    const acreage = listingData.acreage || 1;
    const qty = listingData.availableQuantity || 100;
    const sanityCheck = evaluateYieldSanity(cropKey, acreage, qty);

    const newBatchId = `batch-${Date.now().toString().slice(-5)}`;
    const newBatch: HarvestBatch = {
      id: newBatchId,
      farmerId: listingData.farmerId || 'farmer-muthuvel',
      cropName: listingData.title || 'Fresh Crop Harvest',
      variety: listingData.variety || 'Local Native',
      harvestDate: listingData.harvestDate || new Date().toISOString(),
      harvestQuantityKg: qty, remainingQuantityKg: qty,
      unit: listingData.unit || 'kg',
      batchPhotoUrl: listingData.imageUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
      liveCaptureMetadata: {
        timestamp: new Date().toISOString(),
        approxVillage: 'Pennagaram Region, Dharmapuri',
        state: 'Tamil Nadu', accuracyMeters: 6.5,
        deviceCameraVerified: true,
        notes: 'Live device camera capture verified on-field.',
      },
      packingDate: new Date().toISOString(),
    };
    const newProdId = `prod-${Date.now().toString().slice(-6)}`;
    const newProduct: ProductListing = {
      id: newProdId, batchId: newBatchId,
      farmerId: listingData.farmerId || 'farmer-muthuvel',
      cropKey, title: listingData.title || 'Farm Fresh Produce',
      category: listingData.category || 'Vegetables',
      variety: listingData.variety || 'Native Variety',
      basePricePerUnit: listingData.basePricePerUnit || 35,
      minFloorPricePerUnit: listingData.minFloorPricePerUnit || 25,
      unit: listingData.unit || 'kg',
      availableQuantity: qty,
      minOrderQuantity: listingData.minOrderQuantity || 1,
      harvestDate: listingData.harvestDate || new Date().toISOString(),
      expectedShelfLifeDays: listingData.expectedShelfLifeDays || 5,
      imageUrl: newBatch.batchPhotoUrl,
      description: listingData.description || 'Farm harvested fresh produce.',
      storageTips: listingData.storageTips || 'Store in dry ventilated area.',
      mandiComparison: {
        mandiName: 'Local APMC Yard', marketDistrict: 'Dharmapuri',
        modalPricePerKg: (listingData.basePricePerUnit || 35) - 4,
        minPricePerKg: (listingData.basePricePerUnit || 35) - 8,
        maxPricePerKg: (listingData.basePricePerUnit || 35) + 2,
        marketDate: new Date().toISOString().split('T')[0],
        sourceDataset: 'Agmarknet Agricultural Marketing System',
        lastUpdated: 'Today 06:00 AM IST', isDemonstrationData: true,
        differenceRationale: 'FarmBridge price reflects direct-graded quality with no middle-agent commission.',
      },
      isFlaggedForYieldReview: sanityCheck.isFlaggedForReview,
      yieldCheckReason: sanityCheck.reason,
      status: sanityCheck.isFlaggedForReview ? 'under_review' : 'active',
      deliveryOptions: ['home_delivery', 'farm_pickup'],
    };
    setBatches((prev) => [newBatch, ...prev]);
    setProducts((prev) => [newProduct, ...prev]);

    if (sanityCheck.isFlaggedForReview) {
      addToast('warning', `Listing flagged for fair review: ${sanityCheck.reason}`);
      addNotification({
        type: 'verification',
        title: 'New listing under review',
        message: `Volume sanity check flagged "${newProduct.title}" for fair admin review.`,
        actionView: 'admin_dashboard', actionLabel: 'Open Queue',
      });
      return { flagged: true, reason: sanityCheck.reason };
    }
    addToast('success', `Listing published successfully with Batch ID ${newBatchId}!`);
    return { flagged: false };
  };

  const approveFlaggedListing = (productId: string) => {
    setProducts((prev) => prev.map((p) =>
      p.id === productId ? { ...p, isFlaggedForYieldReview: false, status: 'active' } : p
    ));
    addToast('success', 'Listing approved by administrator after documentation check.');
  };

  const verifyFarmerBadge = (farmerId: string, level: 1 | 2 | 3 | 4 | 5) => {
    setFarmers((prev) => prev.map((f) =>
      f.id === farmerId
        ? { ...f, verificationLevel: Math.max(f.verificationLevel, level) as 1 | 2 | 3 | 4 | 5 }
        : f
    ));
    addToast('success', `Farmer verification updated to Level ${level}!`);
  };

  /* ─── Group orders & helplines ───────────────────────── */
  const joinGroupOrder = (groupId: string, quantityKg: number) => {
    setGroupOrders((prev) => prev.map((grp) =>
      grp.id === groupId
        ? { ...grp, currentQuantityKg: grp.currentQuantityKg + quantityKg, participantsCount: grp.participantsCount + 1 }
        : grp
    ));
    addToast('success', `You joined the group order! +${quantityKg}kg closer to bulk tier.`);
    addNotification({
      type: 'group',
      title: 'Joined group order successfully',
      message: `You contributed ${quantityKg}kg to a neighbourhood hub.`,
      actionView: 'group_orders', actionLabel: 'View Group',
    });
  };

  const updateHelplineVerification = (helplineId: string, isVerified: boolean, notes: string) => {
    setHelplines((prev) => prev.map((h) =>
      h.id === helplineId
        ? { ...h, isVerified, awaitingOfficialVerification: !isVerified, lastVerifiedDate: new Date().toISOString().split('T')[0], notes }
        : h
    ));
    addToast('info', 'Helpline record verification audit updated.');
  };

  /* ─── Navigation ─────────────────────────────────────── */
  const pushRecentlyViewed = (productId: string) => {
    setRecentlyViewedIds((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)].slice(0, 8);
      return next;
    });
  };
  const clearRecentlyViewed = () => setRecentlyViewedIds([]);

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
    pushRecentlyViewed(productId);
    setCurrentView('product_detail');
    window.location.hash = `product/${productId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const navigateToBatch = (batchId: string) => {
    setSelectedBatchId(batchId);
    setCurrentView('batch_traceability');
    window.location.hash = `batch/${batchId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const navigateToFarmer = (farmerId: string) => {
    setSelectedFarmerId(farmerId);
    setCurrentView('farmer_profile');
    window.location.hash = `farmer/${farmerId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const navigateToOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setCurrentView('order_tracking');
    window.location.hash = `order/${orderId}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ─── Saved & prefs ──────────────────────────────────── */
  const toggleSaveProduct = (productId: string) => {
    setSavedProductIds((prev) => {
      if (prev.includes(productId)) {
        addToast('info', 'Removed from your saved items.');
        return prev.filter((id) => id !== productId);
      }
      addToast('success', 'Saved to your favourites.');
      return [...prev, productId];
    });
  };
  const isSaved = (productId: string) => savedProductIds.includes(productId);

  const setCookieConsent = (c: CookieConsent) => {
    setCookieConsentState(c);
    addToast('success', 'Cookie preferences saved.');
  };
  const updateAccessibilityPrefs = (p: Partial<AccessibilityPreferences>) => {
    setAccessibilityPrefs((prev) => ({ ...prev, ...p }));
  };

  return (
    <AppContext.Provider value={{
      currentRole, setCurrentRole,
      currentView, setCurrentView: (v) => { setCurrentView(v); window.scrollTo({ top: 0, behavior: 'smooth' }); },
      selectedProductId, setSelectedProductId, selectedBatchId, setSelectedBatchId,
      selectedFarmerId, setSelectedFarmerId, selectedOrderId, setSelectedOrderId,
      farmers, batches, products, cartItems, orders, groupOrders, subscriptions, helplines, rfqs,
      addToCart, removeFromCart, updateCartQuantity, clearCart, cartCount,
      placeOrder, placeOrderAsync,
      updateOrderStatus, updateOrderStatusAsync, getNextOrderStatus, rateOrder, reportOrderIssue,
      addFarmerListing, verifyFarmerBadge, approveFlaggedListing,
      joinGroupOrder, updateHelplineVerification,
      searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
      toasts, addToast, removeToast,
      navigateToProduct, navigateToBatch, navigateToFarmer, navigateToOrder,
      currentUser, login, logout, updateUserProfile, apiMode: API_MODE,
      notifications, unreadCount, addNotification,
      markNotificationRead, markAllNotificationsRead, clearAllNotifications,
      savedProductIds, toggleSaveProduct, isSaved,
      recentlyViewedIds, pushRecentlyViewed, clearRecentlyViewed,
      cookieConsent, setCookieConsent,
      accessibilityPrefs, updateAccessibilityPrefs,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}