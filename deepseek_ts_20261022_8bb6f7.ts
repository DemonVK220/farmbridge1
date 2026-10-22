import type {
  SendOtpRequest, SendOtpResponse, VerifyOtpRequest, VerifyOtpResponse,
  GetProductsRequest, GetProductsResponse, GetProductResponse,
  GetFarmersRequest, GetFarmersResponse, GetFarmerResponse,
  UpgradeVerificationRequest, UpgradeVerificationResponse,
  GetBatchResponse, CreateOrderRequest, CreateOrderResponse,
  GetOrderResponse, JoinGroupOrderRequest, JoinGroupOrderResponse,
  CreateSubscriptionRequest, CreateSubscriptionResponse,
  CreateRfqRequest, CreateRfqResponse, GetHelplinesResponse,
  GetNotificationsResponse, TextSearchRequest, TextSearchResponse,
} from './contracts';
import {
  SEED_PRODUCTS, SEED_FARMERS, SEED_BATCHES, SEED_ORDERS,
  SEED_GROUP_ORDERS, SEED_HELPLINES, SEED_RFQS,
} from '../data/seedData';

const LATENCY = 250;
function delay<T>(value: T, ms = LATENCY): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

let mockOtp = { sessionId: 'otp-session-demo', code: '4821' };
const notifications = [
  { id: 'notif-1', type: 'order' as const, title: 'Order FB-2026-9921 in transit', message: 'Your order is out for delivery.', timestamp: new Date().toISOString(), isRead: false },
];

