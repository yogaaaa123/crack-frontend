import { describe, it, expect } from 'vitest';
import { changePasswordSchema } from './changePasswordSchema';

describe('changePasswordSchema', () => {
  const validInput = {
    currentPassword: 'oldpass123',
    newPassword: 'newpass12345',
    confirmPassword: 'newpass12345',
  };

  it('validates correct change password input', () => {
    const result = changePasswordSchema.safeParse(validInput);
    expect(result.success).toBe(true);
  });

  it('rejects when passwords do not match', () => {
    const result = changePasswordSchema.safeParse({
      ...validInput,
      confirmPassword: 'different',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('confirmPassword');
    }
  });

  it('rejects short new password', () => {
    const result = changePasswordSchema.safeParse({
      ...validInput,
      newPassword: 'short',
      confirmPassword: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('rejects empty current password', () => {
    const result = changePasswordSchema.safeParse({
      ...validInput,
      currentPassword: '',
    });
    expect(result.success).toBe(false);
  });

  it('rejects missing fields', () => {
    const result = changePasswordSchema.safeParse({});
    expect(result.success).toBe(false);
  });
});
