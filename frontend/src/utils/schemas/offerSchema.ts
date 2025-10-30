/**
 * Offer Schema (schema.org) Utilities
 * Creates structured data for pricing tiers and product offers
 *
 * @see https://schema.org/Offer
 * @see https://schema.org/Product
 */

interface PricingTier {
  name: string;
  price: number;
  currency: string;
  billingPeriod: 'MONTH' | 'YEAR';
  description?: string;
  features?: string[];
  url?: string;
}

interface ProductInfo {
  name: string;
  description: string;
  brand?: string;
  url?: string;
  image?: string;
}

interface AggregateRating {
  ratingValue: number;
  reviewCount: number;
}

interface Seller {
  '@type': string;
  name: string;
  url?: string;
}

/**
 * Creates an Offer schema for a single pricing tier
 *
 * @param tier - Pricing tier information
 * @param seller - Optional seller information
 * @returns Offer schema object
 */
export function createOfferSchema(tier: PricingTier, seller?: Seller) {
  // Calculate price valid until (1 year from now)
  const validUntil = new Date();
  validUntil.setFullYear(validUntil.getFullYear() + 1);
  const priceValidUntil = validUntil.toISOString().split('T')[0];

  const offer: Record<string, any> = {
    '@type': 'Offer',
    name: tier.name,
    description: tier.description,
    price: tier.price.toFixed(2),
    priceCurrency: tier.currency,
    availability: 'https://schema.org/InStock',
    priceValidUntil,
    priceSpecification: {
      '@type': 'UnitPriceSpecification',
      price: tier.price.toFixed(2),
      priceCurrency: tier.currency,
      unitText: tier.billingPeriod,
    },
  };

  if (tier.url) {
    offer.url = tier.url;
  }

  if (seller) {
    offer.seller = seller;
  }

  return offer;
}

/**
 * Creates a Product schema with multiple Offer schemas
 * Useful for pricing pages showing multiple tiers
 *
 * @param product - Product information
 * @param tiers - Array of pricing tiers
 * @param rating - Optional aggregate rating
 * @returns Complete Product schema with offers
 */
export function createProductWithOffersSchema(
  product: ProductInfo,
  tiers: PricingTier[],
  rating?: AggregateRating
) {
  const schema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
  };

  if (product.brand) {
    schema.brand = {
      '@type': 'Brand',
      name: product.brand,
    };
  }

  if (product.url) {
    schema.url = product.url;
  }

  if (product.image) {
    schema.image = product.image;
  }

  // Add offers
  schema.offers = tiers.map(tier => createOfferSchema(tier));

  // Add aggregate rating if provided
  if (rating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: rating.ratingValue,
      reviewCount: rating.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return schema;
}

/**
 * Type exports for external use
 */
export type { PricingTier, ProductInfo, AggregateRating, Seller };
