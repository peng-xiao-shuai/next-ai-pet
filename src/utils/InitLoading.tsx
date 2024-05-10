'use client';
import LoadingRender from '@/app/loading';
import { useState, useEffect } from 'react';

export const InitLoading = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(false);
  }, []);

  if (visible) {
    return <LoadingRender></LoadingRender>;
  }

  return <></>;
};
