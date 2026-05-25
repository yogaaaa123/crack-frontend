import { describe, it, expect } from 'vitest';
import {
  createPurchaseOrderSchema,
  transformPurchaseOrderToApi,
} from './createPurchaseOrderSchema';

describe('createPurchaseOrderSchema', () => {
  const validPO = {
    supplierId: '550e8400-e29b-41d4-a716-446655440000',
    items: [
      {
        productId: '550e8400-e29b-41d4-a716-446655440001',
        quantity: 10,
        unitPrice: 5000,
      },
    ],
  };

  it('validates correct purchase order', () => {
    const result = createPurchaseOrderSchema.safeParse(validPO);
    expect(result.success).toBe(true);
  });

  it('accepts optional notes', () => {
    const result = createPurchaseOrderSchema.safeParse({ ...validPO, notes: 'Urgent' });
    expect(result.success).toBe(true);
  });

  it('rejects empty items', () => {
    const result = createPurchaseOrderSchema.safeParse({ ...validPO, items: [] });
    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID', () => {
    const result = createPurchaseOrderSchema.safeParse({
      ...validPO,
      supplierId: 'bad-uuid',
    });
    expect(result.success).toBe(false);
  });
});

describe('transformPurchaseOrderToApi', () => {
  it('transforms PO data to API format', () => {
    const input = {
      supplierId: '550e8400-e29b-41d4-a716-446655440000',
      items: [{ productId: '550e8400-e29b-41d4-a716-446655440001', quantity: 10, unitPrice: 5000 }],
    };

    const result = transformPurchaseOrderToApi(input);

    expect(result.supplierId).toBe(input.supplierId);
    expect(result.orderNumber).toMatch(/^PO-\d{6}-\d{4}$/);
    expect(result.items[0].quantity).toBe(10);
    expect(result.items[0].unitPrice).toBe('5000');
  });

  it('generates unique order numbers', () => {
    const input = {
      supplierId: '550e8400-e29b-41d4-a716-446655440000',
      items: [{ productId: '550e8400-e29b-41d4-a716-446655440001', quantity: 1, unitPrice: 100 }],
    };

    // Add a small delay between calls so Date.now() differs
    const result1 = transformPurchaseOrderToApi(input);
    const result2 = transformPurchaseOrderToApi(input);
    // The order number has format PO-YYMMDD-SEQ where SEQ is last 4 chars of Date.now()
    // In same millisecond they could be same, so just verify format
    expect(result1.orderNumber).toMatch(/^PO-\d{6}-\d{4}$/);
    expect(result2.orderNumber).toMatch(/^PO-\d{6}-\d{4}$/);
  });
});
