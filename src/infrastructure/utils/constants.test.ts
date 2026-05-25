import { describe, it, expect } from 'vitest';
import { AUTH_TOKEN_KEY, QUERY_KEYS, ROLE_HOME } from './constants';

describe('constants', () => {
  describe('AUTH_TOKEN_KEY', () => {
    it('has correct value', () => {
      expect(AUTH_TOKEN_KEY).toBe('auth_token');
    });
  });

  describe('QUERY_KEYS', () => {
    it('has products key', () => {
      expect(QUERY_KEYS.products).toEqual(['products']);
    });

    it('has productDetail key', () => {
      expect(QUERY_KEYS.productDetail('123')).toEqual(['products', '123']);
    });

    it('has sales key', () => {
      expect(QUERY_KEYS.sales).toEqual(['sales']);
    });

    it('has transactions key', () => {
      expect(QUERY_KEYS.transactions).toEqual(['transactions']);
    });

    it('has transactionDetail key', () => {
      expect(QUERY_KEYS.transactionDetail('abc')).toEqual(['transactions', 'abc']);
    });

    it('has reports key', () => {
      expect(QUERY_KEYS.reports).toEqual(['reports']);
    });

    it('has categories key', () => {
      expect(QUERY_KEYS.categories).toEqual(['categories']);
    });

    it('has currentUser key', () => {
      expect(QUERY_KEYS.currentUser).toEqual(['currentUser']);
    });
  });

  describe('ROLE_HOME', () => {
    it('maps ADMIN to dashboard/admin', () => {
      expect(ROLE_HOME.ADMIN).toBe('/dashboard/admin');
    });

    it('maps STAFF to dashboard/cashier', () => {
      expect(ROLE_HOME.STAFF).toBe('/dashboard/cashier');
    });
  });
});
