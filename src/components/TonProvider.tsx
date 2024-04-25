'use client';
import React, { FC } from 'react';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

export const TonProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <TonConnectUIProvider
      manifestUrl={`https://www.telegramloveai.com/tonconnect-manifest.json`}
    >
      {children}
    </TonConnectUIProvider>
  );
};
