import { describe, it, expect } from 'vitest';
import { createReturnSchema, transformReturnToApi } from './createReturnSchema';

describe('createReturnSchema', () => {
  const validReturn = {
    salesOrderId: '550e8400-e29b-41d4-a716-446655440000',
    items: [
      {
        productId: '550e8400-e29b-41d4-a716-446655440001',
        quantity: 2,
        reason: 'Damaged item',
      },
    ],
    reason: 'Customer received damaged goods. Need to process refund.',
  };

  it('validates correct return', () => {
    const result = createReturnSchema.safeParse(validReturn);
    expect(result.success).toBe(true);
  });

  it('rejects empty items', () => {
    const result = createReturnSchema.safeParse({ ...validReturn, items: [] });
    expect(result.success).toBe(false);
  });

  it('rejects short reason (< 10 chars)', () => {
    const result = createReturnSchema.safeParse({ ...validReturn, reason: 'Short' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid UUID', () => {
    const result = createReturnSchema.safeParse({
      ...validReturn,
      salesOrderId: 'not-uuid',
    });
    expect(result.success).toBe(false);
  });
});

describe('transformReturnToApi', () => {
  it('converts quantity to string', () => {
    const input = {
      salesOrderId: '550e8400-e29b-41d4-a716-446655440000',
      items: [{ productId: '550e8400-e29b-41d4-a716-446655440001', quantity: 3, reason: 'Defect' }],
      reason: 'Product defect found',
    };

    const result = transformReturnToApi(input);
    expect(result.items[0].quantity).toBe('3');
    expect(result.salesOrderId).toBe(input.salesOrderId);
  });
});
