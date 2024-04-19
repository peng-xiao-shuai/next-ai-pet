'use client';
import { LazyMotion } from 'framer-motion';
import { FC } from 'react';
const domAnimation = () =>
  import('framer-motion').then((res) => res.domAnimation);

export const ClientLazyMotion: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
};
