import { describe, it, expect } from 'vitest';
import {
  createProductSchema,
  updateProductSchema,
  transformProductToApi,
} from './productSchema';

describe('productSchema', () => {
  const validProduct = {
    sku: 'SKU-001',
    name: 'Test Product',
    price: 15000,
    stockQuantity: 10,
    reorderLevel: 5,
    categoryId: '550e8400-e29b-41d4-a716-446655440000',
  };

  describe('createProductSchema', () => {
    it('validates correct product', () => {
      const result = createProductSchema.safeParse(validProduct);
      expect(result.success).toBe(true);
    });

    it('accepts optional fields', () => {
      const result = createProductSchema.safeParse({
        ...validProduct,
        description: 'A product',
        supplierId: '550e8400-e29b-41d4-a716-446655440001',
        imageUrl: 'https://example.com/image.jpg',
      });
      expect(result.success).toBe(true);
    });

    it('rejects short SKU', () => {
      const result = createProductSchema.safeParse({ ...validProduct, sku: 'AB' });
      expect(result.success).toBe(false);
    });

    it('rejects short name', () => {
      const result = createProductSchema.safeParse({ ...validProduct, name: 'AB' });
      expect(result.success).toBe(false);
    });

    it('rejects long name (>100 chars)', () => {
      const result = createProductSchema.safeParse({ ...validProduct, name: 'A'.repeat(101) });
      expect(result.success).toBe(false);
    });

    it('rejects non-positive price', () => {
      const result = createProductSchema.safeParse({ ...validProduct, price: 0 });
      expect(result.success).toBe(false);
    });

    it('rejects negative stock', () => {
      const result = createProductSchema.safeParse({ ...validProduct, stockQuantity: -1 });
      expect(result.success).toBe(false);
    });

    it('rejects negative reorderLevel', () => {
      const result = createProductSchema.safeParse({ ...validProduct, reorderLevel: -1 });
      expect(result.success).toBe(false);
    });

    it('rejects invalid UUID for categoryId', () => {
      const result = createProductSchema.safeParse({ ...validProduct, categoryId: 'not-uuid' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid image URL', () => {
      const result = createProductSchema.safeParse({
        ...validProduct,
        imageUrl: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });

    it('rejects non-integer price', () => {
      const result = createProductSchema.safeParse({ ...validProduct, price: 15.5 });
      expect(result.success).toBe(false);
    });
  });

  describe('updateProductSchema', () => {
    it('allows partial updates', () => {
      const result = updateProductSchema.safeParse({ name: 'Updated' });
      expect(result.success).toBe(true);
    });

    it('allows empty object', () => {
      const result = updateProductSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('transformProductToApi', () => {
    it('converts numbers to strings', () => {
      const result = transformProductToApi(validProduct);
      expect(result.price).toBe('15000');
      expect(result.stockQuantity).toBe('10');
      expect(result.reorderLevel).toBe('5');
    });

    it('handles partial data', () => {
      const result = transformProductToApi({ name: 'Test' });
      expect(result.name).toBe('Test');
    });
  });
});
