export type UserRole =
  | 'visitor'
  | 'farmer'
  | 'customer'
  | 'business'
  | 'fpo'
  | 'delivery'
  | 'admin';

export type VerificationBadgeType =
  | 'PHONE_VERIFIED'
  | 'FARM_EVIDENCE_REVIEWED'
  | 'LOCALLY_VERIFIED'
  | 'CERTIFICATE_VERIFIED'
  | 'RESIDUE_REPORT_VERIFIED';

export interface VerificationBadge {
  type: VerificationBadgeType;
  title: string;
  description: string;
  verifiedBy: string;
  verifiedDate: string;
  status: 'verified' | 'pending' | 'expired' | 'suspended' | 'rejected';
  details?: string;
  documentRef?: string;
}

export interface LiveCaptureMetadata {
  timestamp: string;
  approxVillage: string;
  state: string;
  accuracyMeters: number;
  deviceCameraVerified: boolean;
  notes?: string;
}

export interface CertificateRecord {
  id: string;
  type: 'Jaivik Bharat' | 'PGS Organic' | 'NPOP Organic' | 'FSSAI License';
  certificateNumber: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  isVerified: boolean;
  publicScope: string;
}

export interface ResidueLabReport {
  reportId: string;
  laboratoryName: string;
  nablAccreditationNo: string;
  sampleCollectionDate: string;
  reportIssueDate: string;
  testedCrop: string;
  batchId: string;
  pesticideMRLStatus: 'Compliant (Within Codex / FSSAI limits)' | 'Non-Compliant' | 'Pending';
  testedParametersCount: number;
  organochlorineDetected: boolean;
  organophosphatesDetected: boolean;
  publicSummary: string;
}

export interface FarmerProfile {
  id: string;
  name: string;
  avatarUrl: string;
  phone: string; // generalized for public
  approxVillage: string;
  district: string;
  state: string;
  pinCode: string;
  landAcres: number;
  farmingType: 'Natural / Organic' | 'Traditional' | 'Regenerative' | 'Integrated Pest Management';
  verificationLevel: 1 | 2 | 3 | 4 | 5;
  badges: VerificationBadge[];
  bio: string;
  rating: number;
  totalCompletedOrders: number;
  joinedYear: number;
  fpoMembership?: string;
  cropsGrown: string[];
  liveFarmPhotoUrl: string;
  farmPhotoMetadata?: LiveCaptureMetadata;
  certificates?: CertificateRecord[];
  labReports?: ResidueLabReport[];
  strikesCount: number;
}

export interface MandiPriceComparison {
  mandiName: string;
  marketDistrict: string;
  modalPricePerKg: number;
  minPricePerKg: number;
  maxPricePerKg: number;
  marketDate: string;
  sourceDataset: string;
  lastUpdated: string;
  isDemonstrationData: boolean;
  differenceRationale: string;
}

export interface HarvestBatch {
  id: string;
  farmerId: string;
  cropName: string;
  variety: string;
  harvestDate: string;
  harvestQuantityKg: number;
  remainingQuantityKg: number;
  unit: string;
  batchPhotoUrl: string;
  liveCaptureMetadata: LiveCaptureMetadata;
  labReport?: ResidueLabReport;
  packingDate?: string;
}

export interface ProductListing {
  id: string;
  batchId: string;
  farmerId: string;
  cropKey: string;
  title: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Millets' | 'Spices';
  variety: string;
  basePricePerUnit: number;
  minFloorPricePerUnit: number;
  unit: 'kg' | 'quintal' | 'bunch' | 'crate';
  availableQuantity: number;
  minOrderQuantity: number;
  harvestDate: string;
  expectedShelfLifeDays: number;
  imageUrl: string;
  description: string;
  storageTips: string;
  mandiComparison: MandiPriceComparison;
  isFlaggedForYieldReview: boolean;
  yieldCheckReason?: string;
  status: 'active' | 'under_review' | 'flagged' | 'sold_out';
  deliveryOptions: ('home_delivery' | 'farm_pickup')[];
}

