import { useEffect, useState, useCallback } from 'react';
import resources, { LOCALE_KEYS, Resources } from '@@/locales';

export const useTranslation = () => {
  const [lang, setLang] = useState<keyof typeof resources>('en');
  useEffect(() => {
    if (window.Telegram?.WebApp.initDataUnsafe.user.language_code) {
      setLang(
        window.Telegram?.WebApp.initDataUnsafe.user.language_code.substring(
          0,
          2
        )
      );
    }
  }, []);

  const t = useCallback(
    <T extends LOCALE_KEYS>(
      key: T,
      arr: any[] = []
    ): Resources[keyof typeof resources][T] => {
      if (arr.length) {
        return resources[lang]?.[key].replace(/\$\{(\d+)\}/gi, (k, e) => {
          return arr[Number(e)];
        }) as Resources[keyof typeof resources][T];
      }
      return resources[lang]?.[key];
    },
    [lang]
  );
  return {
    lang,
    t,
  };
};
