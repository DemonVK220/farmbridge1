import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserRole,
  FarmerProfile,
  HarvestBatch,
  ProductListing,
  CartItem,
  OrderRecord,
  GroupOrderRecord,
  BasketSubscriptionRecord,
  HelplineRecord,
  RFQRecord,
} from '../types';
import {
  SEED_FARMERS,
  SEED_BATCHES,
  SEED_PRODUCTS,
  SEED_GROUP_ORDERS,
  SEED_BASKET_SUBSCRIPTIONS,
  SEED_HELPLINES,
  SEED_ORDERS,
  SEED_RFQS,
} from '../data/seedData';
import { calculateSurplusDiscount, calculateCheckoutPricing, evaluateYieldSanity } from '../utils/rules';

export type AppView =
  | 'home'
  | 'browse'
  | 'product_detail'
  | 'farmer_directory'
  | 'farmer_profile'
  | 'batch_traceability'
  | 'cart'
  | 'checkout'
  | 'order_confirmation'
  | 'order_tracking'
  | 'group_orders'
  | 'weekly_basket'
  | 'surplus_deals'
  | 'verification_centre'
  | 'yield_sanity_check'
  | 'assisted_onboarding'
  | 'farmer_dashboard'
  | 'customer_dashboard'
  | 'business_dashboard'
  | 'fpo_dashboard'
  | 'delivery_dashboard'
  | 'admin_dashboard'
  | 'helplines'
  | 'about'
  | 'impact'
  | 'pricing'
  | 'faq'
  | 'legal_privacy'
  | 'legal_terms'
  | 'legal_refunds';

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

  // Data
  farmers: FarmerProfile[];
  batches: HarvestBatch[];
  products: ProductListing[];
  cartItems: CartItem[];
  orders: OrderRecord[];
  groupOrders: GroupOrderRecord[];
  subscriptions: BasketSubscriptionRecord[];
  helplines: HelplineRecord[];
  rfqs: RFQRecord[];

  // Cart operations
  addToCart: (product: ProductListing, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;

  // Order operations
  placeOrder: (
    deliveryAddress: string,
    customerName: string,
    customerPhone: string,
    deliveryMethod: 'home_delivery' | 'farm_pickup',
    paymentMethod: 'UPI' | 'Card' | 'CashOnDelivery'
  ) => OrderRecord;
  updateOrderStatus: (orderId: string, status: OrderRecord['orderStatus'], note: string) => void;
  rateOrder: (orderId: string, qualityRating: number, freshnessRating: number, deliveryRating: number, comment?: string) => void;
  reportOrderIssue: (orderId: string, category: 'quality' | 'quantity' | 'packaging' | 'delivery' | 'wrong_produce', description: string) => void;

  // Farmer operations
  addFarmerListing: (listing: Partial<ProductListing> & { acreage: number }) => { flagged: boolean; reason?: string };
  verifyFarmerBadge: (farmerId: string, level: 1 | 2 | 3 | 4 | 5) => void;
  approveFlaggedListing: (productId: string) => void;

  // Group orders
  joinGroupOrder: (groupId: string, quantityKg: number) => void;

  // Helplines
  updateHelplineVerification: (helplineId: string, isVerified: boolean, notes: string) => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;

  // Notifications
  toasts: ToastMessage[];
  addToast: (type: 'success' | 'info' | 'warning' | 'error', message: string) => void;
  removeToast: (id: string) => void;

  // Navigation helper
  navigateToProduct: (productId: string) => void;
  navigateToBatch: (batchId: string) => void;
  navigateToFarmer: (farmerId: string) => void;
  navigateToOrder: (orderId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>(SEED_ORDERS);
  const [groupOrders, setGroupOrders] = useState<GroupOrderRecord[]>(SEED_GROUP_ORDERS);
  const [subscriptions, setSubscriptions] = useState<BasketSubscriptionRecord[]>(SEED_BASKET_SUBSCRIPTIONS);
  const [helplines, setHelplines] = useState<HelplineRecord[]>(SEED_HELPLINES);
  const [rfqs, setRfqs] = useState<RFQRecord[]>(SEED_RFQS);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Handle URL hash changes for back-button compatibility, deep-linking, and direct nav
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) return;
      if (hash.startsWith('batch/')) {
        const bId = hash.replace('batch/', '');
        setSelectedBatchId(bId);
        setCurrentView('batch_traceability');
      } else if (hash.startsWith('product/')) {
        const pId = hash.replace('product/', '');
        setSelectedProductId(pId);
        setCurrentView('product_detail');
      } else if (hash.startsWith('farmer/')) {
        const fId = hash.replace('farmer/', '');
        setSelectedFarmerId(fId);
        setCurrentView('farmer_profile');
      } else if (hash.startsWith('order/')) {
        const oId = hash.replace('order/', '');
        setSelectedOrderId(oId);
        setCurrentView('order_tracking');
      } else if (hash === 'cart') {
        setCurrentView('cart');
      } else if (hash === 'checkout') {
        setCurrentView('checkout');
      } else if (hash === 'browse') {
        setCurrentView('browse');
      } else if (hash === 'farmers') {
        setCurrentView('farmer_directory');
      } else if (hash === 'group-orders') {
        setCurrentView('group_orders');
      } else if (hash === 'weekly-basket') {
        setCurrentView('weekly_basket');
      } else if (hash === 'surplus') {
        setCurrentView('surplus_deals');
      } else if (hash === 'verification') {
        setCurrentView('verification_centre');
      } else if (hash === 'yield-sanity') {
        setCurrentView('yield_sanity_check');
      } else if (hash === 'assisted-onboarding') {
        setCurrentView('assisted_onboarding');
      } else if (hash === 'helplines') {
        setCurrentView('helplines');
      } else if (hash === 'pricing') {
        setCurrentView('pricing');
      } else if (hash === 'about') {
        setCurrentView('about');
      } else if (hash === 'faq') {
        setCurrentView('faq');
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const addToast = (type: 'success' | 'info' | 'warning' | 'error', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addToCart = (product: ProductListing, quantity: number = 1) => {
    const farmer = farmers.find((f) => f.id === product.farmerId) || farmers[0];
    const surplusInfo = calculateSurplusDiscount(
      product.harvestDate,
      product.expectedShelfLifeDays,
      product.basePricePerUnit,
      product.minFloorPricePerUnit
    );

    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          product,
          farmer,
          quantity,
          baseUnitPrice: product.basePricePerUnit,
          effectiveUnitPrice: surplusInfo.finalPricePerUnit,
          discountPercent: surplusInfo.discountPercent,
        },
      ];
    });

    addToast(
      'success',
      `Added ${quantity} ${product.unit} of ${product.title} to your basket.`
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    addToast('info', 'Item removed from your basket.');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const placeOrder = (
    deliveryAddress: string,
    customerName: string,
    customerPhone: string,
    deliveryMethod: 'home_delivery' | 'farm_pickup',
    paymentMethod: 'UPI' | 'Card' | 'CashOnDelivery'
  ): OrderRecord => {
    const pricing = calculateCheckoutPricing(
      cartItems.map((item) => ({
        farmerId: item.farmer.id,
        farmerName: item.farmer.name,
        quantity: item.quantity,
        basePrice: item.baseUnitPrice,
        discountedPrice: item.effectiveUnitPrice,
      })),
      deliveryMethod
    );

    const orderId = `order-${Date.now().toString().slice(-6)}`;
    const orderCode = `FB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: OrderRecord = {
      id: orderId,
      orderCode,
      customerName: customerName || 'V. K. Leon',
      customerPhone: customerPhone || '+91 98401 23456',
      deliveryAddress,
      deliveryMethod,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        title: item.product.title,
        cropKey: item.product.cropKey,
        farmerId: item.farmer.id,
        farmerName: item.farmer.name,
        quantity: item.quantity,
        unit: item.product.unit,
        unitPrice: item.effectiveUnitPrice,
        totalPrice: item.effectiveUnitPrice * item.quantity,
        batchId: item.product.batchId,
      })),
      produceSubtotal: pricing.itemsSubtotal,
      surplusSavings: pricing.totalSurplusSavings,
      deliveryFee: pricing.deliveryCharge,
      platformFee: 0, // Mandated ₹0
      totalPayable: pricing.totalPayable,
      paymentMethod,
      paymentStatus: 'demo_paid',
      orderStatus: 'order_placed',
      timeline: [
        {
          status: 'order_placed',
          timestamp: new Date().toISOString(),
          note: `Order confirmed via ${paymentMethod} (Simulated Demo Payment). Zero platform fee applied.`,
        },
      ],
      confirmationOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString(),
      farmerSplits: pricing.farmerSplits.map((s) => ({
        farmerId: s.farmerId,
        farmerName: s.farmerName,
        amount: s.subtotal,
      })),
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setSelectedOrderId(newOrder.id);
    setCurrentView('order_confirmation');
    window.location.hash = `order/${newOrder.id}`;
    addToast('success', `Order ${newOrder.orderCode} placed successfully!`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderRecord['orderStatus'], note: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            orderStatus: status,
            timeline: [
              ...order.timeline,
              {
                status,
                timestamp: new Date().toISOString(),
                note,
              },
            ],
          };
        }
        return order;
      })
    );
    addToast('info', `Order ${orderId} status updated to ${status}.`);
  };

  const rateOrder = (
    orderId: string,
    qualityRating: number,
    freshnessRating: number,
    deliveryRating: number,
    comment?: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            rating: {
              qualityRating,
              freshnessRating,
              deliveryRating,
              comment,
              submittedAt: new Date().toISOString(),
            },
          };
        }
        return order;
      })
    );
    addToast('success', 'Thank you! Your verified rating has been published.');
  };

  const reportOrderIssue = (
    orderId: string,
    category: 'quality' | 'quantity' | 'packaging' | 'delivery' | 'wrong_produce',
    description: string
  ) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            orderStatus: 'issue_reported',
            issueReport: {
              category,
              description,
              status: 'investigating',
              submittedAt: new Date().toISOString(),
            },
            timeline: [
              ...order.timeline,
              {
                status: 'issue_reported',
                timestamp: new Date().toISOString(),
                note: `Issue reported: ${category}. FarmBridge support is reviewing this order with evidence.`,
              },
            ],
          };
        }
        return order;
      })
    );
    addToast('warning', 'Problem report received. Our verification desk is reviewing it.');
  };

  const addFarmerListing = (
    listingData: Partial<ProductListing> & { acreage: number }
  ): { flagged: boolean; reason?: string } => {
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
      harvestQuantityKg: qty,
      remainingQuantityKg: qty,
      unit: listingData.unit || 'kg',
      batchPhotoUrl:
        listingData.imageUrl ||
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80&w=800',
      liveCaptureMetadata: {
        timestamp: new Date().toISOString(),
        approxVillage: 'Pennagaram Region, Dharmapuri',
        state: 'Tamil Nadu',
        accuracyMeters: 6.5,
        deviceCameraVerified: true,
        notes: 'Live device camera capture verified on-field.',
      },
      packingDate: new Date().toISOString(),
    };

    const newProdId = `prod-${Date.now().toString().slice(-6)}`;
    const newProduct: ProductListing = {
      id: newProdId,
      batchId: newBatchId,
      farmerId: listingData.farmerId || 'farmer-muthuvel',
      cropKey,
      title: listingData.title || 'Farm Fresh Produce',
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
        mandiName: 'Local APMC Yard',
        marketDistrict: 'Dharmapuri',
        modalPricePerKg: (listingData.basePricePerUnit || 35) - 4,
        minPricePerKg: (listingData.basePricePerUnit || 35) - 8,
        maxPricePerKg: (listingData.basePricePerUnit || 35) + 2,
        marketDate: new Date().toISOString().split('T')[0],
        sourceDataset: 'Agmarknet Agricultural Marketing System',
        lastUpdated: 'Today 06:00 AM IST',
        isDemonstrationData: true,
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
      addToast(
        'warning',
        `Listing submitted. Volume sanity check flagged for fair admin review: ${sanityCheck.reason}`
      );
      return { flagged: true, reason: sanityCheck.reason };
    } else {
      addToast('success', `Listing published successfully with Batch ID ${newBatchId}!`);
      return { flagged: false };
    }
  };

  const approveFlaggedListing = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return {
            ...p,
            isFlaggedForYieldReview: false,
            status: 'active',
          };
        }
        return p;
      })
    );
    addToast('success', 'Listing approved by administrator after documentation check.');
  };

  const verifyFarmerBadge = (farmerId: string, level: 1 | 2 | 3 | 4 | 5) => {
    setFarmers((prev) =>
      prev.map((f) => {
        if (f.id === farmerId) {
          return {
            ...f,
            verificationLevel: Math.max(f.verificationLevel, level) as 1 | 2 | 3 | 4 | 5,
          };
        }
        return f;
      })
    );
    addToast('success', `Farmer verification updated to Level ${level}!`);
  };

  const joinGroupOrder = (groupId: string, quantityKg: number) => {
    setGroupOrders((prev) =>
      prev.map((grp) => {
        if (grp.id === groupId) {
          return {
            ...grp,
            currentQuantityKg: grp.currentQuantityKg + quantityKg,
            participantsCount: grp.participantsCount + 1,
          };
        }
        return grp;
      })
    );
    addToast(
      'success',
      `You joined the group order! Target reached: +${quantityKg}kg closer to bulk delivery discount.`
    );
  };

  const updateHelplineVerification = (helplineId: string, isVerified: boolean, notes: string) => {
    setHelplines((prev) =>
      prev.map((item) => {
        if (item.id === helplineId) {
          return {
            ...item,
            isVerified,
            awaitingOfficialVerification: !isVerified,
            lastVerifiedDate: new Date().toISOString().split('T')[0],
            notes,
          };
        }
        return item;
      })
    );
    addToast('info', 'Helpline record verification audit updated.');
  };

  const navigateToProduct = (productId: string) => {
    setSelectedProductId(productId);
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

  return (
    <AppContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        currentView,
        setCurrentView: (view: AppView) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        },
        selectedProductId,
        setSelectedProductId,
        selectedBatchId,
        setSelectedBatchId,
        selectedFarmerId,
        setSelectedFarmerId,
        selectedOrderId,
        setSelectedOrderId,

        farmers,
        batches,
        products,
        cartItems,
        orders,
        groupOrders,
        subscriptions,
        helplines,
        rfqs,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,

        placeOrder,
        updateOrderStatus,
        rateOrder,
        reportOrderIssue,

        addFarmerListing,
        verifyFarmerBadge,
        approveFlaggedListing,

        joinGroupOrder,
        updateHelplineVerification,

        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,

        toasts,
        addToast,
        removeToast,

        navigateToProduct,
        navigateToBatch,
        navigateToFarmer,
        navigateToOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
