'use client';
import React, { FC } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export const TonProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <TonConnectUIProvider
      manifestUrl={`https://docbphqre6f8b.cloudfront.net/tonconnect-manifest.json`}
    >
      {children}
    </TonConnectUIProvider>
  );
};
