/**
 * Pure business logic and domain calculations for FarmBridge India.
 * Decoupled from React DOM for testability and verification.
 */

export interface CropYieldReference {
  cropName: string;
  minYieldPerAcreKg: number;
  maxYieldPerAcreKg: number;
  shelfLifeDays: number;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Pulses' | 'Millets' | 'Spices';
}

// Configurable reference data based on Indian Agricultural Extension benchmarks
export const CROP_YIELD_BENCHMARKS: Record<string, CropYieldReference> = {
  tomatoes: {
    cropName: 'Tomatoes',
    minYieldPerAcreKg: 8000,
    maxYieldPerAcreKg: 20000,
    shelfLifeDays: 5,
    category: 'Vegetables',
  },
  onions: {
    cropName: 'Onions',
    minYieldPerAcreKg: 6000,
    maxYieldPerAcreKg: 14000,
    shelfLifeDays: 30,
    category: 'Vegetables',
  },
  spinach: {
    cropName: 'Spinach (Palak)',
    minYieldPerAcreKg: 2000,
    maxYieldPerAcreKg: 5000,
    shelfLifeDays: 3,
    category: 'Vegetables',
  },
  mangoes: {
    cropName: 'Alphonso Mangoes',
    minYieldPerAcreKg: 3000,
    maxYieldPerAcreKg: 7000,
    shelfLifeDays: 7,
    category: 'Fruits',
  },
  bananas: {
    cropName: 'Robusta Bananas',
    minYieldPerAcreKg: 12000,
    maxYieldPerAcreKg: 25000,
    shelfLifeDays: 6,
    category: 'Fruits',
  },
  rice: {
    cropName: 'Sona Masoori Rice',
    minYieldPerAcreKg: 1800,
    maxYieldPerAcreKg: 3200,
    shelfLifeDays: 365,
    category: 'Grains',
  },
  millets: {
    cropName: 'Finger Millet (Ragi)',
    minYieldPerAcreKg: 800,
    maxYieldPerAcreKg: 1800,
    shelfLifeDays: 180,
    category: 'Millets',
  },
  lentils: {
    cropName: 'Toor Dal (Pigeon Pea)',
    minYieldPerAcreKg: 500,
    maxYieldPerAcreKg: 1100,
    shelfLifeDays: 240,
    category: 'Pulses',
  },
};

export interface YieldSanityCheckResult {
  isPlausible: boolean;
  isFlaggedForReview: boolean;
  expectedMinKg: number;
  expectedMaxKg: number;
  excessRatio: number;
  reason: string;
  recommendedAction: 'Approve' | 'FlagForReview' | 'RequestClarification';
}

/**
 * Evaluates whether a listing quantity is plausible for the given acreage and crop.
 * Never accuses the farmer automatically; flags for review if exceeds 1.5x of max plausible yield.
 */
export function evaluateYieldSanity(
  cropKey: string,
  acreage: number,
  listedQuantityKg: number,
  isFpoAggregated: boolean = false
): YieldSanityCheckResult {
  const normKey = cropKey.toLowerCase().trim();
  const benchmark = CROP_YIELD_BENCHMARKS[normKey] || {
    cropName: cropKey,
    minYieldPerAcreKg: 1000,
    maxYieldPerAcreKg: 6000,
    shelfLifeDays: 14,
    category: 'Vegetables',
  };

  const effectiveAcres = Math.max(acreage, 0.1);
  const expectedMinKg = Math.round(benchmark.minYieldPerAcreKg * effectiveAcres);
  // Allow an extra 35% margin for high-yield farming practices before flagging
  const expectedMaxKg = Math.round(benchmark.maxYieldPerAcreKg * effectiveAcres * 1.35);

  if (isFpoAggregated) {
    return {
      isPlausible: true,
      isFlaggedForReview: false,
      expectedMinKg,
      expectedMaxKg: expectedMaxKg * 10,
      excessRatio: 1.0,
      reason: 'FPO / Farmer Group aggregated listing across multiple verified member farmers.',
      recommendedAction: 'Approve',
    };
  }

  if (listedQuantityKg <= expectedMaxKg) {
    return {
      isPlausible: true,
      isFlaggedForReview: false,
      expectedMinKg,
      expectedMaxKg,
      excessRatio: listedQuantityKg / (benchmark.maxYieldPerAcreKg * effectiveAcres),
      reason: `Quantity of ${listedQuantityKg} kg is within plausible harvest range for ${effectiveAcres} acre(s) of ${benchmark.cropName}.`,
      recommendedAction: 'Approve',
    };
  }

  const excessRatio = Number((listedQuantityKg / expectedMaxKg).toFixed(2));
  const reason = `Listed quantity (${listedQuantityKg} kg) exceeds maximum plausible harvest limit (${expectedMaxKg} kg) for ${effectiveAcres} acre(s) of ${benchmark.cropName} by ${Math.round((excessRatio - 1) * 100)}%. Sent to verification queue for fair review.`;

  return {
    isPlausible: false,
    isFlaggedForReview: true,
    expectedMinKg,
    expectedMaxKg,
    excessRatio,
    reason,
    recommendedAction: excessRatio > 2.5 ? 'FlagForReview' : 'RequestClarification',
  };
}

/**
 * Calculates freshness decay and automatic surplus discount.
 * Respects farmer's configured minimum floor price strictly.
 */
