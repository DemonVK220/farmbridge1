import { tokenStore } from '../utils/tokenStore';
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

const BASE = (import.meta.env.VITE_API_BASE_URL as string) || '/api/v1';

export class ApiHttpError extends Error {
  constructor(public status: number, public code: string, message: string, public field?: string) {
    super(message);
  }
}

async function call<T>(path: string, init?: RequestInit): Promise<T> {
  const token = tokenStore.get();
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(init?.headers as Record<string, string>) };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}${path}`, { ...init, headers });
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const body = text ? JSON.parse(text) : null;
  if (!res.ok) {
    const err = body?.error || { code: `HTTP_${res.status}`, message: res.statusText };
    throw new ApiHttpError(res.status, err.code, err.message, err.field);
  }
  return body as T;
}

function qs(params: Record<string, any>): string {
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (entries.length === 0) return '';
  return '?' + entries.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`).join('&');
}

export const realClient = {
  sendOtp: async (req: SendOtpRequest): Promise<SendOtpResponse> => call('/auth/send-otp', { method: 'POST', body: JSON.stringify(req) }),
  verifyOtp: async (req: VerifyOtpRequest): Promise<VerifyOtpResponse> => {
    const res = await call<VerifyOtpResponse>('/auth/verify-otp', { method: 'POST', body: JSON.stringify(req) });
    tokenStore.set(res.token, res.expiresAt, { id: res.user.id, name: res.user.name, phone: res.user.phone, email: res.user.email, role: res.user.role as any });
    return res;
  },
  getProducts: async (req: GetProductsRequest): Promise<GetProductsResponse> => call(`/products${qs(req)}`),
  getProduct: async (id: string): Promise<GetProductResponse | null> => {
    try { return await call<GetProductResponse>(`/products/${id}`); }
    catch (err) { if (err instanceof ApiHttpError && err.status === 404) return null; throw err; }
  },
  getFarmers: async (req: GetFarmersRequest): Promise<GetFarmersResponse> => call(`/farmers${qs(req)}`),
  getFarmer: async (id: string): Promise<GetFarmerResponse | null> => {
    try { return await call<GetFarmerResponse>(`/farmers/${id}`); }
    catch (err) { if (err instanceof ApiHttpError && err.status === 404) return null; throw err; }
  },
  upgradeVerification: async (req: UpgradeVerificationRequest): Promise<UpgradeVerificationResponse> => call(`/farmers/${req.farmerId}/verification`, { method: 'POST', body: JSON.stringify(req) }),
  getBatch: async (id: string): Promise<GetBatchResponse | null> => {
    try { return await call<GetBatchResponse>(`/batches/${id}`); }
    catch (err) { if (err instanceof ApiHttpError && err.status === 404) return null; throw err; }
  },
  createOrder: async (req: CreateOrderRequest): Promise<CreateOrderResponse> => call('/orders', { method: 'POST', body: JSON.stringify(req) }),
  getOrder: async (id: string): Promise<GetOrderResponse | null> => {
    try { return await call<GetOrderResponse>(`/orders/${id}`); }
    catch (err) { if (err instanceof ApiHttpError && err.status === 404) return null; throw err; }
  },
  updateOrderStatus: async (orderId: string, status: string, note: string): Promise<{ orderId: string; status: string; updatedAt: string }> => call(`/orders/${orderId}/status`, { method: 'PATCH', body: JSON.stringify({ status, note }) }),
  submitRating: async (orderId: string, req: { qualityRating: number; freshnessRating: number; deliveryRating: number; comment?: string }): Promise<{ ok: true }> => call(`/orders/${orderId}/rating`, { method: 'POST', body: JSON.stringify(req) }),
  reportIssue: async (orderId: string, req: { category: string; description: string; photoUrls?: string[] }): Promise<{ ok: true; disputeStatus: string }> => call(`/orders/${orderId}/issue`, { method: 'POST', body: JSON.stringify(req) }),
  markNotificationRead: async (notificationId: string, isRead: boolean): Promise<void> => call(`/notifications/${notificationId}`, { method: 'PATCH', body: JSON.stringify({ isRead }) }),
  joinGroupOrder: async (req: JoinGroupOrderRequest): Promise<JoinGroupOrderResponse> => call(`/group-orders/${req.groupId}/join`, { method: 'POST', body: JSON.stringify(req) }),
  createSubscription: async (req: CreateSubscriptionRequest): Promise<CreateSubscriptionResponse> => call('/subscriptions', { method: 'POST', body: JSON.stringify(req) }),
  createRfq: async (req: CreateRfqRequest): Promise<CreateRfqResponse> => call('/rfqs', { method: 'POST', body: JSON.stringify(req) }),
  getHelplines: async (): Promise<GetHelplinesResponse> => call('/helplines'),
  getNotifications: async (): Promise<GetNotificationsResponse> => call('/notifications'),
  textSearch: async (req: TextSearchRequest): Promise<TextSearchResponse> => call('/search/text', { method: 'POST', body: JSON.stringify(req) }),
};