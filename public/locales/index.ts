import Zh from './zh';
import Ru from './ru';
import En from './en';
const resources = {
  zh: Zh,
  ru: Ru,
  en: En,
};

export type Resources = {
  [key in keyof typeof resources]: (typeof resources)[key] & {
    [P in keyof typeof En]: P extends keyof (typeof resources)[key]
      ? (typeof resources)[key][P]
      : '';
  };
};

export * from './keys';
export default resources as Resources;
