import { mockClient } from './mockClient';
import { realClient, ApiHttpError } from './realClient';

export const API_MODE: 'mock' | 'real' = (import.meta.env.VITE_USE_REAL_API as string) === 'true' ? 'real' : 'mock';

async function dispatch<T>(method: string, realCall: () => Promise<T>, mockCall: () => Promise<T>): Promise<T> {
  if (API_MODE === 'mock') return mockCall();
  try {
    return await realCall();
  } catch (err) {
    if (err instanceof ApiHttpError && (err.status === 404 || err.status === 501 || err.code === 'NOT_IMPLEMENTED')) {
      console.warn(`[apiClient] ${method} not implemented on server — falling back to mock`);
      return mockCall();
    }
    throw err;
  }
}

export const apiClient = {
  sendOtp: (req: Parameters<typeof mockClient.sendOtp>[0]) => dispatch('sendOtp', () => realClient.sendOtp(req), () => mockClient.sendOtp(req)),
  verifyOtp: (req: Parameters<typeof mockClient.verifyOtp>[0]) => dispatch('verifyOtp', () => realClient.verifyOtp(req), () => mockClient.verifyOtp(req)),
  getProducts: (req: Parameters<typeof mockClient.getProducts>[0]) => dispatch('getProducts', () => realClient.getProducts(req), () => mockClient.getProducts(req)),
  getProduct: (id: string) => dispatch('getProduct', () => realClient.getProduct(id), () => mockClient.getProduct(id)),
  getFarmers: (req: Parameters<typeof mockClient.getFarmers>[0]) => dispatch('getFarmers', () => realClient.getFarmers(req), () => mockClient.getFarmers(req)),
  getFarmer: (id: string) => dispatch('getFarmer', () => realClient.getFarmer(id), () => mockClient.getFarmer(id)),
  upgradeVerification: (req: Parameters<typeof mockClient.upgradeVerification>[0]) => dispatch('upgradeVerification', () => realClient.upgradeVerification(req), () => mockClient.upgradeVerification(req)),
  getBatch: (id: string) => dispatch('getBatch', () => realClient.getBatch(id), () => mockClient.getBatch(id)),
  createOrder: (req: Parameters<typeof mockClient.createOrder>[0]) => dispatch('createOrder', () => realClient.createOrder(req), () => mockClient.createOrder(req)),
  getOrder: (id: string) => dispatch('getOrder', () => realClient.getOrder(id), () => mockClient.getOrder(id)),
  updateOrderStatus: (orderId: string, status: string, note: string) => dispatch('updateOrderStatus', () => realClient.updateOrderStatus(orderId, status, note), async () => ({ orderId, status, updatedAt: new Date().toISOString() })),
  submitRating: (orderId: string, req: { qualityRating: number; freshnessRating: number; deliveryRating: number; comment?: string }) => dispatch('submitRating', () => realClient.submitRating(orderId, req), async () => ({ ok: true as const })),
  reportIssue: (orderId: string, req: { category: string; description: string; photoUrls?: string[] }) => dispatch('reportIssue', () => realClient.reportIssue(orderId, req), async () => ({ ok: true as const, disputeStatus: 'investigating' })),
  markNotificationRead: (id: string, isRead: boolean) => dispatch('markNotificationRead', () => realClient.markNotificationRead(id, isRead), async () => undefined),
  joinGroupOrder: (req: Parameters<typeof mockClient.joinGroupOrder>[0]) => dispatch('joinGroupOrder', () => realClient.joinGroupOrder(req), () => mockClient.joinGroupOrder(req)),
  createSubscription: (req: Parameters<typeof mockClient.createSubscription>[0]) => dispatch('createSubscription', () => realClient.createSubscription(req), () => mockClient.createSubscription(req)),
  createRfq: (req: Parameters<typeof mockClient.createRfq>[0]) => dispatch('createRfq', () => realClient.createRfq(req), () => mockClient.createRfq(req)),
  getHelplines: () => dispatch('getHelplines', () => realClient.getHelplines(), () => mockClient.getHelplines()),
  getNotifications: () => dispatch('getNotifications', () => realClient.getNotifications(), () => mockClient.getNotifications()),
  textSearch: (req: Parameters<typeof mockClient.textSearch>[0]) => dispatch('textSearch', () => realClient.textSearch(req), () => mockClient.textSearch(req)),
};