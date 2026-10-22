import type {
  ProductListing, FarmerProfile, HarvestBatch, OrderRecord, GroupOrderRecord,
  BasketSubscriptionRecord, HelplineRecord, RFQRecord, AppNotification, LoggedInUser, UserRole,
} from '../types';

export interface ApiError { code: string; message: string; field?: string; }
export interface Paginated<T> { data: T[]; page: number; limit: number; total: number; }

export interface SendOtpRequest { phone: string; purpose: 'signin' | 'register'; }
export interface SendOtpResponse { otpSessionId: string; expiresAt: string; resendAvailableAt: string; }

export interface VerifyOtpRequest {
  otpSessionId: string;
  otp: string;
  profile?: {
    name: string; email?: string; role: UserRole;
    village?: string; district?: string; state?: string; landAcres?: number;
    cropsGrown?: string[]; informedConsent?: boolean;
    organization?: string; gstin?: string;
  };
}
export interface VerifyOtpResponse { token: string; expiresAt: string; user: LoggedInUser; }

export interface EmailAuthRequest { email: string; password: string; mode: 'signin' | 'register'; name?: string; role?: UserRole; }
export interface EmailAuthResponse { token: string; user: LoggedInUser; }

export interface GetProductsRequest {
  category?: string; searchQuery?: string; minTrustLevel?: 1 | 2 | 3 | 4 | 5;
  maxPrice?: number; onlySurplus?: boolean; sortBy?: 'harvest_newest' | 'price_low' | 'price_high';
  page?: number; limit?: number;
}
export type GetProductsResponse = Paginated<ProductListing>;
export interface GetProductResponse { product: ProductListing; farmer: FarmerProfile; batch: HarvestBatch; }

export interface GetFarmersRequest { searchQuery?: string; minVerificationLevel?: 1 | 2 | 3 | 4 | 5; state?: string; page?: number; limit?: number; }
export type GetFarmersResponse = Paginated<FarmerProfile>;
export interface GetFarmerResponse { farmer: FarmerProfile; products: ProductListing[]; batches: HarvestBatch[]; }

export interface UpgradeVerificationRequest {
  farmerId: string; targetLevel: 2 | 3 | 4 | 5;
  evidenceType: 'land_record' | 'live_capture' | 'local_verification' | 'certificate' | 'lab_report';
  documentIds: string[];
}
export interface UpgradeVerificationResponse { newLevel: 1 | 2 | 3 | 4 | 5; status: 'approved' | 'pending' | 'rejected'; reviewer: string; reviewedAt: string; notes?: string; }

export interface GetBatchResponse {
  batch: HarvestBatch; farmer: FarmerProfile;
  labReport?: { reportId: string; laboratoryName: string; nablAccreditationNo: string; reportIssueDate: string; testedParametersCount: number; publicSummary: string; pdfUrl: string; };
}

export interface CreateOrderRequest {
  items: Array<{ productId: string; quantity: number }>;
  deliveryAddress: string;
  deliveryMethod: 'home_delivery' | 'farm_pickup';
  paymentMethod: 'UPI' | 'Card' | 'CashOnDelivery';
  customerName: string; customerPhone: string; notes?: string;
  deliverySlot?: { date: string; window: '06-09' | '09-12' | '12-15' | '15-18' | '18-21'; fee: number; };
}
export interface CreateOrderResponse { order: OrderRecord; payment: { razorpayOrderId?: string; clientSecret?: string; amountPaise: number; }; }

export interface GetOrderResponse { order: OrderRecord; }
export interface UpdateOrderStatusRequest { orderId: string; status: OrderRecord['orderStatus']; note: string; actorRole: UserRole; }
export interface UpdateOrderStatusResponse { orderId: string; status: OrderRecord['orderStatus']; updatedAt: string; }

export interface SubmitRatingRequest { orderId: string; qualityRating: number; freshnessRating: number; deliveryRating: number; comment?: string; }
export interface SubmitRatingResponse { ok: true; }

export interface ReportIssueRequest { orderId: string; category: 'quality' | 'quantity' | 'packaging' | 'delivery' | 'wrong_produce'; description: string; photoUrls?: string[]; }
export interface ReportIssueResponse { ok: true; disputeStatus: string; }

export interface GetGroupOrdersRequest { city?: string; pinCode?: string; }
export type GetGroupOrdersResponse = Paginated<GroupOrderRecord>;
export interface JoinGroupOrderRequest { groupId: string; quantityKg: number; productIds: string[]; }
export interface JoinGroupOrderResponse { group: GroupOrderRecord; }

export interface CreateSubscriptionRequest {
  basketSize: 'Small' | 'Medium' | 'Large';
  frequency: 'Weekly' | 'Bi-weekly';
  preferredDeliveryDay: 'Wednesday' | 'Saturday' | 'Sunday';
  dietaryPreferences: string[];
}
export interface CreateSubscriptionResponse { subscription: BasketSubscriptionRecord; }
export interface UpdateSubscriptionRequest { subscriptionId: string; action: 'pause' | 'resume' | 'skip_next' | 'cancel' | 'update_preferences'; updates?: Partial<CreateSubscriptionRequest>; }

export type GetHelplinesResponse = { data: HelplineRecord[]; };
export interface UpdateHelplineRequest { helplineId: string; isVerified: boolean; notes: string; }

export interface CreateRfqRequest {
  cropRequired: string; quantityRequiredKg: number; targetPricePerKg: number;
  deliveryDate: string; qualityGrade: 'Grade A' | 'Grade B' | 'Standard Commercial';
}
export interface CreateRfqResponse { rfq: RFQRecord; }

export type GetNotificationsResponse = Paginated<AppNotification>;
export interface MarkNotificationRequest { notificationId: string; isRead: boolean; }
export interface MarkNotificationResponse { ok: true; }

export interface VoiceSearchRequest { audioBase64: string; language: 'en-IN' | 'hi-IN' | 'ta-IN'; }
export interface VoiceSearchResponse { transcript: string; confidence: number; }

export interface TextSearchRequest { query: string; language: 'en' | 'ta' | 'hi'; }
export interface TextSearchResponse {
  query: string;
  results: { products: ProductListing[]; farmers: FarmerProfile[]; batches: HarvestBatch[]; };
  totalCount: number;
}