import test from 'node:test';
import assert from 'node:assert/strict';
import {
  evaluateYieldSanity,
  calculateSurplusDiscount,
  calculateCheckoutPricing,
  calculateGroupOrderSplit,
} from './rules';

test('evaluateYieldSanity: normal acreage yield passes inspection', () => {
  // 2 acres of tomatoes producing 15,000 kg (max benchmark is 20,000 * 2 * 1.35 = 54,000 kg)
  const result = evaluateYieldSanity('tomatoes', 2, 15000);
  assert.equal(result.isPlausible, true);
  assert.equal(result.isFlaggedForReview, false);
  assert.equal(result.recommendedAction, 'Approve');
});

test('evaluateYieldSanity: suspicious volume triggers fair review instead of immediate accusation', () => {
  // 0.5 acres of tomatoes claiming 50,000 kg (way beyond physical capacity)
  const result = evaluateYieldSanity('tomatoes', 0.5, 50000);
  assert.equal(result.isPlausible, false);
  assert.equal(result.isFlaggedForReview, true);
  assert.ok(result.reason.includes('exceeds maximum plausible harvest limit'));
  assert.equal(result.recommendedAction, 'FlagForReview');
});

test('evaluateYieldSanity: FPO aggregated produce bypasses single-farmer plot limit', () => {
  const result = evaluateYieldSanity('tomatoes', 2, 80000, true);
  assert.equal(result.isPlausible, true);
  assert.equal(result.isFlaggedForReview, false);
  assert.ok(result.reason.includes('FPO'));
});

test('calculateSurplusDiscount: respects farmer floor price strictly', () => {
  // Harvested 4 days ago with shelf life of 5 days (80% elapsed => 35% discount)
  // Base price 40, 35% off = 26. But min floor price is 30.
  const now = new Date('2026-10-22T10:00:00Z');
  const harvestDate = new Date('2026-10-18T10:00:00Z').toISOString();

  const result = calculateSurplusDiscount(
    harvestDate,
    5,
    40,
    30, // floor price
    now.toISOString()
  );

  // Must not drop below 30
  assert.equal(result.finalPricePerUnit, 30);
  assert.equal(result.discountPercent, 25); // (40 - 30)/40 = 25%
  assert.equal(result.isExpiringSoon, true);
});

test('calculateCheckoutPricing: platform fee is strictly 0 and splits multiple farmers', () => {
  const items = [
    {
      farmerId: 'farmer-1',
      farmerName: 'Ramesh Patel',
      quantity: 5,
      basePrice: 50,
      discountedPrice: 40,
    },
    {
      farmerId: 'farmer-2',
      farmerName: 'Anandi Devi',
      quantity: 2,
      basePrice: 100,
      discountedPrice: 90,
    },
  ];

  const pricing = calculateCheckoutPricing(items, 'home_delivery');

  assert.equal(pricing.platformFee, 0); // Mandatory criteria
  assert.equal(pricing.farmerSplits.length, 2);
  assert.equal(pricing.netProduceCost, 5 * 40 + 2 * 90); // 200 + 180 = 380
  assert.equal(pricing.totalSurplusSavings, 5 * 10 + 2 * 10); // 70
  // Delivery with 2 distinct farmers: 35 + 20 = 55
  assert.equal(pricing.deliveryCharge, 55);
  assert.equal(pricing.totalPayable, 380 + 55);
});

test('calculateGroupOrderSplit: splits delivery fee among neighbours and awards tiered bulk savings', () => {
  const split = calculateGroupOrderSplit(60, 4, 60);
  assert.equal(split.discountPercent, 10); // 50kg+ tier
  assert.equal(split.perPersonDeliveryFee, 15); // 60 / 4
});
