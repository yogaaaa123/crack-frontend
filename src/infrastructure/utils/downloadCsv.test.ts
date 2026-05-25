import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { downloadCsv } from './downloadCsv';

describe('downloadCsv', () => {
  const originalEnv = process.env;
  const mockCreateObjectURL = vi.fn(() => 'blob:test');
  const mockRevokeObjectURL = vi.fn();
  const mockClick = vi.fn();
  let mockLink: any;

  beforeEach(() => {
    process.env = { ...originalEnv, NEXT_PUBLIC_API_URL: 'http://localhost:8080' };
    vi.resetAllMocks();

    mockLink = {
      href: '',
      download: '',
      click: mockClick,
    };

    globalThis.fetch = vi.fn();
    globalThis.URL.createObjectURL = mockCreateObjectURL;
    globalThis.URL.revokeObjectURL = mockRevokeObjectURL;
    document.createElement = vi.fn((tag: string) => {
      if (tag === 'a') return mockLink;
      return {} as any;
    });
    document.body.appendChild = vi.fn();
    document.body.removeChild = vi.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('downloads CSV successfully', async () => {
    const mockBlob = new Blob(['a,b,c'], { type: 'text/csv' });
    (globalThis.fetch as any).mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(mockBlob),
    });

    await downloadCsv('/api/report', 'report.csv');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'http://localhost:8080/api/report',
      { credentials: 'include' },
    );
    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(mockLink.href).toBe('blob:test');
    expect(mockLink.download).toBe('report.csv');
    expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
    expect(mockClick).toHaveBeenCalled();
    expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:test');
  });

  it('throws on failed response', async () => {
    (globalThis.fetch as any).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    });

    await expect(downloadCsv('/api/report', 'report.csv')).rejects.toThrow(
      'Failed to download CSV: Internal Server Error',
    );
  });

  it('throws on network error', async () => {
    (globalThis.fetch as any).mockRejectedValue(new Error('Network error'));

    await expect(downloadCsv('/api/report', 'report.csv')).rejects.toThrow(
      'Network error',
    );
  });
});
