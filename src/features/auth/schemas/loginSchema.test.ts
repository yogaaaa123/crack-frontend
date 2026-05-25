import { describe, it, expect } from 'vitest';
import { loginSchema } from './loginSchema';

describe('loginSchema', () => {
  it('validates correct login input', () => {
    const result = loginSchema.safeParse({ username: 'admin', password: 'secret123' });
    expect(result.success).toBe(true);
  });

  it('rejects short username', () => {
    const result = loginSchema.safeParse({ username: 'ab', password: 'secret123' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('username');
    }
  });

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ username: 'admin', password: '12345' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('password');
    }
  });

  it('rejects empty username', () => {
    const result = loginSchema.safeParse({ username: '', password: 'secret123' });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const result = loginSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
