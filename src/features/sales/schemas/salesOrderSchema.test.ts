import { describe, it, expect } from 'vitest';
import { createSalesOrderSchema } from './salesOrderSchema';

describe('salesOrderSchema', () => {
  const validOrder = {
    orderNumber: 'SO-001',
    items: [
      {
        productId: '550e8400-e29b-41d4-a716-446655440000',
        quantity: 2,
        unitPrice: '15000',
      },
    ],
  };

  it('validates correct sales order', () => {
    const result = createSalesOrderSchema.safeParse(validOrder);
    expect(result.success).toBe(true);
  });

  it('accepts optional customerId', () => {
    const result = createSalesOrderSchema.safeParse({
      ...validOrder,
      customerId: '550e8400-e29b-41d4-a716-446655440001',
    });
    expect(result.success).toBe(true);
  });

  it('rejects empty order number', () => {
    const result = createSalesOrderSchema.safeParse({ ...validOrder, orderNumber: '' });
    expect(result.success).toBe(false);
  });

  it('rejects empty items array', () => {
    const result = createSalesOrderSchema.safeParse({ ...validOrder, items: [] });
    expect(result.success).toBe(false);
  });

  it('rejects invalid productId UUID', () => {
    const result = createSalesOrderSchema.safeParse({
      ...validOrder,
      items: [{ productId: 'bad-uuid', quantity: 1, unitPrice: '100' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects zero quantity', () => {
    const result = createSalesOrderSchema.safeParse({
      ...validOrder,
      items: [{ productId: '550e8400-e29b-41d4-a716-446655440000', quantity: 0, unitPrice: '100' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty unitPrice', () => {
    const result = createSalesOrderSchema.safeParse({
      ...validOrder,
      items: [{ productId: '550e8400-e29b-41d4-a716-446655440000', quantity: 1, unitPrice: '' }],
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const result = createSalesOrderSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