export const mockClient = {
  sendOtp: async (req: SendOtpRequest): Promise<SendOtpResponse> => {
    mockOtp = { sessionId: `otp-${Date.now()}`, code: '4821' };
    console.info('[MOCK OTP]', req.phone, '→', mockOtp.code);
    return delay({ otpSessionId: mockOtp.sessionId, expiresAt: new Date(Date.now() + 5 * 60_000).toISOString(), resendAvailableAt: new Date(Date.now() + 30_000).toISOString() });
  },

  verifyOtp: async (req: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    if (req.otp !== mockOtp.code && req.otp !== '1234') {
      throw { error: { code: 'INVALID_OTP', message: 'The OTP you entered is incorrect.' } };
    }
    const user = {
      id: `user-${Date.now()}`,
      name: req.profile?.name || 'Demo User',
      phone: '+91 90000 00000',
      email: req.profile?.email,
      role: req.profile?.role || 'customer' as const,
      preferredLanguage: 'en' as const,
      notificationsEnabled: true,
      smsAlertsEnabled: true,
      whatsappAlertsEnabled: false,
      joinedDate: new Date().toISOString(),
    };
    return delay({ token: 'demo-token-xyz', expiresAt: new Date(Date.now() + 86_400_000).toISOString(), user });
  },

  getProducts: async (req: GetProductsRequest): Promise<GetProductsResponse> => {
    let items = SEED_PRODUCTS.filter((p) => p.status === 'active');
    if (req.category && req.category !== 'All') items = items.filter((p) => p.category === req.category);
    if (req.searchQuery) items = items.filter((p) => p.title.toLowerCase().includes(req.searchQuery!.toLowerCase()));
    if (req.maxPrice) items = items.filter((p) => p.basePricePerUnit <= req.maxPrice!);
    const page = req.page || 1;
    const limit = req.limit || 20;
    const slice = items.slice((page - 1) * limit, page * limit);
    return delay({ data: slice, page, limit, total: items.length });
  },

  getProduct: async (productId: string): Promise<GetProductResponse | null> => {
    const product = SEED_PRODUCTS.find((p) => p.id === productId);
    if (!product) return null;
    const farmer = SEED_FARMERS.find((f) => f.id === product.farmerId)!;
    const batch = SEED_BATCHES.find((b) => b.id === product.batchId)!;
    return delay({ product, farmer, batch });
  },

  getFarmers: async (req: GetFarmersRequest): Promise<GetFarmersResponse> => {
    let items = [...SEED_FARMERS];
    if (req.minVerificationLevel) items = items.filter((f) => f.verificationLevel >= req.minVerificationLevel!);
    if (req.searchQuery) items = items.filter((f) => f.name.toLowerCase().includes(req.searchQuery!.toLowerCase()));
    const page = req.page || 1;
    const limit = req.limit || 20;
    return delay({ data: items.slice((page - 1) * limit, page * limit), page, limit, total: items.length });
  },

  getFarmer: async (farmerId: string): Promise<GetFarmerResponse | null> => {
    const farmer = SEED_FARMERS.find((f) => f.id === farmerId);
    if (!farmer) return null;
    const products = SEED_PRODUCTS.filter((p) => p.farmerId === farmerId);
    const batches = SEED_BATCHES.filter((b) => b.farmerId === farmerId);
    return delay({ farmer, products, batches });
  },

  upgradeVerification: async (req: UpgradeVerificationRequest): Promise<UpgradeVerificationResponse> => {
    return delay({
      newLevel: req.targetLevel, status: 'pending',
      reviewer: 'Pending — Submitted for evidence review',
      reviewedAt: new Date().toISOString(),
      notes: 'Your evidence has been queued. You will receive an SMS within 2-3 business days.',
    });
  },

  getBatch: async (batchId: string): Promise<GetBatchResponse | null> => {
    const batch = SEED_BATCHES.find((b) => b.id === batchId);
    if (!batch) return null;
    const farmer = SEED_FARMERS.find((f) => f.id === batch.farmerId)!;
    const labReport = batch.labReport ? {
      reportId: batch.labReport.reportId, laboratoryName: batch.labReport.laboratoryName,
      nablAccreditationNo: batch.labReport.nablAccreditationNo,
      reportIssueDate: batch.labReport.reportIssueDate,
      testedParametersCount: batch.labReport.testedParametersCount,
      publicSummary: batch.labReport.publicSummary,
      pdfUrl: '#demo-lab-report-pdf',
    } : undefined;
    return delay({ batch, farmer, labReport });
  },

  createOrder: async (req: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const items = req.items.map((i) => {
      const product = SEED_PRODUCTS.find((p) => p.id === i.productId)!;
      return {
        productId: product.id, title: product.title, cropKey: product.cropKey,
        farmerId: product.farmerId,
        farmerName: SEED_FARMERS.find((f) => f.id === product.farmerId)?.name || '',
        quantity: i.quantity, unit: product.unit,
        unitPrice: product.basePricePerUnit, totalPrice: product.basePricePerUnit * i.quantity,
        batchId: product.batchId,
      };
    });
    const subtotal = items.reduce((s, i) => s + i.totalPrice, 0);
    const order: any = {
      id: `order-${Date.now()}`,
      orderCode: `FB-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: req.customerName, customerPhone: req.customerPhone,
      deliveryAddress: req.deliveryAddress, deliveryMethod: req.deliveryMethod,
      items, produceSubtotal: subtotal, surplusSavings: 0, deliveryFee: 55,
      platformFee: 0, totalPayable: subtotal + 55,
      paymentMethod: req.paymentMethod, paymentStatus: 'demo_paid', orderStatus: 'order_placed',
      timeline: [{ status: 'order_placed', timestamp: new Date().toISOString(), note: 'Order confirmed (simulated payment).' }],
      confirmationOtp: Math.floor(1000 + Math.random() * 9000).toString(),
      createdAt: new Date().toISOString(), farmerSplits: [],
    };
    return delay({ order, payment: { amountPaise: order.totalPayable * 100 } });
  },

  getOrder: async (orderId: string): Promise<GetOrderResponse | null> => {
    const order = SEED_ORDERS.find((o) => o.id === orderId);
    return order ? delay({ order }) : null;
  },

  joinGroupOrder: async (req: JoinGroupOrderRequest): Promise<JoinGroupOrderResponse> => {
    const group = SEED_GROUP_ORDERS.find((g) => g.id === req.groupId);
    if (!group) throw { error: { code: 'NOT_FOUND', message: 'Group order not found' } };
    const updated = { ...group, currentQuantityKg: group.currentQuantityKg + req.quantityKg, participantsCount: group.participantsCount + 1 };
    return delay({ group: updated });
  },

  createSubscription: async (req: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> => {
    return delay({
      subscription: {
        id: `sub-${Date.now()}`, customerName: 'Demo Customer',
        basketSize: `${req.basketSize} (4-5 People)` as any,
        frequency: req.frequency, preferredDeliveryDay: req.preferredDeliveryDay,
        dietaryPreferences: req.dietaryPreferences, status: 'active',
        nextDeliveryDate: new Date(Date.now() + 7 * 86_400_000).toISOString().split('T')[0],
        estimatedPrice: req.basketSize === 'Small' ? 299 : req.basketSize === 'Medium' ? 420 : 640,
      },
    });
  },

  createRfq: async (req: CreateRfqRequest): Promise<CreateRfqResponse> => {
    return delay({
      rfq: {
        id: `rfq-${Date.now()}`, buyerName: 'Demo Buyer', organization: 'Demo Org',
        cropRequired: req.cropRequired, quantityRequiredKg: req.quantityRequiredKg,
        targetPricePerKg: req.targetPricePerKg, deliveryDate: req.deliveryDate,
        qualityGrade: req.qualityGrade, status: 'open', quotesCount: 0,
      },
    });
  },

  getHelplines: async (): Promise<GetHelplinesResponse> => delay({ data: SEED_HELPLINES }),

  getNotifications: async (): Promise<GetNotificationsResponse> => delay({
    data: notifications as any, page: 1, limit: 20, total: notifications.length,
  }),

  textSearch: async (req: TextSearchRequest): Promise<TextSearchResponse> => {
    const q = req.query.toLowerCase();
    return delay({
      query: req.query,
      results: {
        products: SEED_PRODUCTS.filter((p) => p.title.toLowerCase().includes(q)),
        farmers: SEED_FARMERS.filter((f) => f.name.toLowerCase().includes(q)),
        batches: SEED_BATCHES.filter((b) => b.cropName.toLowerCase().includes(q)),
      },
      totalCount: 0,
    });
  },
};