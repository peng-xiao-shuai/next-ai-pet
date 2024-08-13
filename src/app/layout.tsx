import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Loading } from '@/components/Loading';
import { Toaster } from 'sonner';
import { TGInitScript } from '@/components/TGInitScript';
import { ClientLazyMotion } from '@/components/ClientLazyMotion';
import { TonProvider } from '@/components/TonProvider';
import { InitLoading } from '@/components/InitLoading';
import { GoogleAnalytics } from '@next/third-parties/google';
import AppConfigEnv from '@/utils/get-config';

const inter = localFont({
  src: '../../public/FontsFree-Net-SFProText-Semibold.ttf',
});

export const metadata: Metadata = {
  title: 'AiPets',
  description:
    'Chat and interact with your pet, and your AI pet will accompany you for life. Invite friends to earn more $PET together!📈',
};

export function generateViewport(): Viewport {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <main className="h-[100vh] w-full">
          {/* <TonProvider> */}
          <ClientLazyMotion>{children}</ClientLazyMotion>
          {/* </TonProvider> */}

          <InitLoading></InitLoading>
        </main>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 1500,
          }}
        />
        <TGInitScript></TGInitScript>

        <GoogleAnalytics gaId={AppConfigEnv.GOOGLE_GAID}></GoogleAnalytics>

        <Loading></Loading>
      </body>
    </html>
  );
}
