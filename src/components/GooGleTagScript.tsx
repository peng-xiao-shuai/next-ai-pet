'use client';

import AppConfigEnv from '@/utils/get-config';
import { useEffect, useState } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';

export const GoogleTagScript = () => {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setLoading(true);
  }, []);

  return (
    <>
      {loading && !!AppConfigEnv.GOOGLE_GAID && (
        <GoogleAnalytics gaId={AppConfigEnv.GOOGLE_GAID}></GoogleAnalytics>
      )}
    </>
  );
};
