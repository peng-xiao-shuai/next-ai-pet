import { sendGAEvent } from '@next/third-parties/google';
import Cookies from 'js-cookie';

export enum CustomEvents {
  /**
   * 聊天条数
   */
  NUMBER_CHATS = 'NUMBER_CHATS',

  /**
   * 聊天用户数
   */
  NUMBER_CHA_USERS = 'NUMBER_CHA_USERS',

  /**
   * 亲吻数
   */
  NUMBER_KISSES = 'NUMBER_KISSES',

  /**
   * 亲吻用户数
   */
  KISS_USERS = 'KISS_USERS',

  /**
   * 抚摸数
   */
  OF_STROKES = 'OF_STROKES',

  /**
   * 抚摸用户数
   */
  PETTING_USERS = 'PETTING_USERS',

  /**
   * 拥抱数
   */
  OF_HUGS = 'OF_HUGS',

  /**
   * 拥抱用户数
   */
  NUMBER_HUG_USERS = 'NUMBER_HUG_USERS',

  /**
   * 有互动行为用户数
   */
  ARE_INTERACTIVE_USERS = 'ARE_INTERACTIVE_USERS',

  /**
   * 用户总喂狗粮数
   */
  NUMBER_OF_FOOD_USERS_FEED = 'NUMBER_OF_FOOD_USERS_FEED',

  /**
   * 喂狗粮用户数
   */
  FEED_THE_NUMBER_OF_DOG_FOOD_USERS = 'FEED_THE_NUMBER_OF_DOG_FOOD_USERS',

  /**
   * 喂食页面访问人数
   */
  FEED_THE_NUMBER_OF_PAGE_VISITORS = 'FEED_THE_NUMBER_OF_PAGE_VISITORS',

  /**
   * 每次喂食数分布
   */
  NUMBER_DISTRIBUTION_PER_FEEDING = 'NUMBER_DISTRIBUTION_PER_FEEDING',

  /**
   * 加群完成人数
   */
  NUMBER_OF_PEOPLE_COMPLETING_THE_GROUP = 'NUMBER_OF_PEOPLE_COMPLETING_THE_GROUP',

  /**
   * 关注频道人数
   */
  NUMBER_OF_FOLLOWERS = 'NUMBER_OF_FOLLOWERS',

  /**
   * 加入tapppark人数
   */
  NUMBER_OF_PEOPLE_WHO_JOINED_TAPPPARK = 'NUMBER_OF_PEOPLE_WHO_JOINED_TAPPPARK',

  /**
   * 关注推特人数
   */
  FOLLOW_THE_NUMBER_OF_TWITTER_USERS = 'FOLLOW_THE_NUMBER_OF_TWITTER_USERS',

  /**
   * 链接钱包人数
   */
  LINK_WALLET_NUMBER = 'LINK_WALLET_NUMBER',

  /**
   * 点击邀请好友人数
   */
  CLICK_TO_INVITE_THE_NUMBER_OF_FRIENDS = 'CLICK_TO_INVITE_THE_NUMBER_OF_FRIENDS',

  /**
   * 点击邀请好友次数
   */
  THE_NUMBER_OF_TIMES_YOU_CLICK_TO_INVITE_FRIENDS = 'THE_NUMBER_OF_TIMES_YOU_CLICK_TO_INVITE_FRIENDS',

  /**
   * 成功邀请好友人数
   */
  NUMBER_OF_FRIENDS_SUCCESSFULLY_INVITED = 'NUMBER_OF_FRIENDS_SUCCESSFULLY_INVITED',
  /**
   * 裂变新增用户数
   */
  FISSION_NEW_USERS = 'FISSION_NEW_USERS',
  /**
   * 买狗粮用户数
   */
  BUY_DOG_FOOD_USERS = 'BUY_DOG_FOOD_USERS',

  /**
   * 购买狗粮页面访问人数
   */
  NUMBER_OF_VISITORS_TO_BUY_DOG_FOOD_PAGE = 'NUMBER_OF_VISITORS_TO_BUY_DOG_FOOD_PAGE',
}

const COOKIE_NAME = 'event';

// 设置事件的 Cookie
const setEventCookie = (val: string) => {
  const now = new Date();
  const endOfDayUTC = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1)
  );
  const msUntilEndOfDayUTC = endOfDayUTC.getTime() - now.getTime();
  const expires = msUntilEndOfDayUTC / 1000 / 60 / 60 / 24; // 将毫秒转换为天数

  Cookies.set(COOKIE_NAME, val, { expires });
};

// 检查事件的 Cookie 是否存在
const checkEventCookie = (name: CustomEvents) => {
  const val = Cookies.get(COOKIE_NAME);
  console.log(val, val !== undefined, val?.split(',').includes(name));

  return val !== undefined && val.split(',').includes(name);
};

const triggerEvent = (
  eventAction: CustomEvents,
  isSetCookie: boolean,
  eventValue?: any
) => {
  const eventName = `CUSTOM_${eventAction}`;

  if (!isSetCookie) {
    console.log('触发 ==========》');
    sendGAEvent('event', eventName, {
      value: eventValue || window.Telegram?.WebApp.initDataUnsafe.user?.id,
    });
    return;
  }

  if (!checkEventCookie(eventAction)) {
    console.log('Triggering event and setting cookie.');

    // 这里可以集成实际的事件跟踪逻辑，例如 Google Analytics 的 gtag
    sendGAEvent('event', eventName, {
      value: eventValue || window.Telegram?.WebApp.initDataUnsafe.user?.id,
    });

    const val = Cookies.get(COOKIE_NAME)?.split(',') || [];
    val.push(eventAction);
    // 设置 cookie 以记录事件已被触发
    setEventCookie(val?.join(','));
  } else {
    console.log('Event has already been triggered today.');
  }
};

type Events = {
  eventAction: CustomEvents;
  eventValue?: any;
  isSetCookie?: boolean;
};

export function handleTriggerEvent(
  eventAction: CustomEvents,
  isSetCookie?: boolean,
  eventValue?: any
): void;
export function handleTriggerEvent(events: Events[]): void;
// 触发事件的逻辑
export function handleTriggerEvent(
  arg1: any,
  isSetCookie?: boolean,
  eventValue?: any
) {
  if (Array.isArray(arg1)) {
    // 处理事件数组
    arg1.forEach((event: Events) => {
      triggerEvent(event.eventAction, event.isSetCookie || false, eventValue);
    });
  } else {
    triggerEvent(arg1, isSetCookie!, eventValue);
  }
}
