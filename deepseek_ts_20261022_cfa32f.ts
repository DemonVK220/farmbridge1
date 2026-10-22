import { describe, it, expect } from 'vitest';
import { evaluateYieldSanity, calculateSurplusDiscount, calculateCheckoutPricing, calculateGroupOrderSplit } from './rules';

describe('evaluateYieldSanity', () => {
  it('passes normal acreage yield', () => {
    const result = evaluateYieldSanity('tomatoes', 2, 15000);
    expect(result.isPlausible).toBe(true);
    expect(result.isFlaggedForReview).toBe(false);
    expect(result.recommendedAction).toBe('Approve');
  });
  it('flags suspicious volume for fair review', () => {
    const result = evaluateYieldSanity('tomatoes', 0.5, 50000);
    expect(result.isPlausible).toBe(false);
    expect(result.isFlaggedForReview).toBe(true);
    expect(result.reason).toMatch(/exceeds maximum plausible harvest limit/);
  });
  it('lets FPO aggregated produce bypass single-farmer plot limit', () => {
    const result = evaluateYieldSanity('tomatoes', 2, 80000, true);
    expect(result.isPlausible).toBe(true);
    expect(result.reason).toMatch(/FPO/);
  });
});

describe('calculateSurplusDiscount', () => {
  it('strictly respects farmer floor price', () => {
    const now = new Date('2026-10-22T10:00:00Z');
    const harvestDate = new Date('2026-10-18T10:00:00Z').toISOString();
    const result = calculateSurplusDiscount(harvestDate, 5, 40, 30, now.toISOString());
    expect(result.finalPricePerUnit).toBe(30);
    expect(result.discountPercent).toBe(25);
  });
});

describe('calculateCheckoutPricing', () => {
  it('platform fee is always ₹0', () => {
    const items = [
      { farmerId: 'f1', farmerName: 'A', quantity: 5, basePrice: 50, discountedPrice: 40 },
      { farmerId: 'f2', farmerName: 'B', quantity: 2, basePrice: 100, discountedPrice: 90 },
    ];
    const pricing = calculateCheckoutPricing(items, 'home_delivery');
    expect(pricing.platformFee).toBe(0);
    expect(pricing.farmerSplits).toHaveLength(2);
    expect(pricing.totalPayable).toBe(435);
  });
});

describe('calculateGroupOrderSplit', () => {
  it('splits delivery fee and awards tiered discounts', () => {
    const split = calculateGroupOrderSplit(60, 4, 60);
    expect(split.discountPercent).toBe(10);
    expect(split.perPersonDeliveryFee).toBe(15);
  });
});