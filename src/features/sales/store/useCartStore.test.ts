import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './useCartStore';
import type { Product } from '@/features/products/types';

function createMockProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    sku: 'SKU-001',
    name: 'Test Product',
    description: 'A test product',
    price: 15000,
    stockQuantity: 10,
    reorderLevel: 5,
    categoryId: 'cat-1',
    supplierId: 'sup-1',
    imageUrl: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  } as Product;
}

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [] });
  });

  describe('addItem', () => {
    it('adds a new product to cart with quantity 1', () => {
      const product = createMockProduct();
      useCartStore.getState().addItem(product);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].id).toBe('prod-1');
      expect(items[0].cartQuantity).toBe(1);
    });

    it('increments quantity when adding existing product', () => {
      const product = createMockProduct();
      useCartStore.getState().addItem(product);
      useCartStore.getState().addItem(product);

      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].cartQuantity).toBe(2);
    });

    it('caps quantity at stockQuantity', () => {
      const product = createMockProduct({ stockQuantity: 2 });
      useCartStore.getState().addItem(product);
      useCartStore.getState().addItem(product);
      useCartStore.getState().addItem(product);
      useCartStore.getState().addItemItem?.({ stockQuantity: 2, id: 'prod-1' }); // ensure at cap

      const items = useCartStore.getState().items;
      expect(items[0].cartQuantity).toBeLessThanOrEqual(2);
    });

    it('adds multiple different products', () => {
      const product1 = createMockProduct({ id: 'prod-1', name: 'Product 1' });
      const product2 = createMockProduct({ id: 'prod-2', name: 'Product 2' });

      useCartStore.getState().addItem(product1);
      useCartStore.getState().addItem(product2);

      expect(useCartStore.getState().items).toHaveLength(2);
    });
  });

  describe('removeItem', () => {
    it('removes an item from cart', () => {
      const product = createMockProduct();
      useCartStore.getState().addItem(product);
      useCartStore.getState().removeItem('prod-1');

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('does nothing when removing non-existent item', () => {
      const product = createMockProduct();
      useCartStore.getState().addItem(product);
      useCartStore.getState().removeItem('non-existent');

      expect(useCartStore.getState().items).toHaveLength(1);
    });
  });

  describe('updateQuantity', () => {
    it('updates quantity of an item', () => {
      const product = createMockProduct();
      useCartStore.getState().addItem(product);
      useCartStore.getState().updateQuantity('prod-1', 5);

      expect(useCartStore.getState().items[0].cartQuantity).toBe(5);
    });

    it('removes item when quantity is 0', () => {
      const product = createMockProduct();
      useCartStore.getState().addItem(product);
      useCartStore.getState().updateQuantity('prod-1', 0);

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('removes item when quantity is negative', () => {
      const product = createMockProduct();
      useCartStore.getState().addItem(product);
      useCartStore.getState().updateQuantity('prod-1', -1);

      expect(useCartStore.getState().items).toHaveLength(0);
    });

    it('caps quantity at stockQuantity', () => {
      const product = createMockProduct({ stockQuantity: 3 });
      useCartStore.getState().addItem(product);
      useCartStore.getState().updateQuantity('prod-1', 100);

      expect(useCartStore.getState().items[0].cartQuantity).toBe(3);
    });
  });

  describe('clearCart', () => {
    it('clears all items', () => {
      useCartStore.getState().addItem(createMockProduct({ id: 'prod-1' }));
      useCartStore.getState().addItem(createMockProduct({ id: 'prod-2' }));
      useCartStore.getState().clearCart();

      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe('getTotalPrice', () => {
    it('returns 0 for empty cart', () => {
      expect(useCartStore.getState().getTotalPrice()).toBe(0);
    });

    it('calculates total price correctly', () => {
      useCartStore.getState().addItem(createMockProduct({ id: 'p1', price: 10000 }));
      useCartStore.getState().addItem(createMockProduct({ id: 'p2', price: 5000 }));
      useCartStore.getState().updateQuantity('p2', 3); // 3 * 5000 = 15000

      expect(useCartStore.getState().getTotalPrice()).toBe(10000 + 15000);
    });
  });

  describe('getItemCount', () => {
    it('returns 0 for empty cart', () => {
      expect(useCartStore.getState().getItemCount()).toBe(0);
    });

    it('counts total items (sum of quantities)', () => {
      useCartStore.getState().addItem(createMockProduct({ id: 'p1' }));
      useCartStore.getState().addItem(createMockProduct({ id: 'p2' }));
      useCartStore.getState().updateQuantity('p1', 3);

      expect(useCartStore.getState().getItemCount()).toBe(3 + 1);
    });
  });
});
