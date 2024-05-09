import Zh from './zh';
import Ru from './ru';
import En from './en';
const resources = {
  zh: Zh,
  ru: Ru,
  en: En,
};

export type Resources = {
  [key in keyof typeof resources]: (typeof resources)[key] &
    Indexes<(typeof resources)[key]>;
};

export * from './keys';
export default resources as Resources;
