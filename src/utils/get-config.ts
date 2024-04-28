declare global {
  var _AppConfigEnv: {
    origin: string;
    HOST: string;
    WSS: string;
    OSS: string;
    DOWNLOADAPI: string;
    APPVERSIONCODE: number;
    APPTYPE: string;
    APPNAME: string;
    GOOGLE_GAID: string;
    TG_BOT_NAME?: string;
    TG_APP_NAME?: string;
    NODE_ENV?: string;
  };
}

export const getAppConfigEnv = (
  _origin?: string
): typeof globalThis._AppConfigEnv => {
  const origin = _origin
    ? _origin
    : typeof window === 'undefined'
    ? ''
    : window.origin;

  if (origin.includes('https://docbphqre6f8b.cloudfront.net')) {
    return {
      TG_BOT_NAME: 'AIFriendchat_bot',
      TG_APP_NAME: 'AIFriendchat',
      origin,
      HOST: 'https://doujiwrzdg1dh.cloudfront.net',
      WSS: 'wss://doujiwrzdg1dh.cloudfront.net/',
      OSS: 'https://static.ailov3.com/',
      DOWNLOADAPI: 'https://doujiwrzdg1dh.cloudfront.net/util/file/download/',
      APPVERSIONCODE: 101,
      APPTYPE: 'H5',
      APPNAME: 'AI Pet',
      GOOGLE_GAID: '',
    };
  } else if (origin.includes('https://127.0.0.1:3000')) {
    return {
      TG_BOT_NAME: 'pxs_test_bot',
      TG_APP_NAME: 'test',
      origin,
      HOST: 'https://doujiwrzdg1dh.cloudfront.net',
      WSS: 'wss://doujiwrzdg1dh.cloudfront.net/',
      OSS: 'https://static.ailov3.com/',
      DOWNLOADAPI:
        'http://ai-love-pet-322313939.us-west-2.elb.amazonaws.com/util/file/download/',
      APPVERSIONCODE: 101,
      APPTYPE: 'H5',
      APPNAME: 'AI Pet',
      GOOGLE_GAID: 'G-46HPB8YJYG',
    };
  } else {
    return {
      TG_BOT_NAME: 'AIFriendchat_bot',
      TG_APP_NAME: 'AIFriendchat',
      origin,
      HOST: 'https://doujiwrzdg1dh.cloudfront.net',
      WSS: 'wss://doujiwrzdg1dh.cloudfront.net/',
      OSS: 'https://static.ailov3.com/',
      DOWNLOADAPI: 'https://doujiwrzdg1dh.cloudfront.net/util/file/download/',
      APPVERSIONCODE: 101,
      APPTYPE: 'H5',
      APPNAME: 'AI Pet',
      GOOGLE_GAID: '',
    };
  }
};

class Singleton {
  private static _instance: Singleton;
  private AppConfigEnv: typeof globalThis._AppConfigEnv;
  private constructor() {
    this.AppConfigEnv = getAppConfigEnv(
      typeof window === 'undefined' ? process.env.NEXT_ORIGIN : origin
    );
    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable so that the value
      // is preserved across module reloads caused by HMR (Hot Module Replacement).
      global._AppConfigEnv = this.AppConfigEnv;
    }
  }

  public static get instance() {
    if (!this._instance) {
      this._instance = new Singleton();
    }
    return this._instance.AppConfigEnv;
  }
}
const AppConfigEnv = Singleton.instance;

export default AppConfigEnv;

export { AppConfigEnv };
