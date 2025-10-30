/**
 * Tests for Offer Schema (schema.org)
 * Used for pricing tier structured data
 */

import { describe, it, expect } from 'vitest';
import { createOfferSchema, createProductWithOffersSchema } from './offerSchema';

describe('offerSchema', () => {
  describe('createOfferSchema', () => {
    it('should create valid Offer schema for a pricing tier', () => {
      const tier = {
        name: 'Professional',
        price: 598,
        currency: 'GBP',
        billingPeriod: 'MONTH',
        description: 'Perfect for growing firms',
        features: ['Deal pipeline', 'Data room', 'Financial analysis'],
      };

      const schema = createOfferSchema(tier);

      expect(schema['@type']).toBe('Offer');
      expect(schema.name).toBe('Professional');
      expect(schema.price).toBe('598.00');
      expect(schema.priceCurrency).toBe('GBP');
      expect(schema.availability).toBe('https://schema.org/InStock');
      expect(schema.priceValidUntil).toMatch(/^\d{4}-\d{2}-\d{2}$/); // YYYY-MM-DD format
      expect(schema.description).toBe('Perfect for growing firms');
    });

    it('should handle monthly billing period', () => {
      const tier = {
        name: 'Starter',
        price: 279,
        currency: 'GBP',
        billingPeriod: 'MONTH',
      };

      const schema = createOfferSchema(tier);

      expect(schema.priceSpecification).toMatchObject({
        '@type': 'UnitPriceSpecification',
        price: '279.00',
        priceCurrency: 'GBP',
        unitText: 'MONTH',
      });
    });

    it('should handle annual billing period', () => {
      const tier = {
        name: 'Enterprise',
        price: 1598,
        currency: 'GBP',
        billingPeriod: 'YEAR',
      };

      const schema = createOfferSchema(tier);

      expect(schema.priceSpecification.unitText).toBe('YEAR');
    });

    it('should handle free tier with zero price', () => {
      const tier = {
        name: 'Free Trial',
        price: 0,
        currency: 'GBP',
        billingPeriod: 'MONTH',
      };

      const schema = createOfferSchema(tier);

      expect(schema.price).toBe('0.00');
      expect(schema['@type']).toBe('Offer');
    });

    it('should include seller information if provided', () => {
      const tier = {
        name: 'Professional',
        price: 598,
        currency: 'GBP',
        billingPeriod: 'MONTH',
      };

      const seller = {
        '@type': 'Organization',
        name: 'ApexDeliver Ltd',
      };

      const schema = createOfferSchema(tier, seller);

      expect(schema.seller).toEqual(seller);
    });
  });

  describe('createProductWithOffersSchema', () => {
    it('should create Product schema with multiple offers', () => {
      const product = {
        name: 'ApexDeliver + CapLiquify',
        description: 'End-to-end M&A intelligence platform',
        brand: 'ApexDeliver',
        url: 'https://apexdeliver.com',
      };

      const tiers = [
        { name: 'Starter', price: 279, currency: 'GBP', billingPeriod: 'MONTH' },
        { name: 'Professional', price: 598, currency: 'GBP', billingPeriod: 'MONTH' },
      ];

      const schema = createProductWithOffersSchema(product, tiers);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe('ApexDeliver + CapLiquify');
      expect(schema.description).toBe('End-to-end M&A intelligence platform');
      expect(schema.brand).toMatchObject({
        '@type': 'Brand',
        name: 'ApexDeliver',
      });
      expect(schema.offers).toHaveLength(2);
      expect(schema.offers[0].name).toBe('Starter');
      expect(schema.offers[1].name).toBe('Professional');
    });

    it('should include aggregate rating if provided', () => {
      const product = {
        name: 'ApexDeliver',
        description: 'M&A platform',
      };

      const rating = {
        ratingValue: 4.9,
        reviewCount: 230,
      };

      const schema = createProductWithOffersSchema(product, [], rating);

      expect(schema.aggregateRating).toMatchObject({
        '@type': 'AggregateRating',
        ratingValue: 4.9,
        reviewCount: 230,
        bestRating: 5,
        worstRating: 1,
      });
    });
  });
});