export function calculateSurplusDiscount(
  harvestDateStr: string,
  shelfLifeDays: number,
  basePricePerUnit: number,
  minFloorPrice: number,
  currentDateStr: string = new Date().toISOString()
): {
  daysElapsed: number;
  hoursElapsed: number;
  discountPercent: number;
  finalPricePerUnit: number;
  isExpiringSoon: boolean;
  savingsPerUnit: number;
} {
  const harvestTime = new Date(harvestDateStr).getTime();
  const currentTime = new Date(currentDateStr).getTime();
  const hoursElapsed = Math.max(0, Math.floor((currentTime - harvestTime) / (1000 * 60 * 60)));
  const daysElapsed = Number((hoursElapsed / 24).toFixed(1));

  const totalShelfLifeHours = shelfLifeDays * 24;
  const lifeProgress = Math.min(1, hoursElapsed / totalShelfLifeHours);

  // Progressive discount curve: starts gently, increases as shelf life reaches 50%
  let rawDiscountPercent = 0;
  if (lifeProgress >= 0.75) {
    rawDiscountPercent = 35;
  } else if (lifeProgress >= 0.5) {
    rawDiscountPercent = 20;
  } else if (lifeProgress >= 0.3) {
    rawDiscountPercent = 10;
  }

  const rawDiscountedPrice = basePricePerUnit * (1 - rawDiscountPercent / 100);
  // Strict floor protection: never go below farmer's selected minimum price
  const finalPricePerUnit = Math.max(minFloorPrice, Math.round(rawDiscountedPrice));
  const effectiveDiscountPercent =
    basePricePerUnit > 0
      ? Math.round(((basePricePerUnit - finalPricePerUnit) / basePricePerUnit) * 100)
      : 0;

  return {
    daysElapsed,
    hoursElapsed,
    discountPercent: effectiveDiscountPercent,
    finalPricePerUnit,
    isExpiringSoon: lifeProgress >= 0.6,
    savingsPerUnit: basePricePerUnit - finalPricePerUnit,
  };
}

export interface PricingBreakdown {
  itemsSubtotal: number;
  totalSurplusSavings: number;
  netProduceCost: number;
  deliveryCharge: number;
  platformFee: number; // strictly 0
  gstAndTaxes: number;
  totalPayable: number;
  farmerSplits: {
    farmerId: string;
    farmerName: string;
    subtotal: number;
    itemsCount: number;
  }[];
}

/**
 * Full upfront transparent checkout calculation.
 * Standard marketplace platform fee is strictly ₹0.
 */
export function calculateCheckoutPricing(
  items: Array<{
    farmerId: string;
    farmerName: string;
    quantity: number;
    basePrice: number;
    discountedPrice: number;
  }>,
  deliveryMethod: 'home_delivery' | 'farm_pickup' = 'home_delivery'
): PricingBreakdown {
  let itemsSubtotal = 0;
  let netProduceCost = 0;
  const farmerMap = new Map<string, { farmerName: string; subtotal: number; count: number }>();

  for (const item of items) {
    const rawTotal = item.basePrice * item.quantity;
    const netTotal = item.discountedPrice * item.quantity;
    itemsSubtotal += rawTotal;
    netProduceCost += netTotal;

    const existing = farmerMap.get(item.farmerId) || {
      farmerName: item.farmerName,
      subtotal: 0,
      count: 0,
    };
    existing.subtotal += netTotal;
    existing.count += item.quantity;
    farmerMap.set(item.farmerId, existing);
  }

  const totalSurplusSavings = itemsSubtotal - netProduceCost;

  // Third-party delivery fee: ₹40 base + ₹25 per additional farmer pickup location
  const distinctFarmersCount = farmerMap.size;
  const deliveryCharge =
    deliveryMethod === 'farm_pickup'
      ? 0
      : distinctFarmersCount > 0
      ? 35 + (distinctFarmersCount - 1) * 20
      : 0;

  // Platform fee is strictly ₹0 as mandated by FarmBridge India policy
  const platformFee = 0;
  // Essential fresh farm produce (vegetables, grains, unprocessed fruits) in India has 0% GST (exempted under GST Act)
  const gstAndTaxes = 0;

  const totalPayable = netProduceCost + deliveryCharge + platformFee + gstAndTaxes;

  const farmerSplits = Array.from(farmerMap.entries()).map(([farmerId, data]) => ({
    farmerId,
    farmerName: data.farmerName,
    subtotal: data.subtotal,
    itemsCount: data.count,
  }));

  return {
    itemsSubtotal,
    totalSurplusSavings,
    netProduceCost,
    deliveryCharge,
    platformFee,
    gstAndTaxes,
    totalPayable,
    farmerSplits,
  };
}

/**
 * Group order delivery fee splitting & bulk tiered savings.
 */
export function calculateGroupOrderSplit(
  totalProduceKg: number,
  participantsCount: number,
  baseHyperlocalDeliveryFee: number = 60
): {
  discountPercent: number;
  perPersonDeliveryFee: number;
  totalDeliveryFee: number;
  collectiveSavingsKg: number;
} {
  const count = Math.max(1, participantsCount);
  let discountPercent = 0;
  if (totalProduceKg >= 100) {
    discountPercent = 15;
  } else if (totalProduceKg >= 50) {
    discountPercent = 10;
  } else if (totalProduceKg >= 25) {
    discountPercent = 5;
  }

  // Clustered delivery saves costs; split evenly among participating neighbours
  const perPersonDeliveryFee = Math.ceil(baseHyperlocalDeliveryFee / count);
  const totalDeliveryFee = perPersonDeliveryFee * count;

  return {
    discountPercent,
    perPersonDeliveryFee,
    totalDeliveryFee,
    collectiveSavingsKg: totalProduceKg,
  };
}
