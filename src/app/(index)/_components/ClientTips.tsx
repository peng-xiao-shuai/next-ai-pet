import { FC } from 'react';
import { m } from 'framer-motion';
import { LOCALE_KEYS } from '@@/locales';
import { useTranslation } from '@/hooks/useTranslation';

export const ClientTips: FC<{
  localeKey: LOCALE_KEYS;
  className?: string;
  cornerClassName?: string;
  visible: boolean;
}> = ({ localeKey, visible, className, cornerClassName }) => {
  const { t } = useTranslation();
  return (
    <m.div
      initial={{ opacity: 0, scale: 0 }}
      animate={
        visible
          ? { opacity: 1, scale: 1 }
          : {
              opacity: 0,
              transitionEnd: {
                display: 'none',
              },
            }
      }
    >
      <div
        className={`absolute z-50 px-5 py-4 bg-gradient-to-t to-[#F4B4CF] from-[#BE89F5] rounded-xl text-[#1D1C21] text-lg leading-5 font-bold ${className}`}
      >
        {t(localeKey)}
        {/* 三角形 */}
        <div
          className={`absolute bg-[#BE89F5] size-3 rotate-45 ${cornerClassName}`}
        ></div>
      </div>
    </m.div>
  );
};