export interface CartItem {
  product: ProductListing;
  farmer: FarmerProfile;
  quantity: number;
  effectiveUnitPrice: number;
  baseUnitPrice: number;
  discountPercent: number;
  notes?: string;
}

export interface OrderItemRecord {
  productId: string;
  title: string;
  cropKey: string;
  farmerId: string;
  farmerName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalPrice: number;
  batchId: string;
}

export interface OrderRecord {
  id: string;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryMethod: 'home_delivery' | 'farm_pickup';
  items: OrderItemRecord[];
  produceSubtotal: number;
  surplusSavings: number;
  deliveryFee: number;
  platformFee: number; // Always 0
  totalPayable: number;
  paymentMethod: 'UPI' | 'Card' | 'CashOnDelivery';
  paymentStatus: 'demo_paid' | 'pending';
  orderStatus:
    | 'order_placed'
    | 'farmer_confirmed'
    | 'produce_prepared'
    | 'ready_for_pickup'
    | 'picked_up'
    | 'in_transit'
    | 'delivered'
    | 'completed'
    | 'issue_reported';
  timeline: {
    status: string;
    timestamp: string;
    note: string;
  }[];
  confirmationOtp: string;
  createdAt: string;
  farmerSplits: {
    farmerId: string;
    farmerName: string;
    amount: number;
  }[];
  rating?: {
    qualityRating: number;
    freshnessRating: number;
    deliveryRating: number;
    comment?: string;
    submittedAt: string;
  };
  issueReport?: {
    category: 'quality' | 'quantity' | 'packaging' | 'delivery' | 'wrong_produce';
    description: string;
    status: 'investigating' | 'refund_approved' | 'resolved';
    submittedAt: string;
  };
}

export interface GroupOrderRecord {
  id: string;
  groupTitle: string;
  locality: string;
  city: string;
  organizerName: string;
  deadline: string;
  targetQuantityKg: number;
  currentQuantityKg: number;
  participantsCount: number;
  status: 'open' | 'locked' | 'ordered' | 'delivered';
  itemsOffered: {
    productId: string;
    title: string;
    farmerName: string;
    basePrice: number;
    unit: string;
  }[];
}

export interface BasketSubscriptionRecord {
  id: string;
  customerName: string;
  basketSize: 'Small (2-3 People)' | 'Medium (4-5 People)' | 'Large Joint Family';
  frequency: 'Weekly' | 'Bi-weekly';
  preferredDeliveryDay: 'Wednesday' | 'Saturday' | 'Sunday';
  dietaryPreferences: string[];
  status: 'active' | 'paused' | 'skipped';
  nextDeliveryDate: string;
  estimatedPrice: number;
}

export interface HelplineRecord {
  id: string;
  serviceName: string;
  intendedUse: string;
  phoneNumber: string;
  operatingHours: string;
  officialWebsite: string;
  sourceUrl: string;
  lastVerifiedDate: string;
  isVerified: boolean;
  awaitingOfficialVerification: boolean;
  notes: string;
}

export interface AssistedOnboardingEntry {
  id: string;
  operatorCscId: string;
  operatorName: string;
  farmerName: string;
  farmerPhone: string;
  approxVillage: string;
  district: string;
  state: string;
  landAcres: number;
  consentObtained: boolean;
  status: 'draft' | 'verified_onboarded';
  registrationDate: string;
}

export interface RFQRecord {
  id: string;
  buyerName: string;
  organization: string;
  cropRequired: string;
  quantityRequiredKg: number;
  targetPricePerKg: number;
  deliveryDate: string;
  qualityGrade: 'Grade A' | 'Grade B' | 'Standard Commercial';
  status: 'open' | 'quotes_received' | 'accepted';
  quotesCount: number;
}
