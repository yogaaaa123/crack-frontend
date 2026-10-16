'use client';

import { useCallback, useEffect, useRef } from 'react';
import Script from 'next/script';
import { useGoogleLogin } from '../hooks/useGoogleLogin';
import type { ApiError } from '@/infrastructure/api/types';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
          }) => void;
          renderButton: (
            element: HTMLElement,
            options: {
              theme?: string;
              size?: string;
              text?: string;
              width?: number;
            },
          ) => void;
        };
      };
    };
  }
}

export function GoogleLoginButton() {
  const googleLogin = useGoogleLogin();
  const buttonRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  const handleCredential = useCallback(
    (response: { credential: string }) => {
      googleLogin.mutate(response.credential);
    },
    [googleLogin],
  );

  const initialize = useCallback(() => {
    if (!clientId || !window.google || !buttonRef.current) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleCredential,
    });
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      width: 320,
    });
  }, [clientId, handleCredential]);

  // Script may already be cached from a previous navigation — init immediately.
  useEffect(() => {
    if (window.google) initialize();
  }, [initialize]);

  if (!clientId) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>

      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={initialize}
      />

      <div ref={buttonRef} className="flex justify-center" />

      {googleLogin.isError && (
        <p className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {(googleLogin.error as unknown as ApiError)?.message ?? 'Google login failed'}
        </p>
      )}
    </div>
  );
}
