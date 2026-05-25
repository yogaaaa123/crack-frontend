import { describe, it, expect } from 'vitest';
import { registerSchema } from './registerSchema';

describe('registerSchema', () => {
  const validInput = {
    storeName: 'My Store',
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
  };

  it('validates correct registration input', () => {
    const result = registerSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('validates with optional displayName', () => {
    const result = registerSchema.safeParse({ ...validInput, displayName: 'Admin' });
    expect(result.success).toBe(true);
  });

  it('rejects short storeName', () => {
    const result = registerSchema.safeParse({ ...validInput, storeName: 'AB' });
    expect(result.success).toBe(false);
  });

  it('rejects invalid email', () => {
    const result = registerSchema.safeParse({ ...validInput, email: 'not-an-email' });
    expect(result.success).toBe(false);
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({ ...validInput, password: '1234567' });
    expect(result.success).toBe(false);
  });

  it('rejects empty fields', () => {
    const result = registerSchema.safeParse({
      storeName: '',
      username: '',
      email: '',
      password: '',
    });
    expect(result.success).toBe(false);
  });
});
