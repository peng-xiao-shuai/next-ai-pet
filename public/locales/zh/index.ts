import { LOCALE_KEYS } from '../keys';

const lang = {
  [LOCALE_KEYS.YOUR_PET]: '你的宠物',
  [LOCALE_KEYS.NEXT_LEVEL_NEED]: '下个级别需求',
  [LOCALE_KEYS.SEND_MESSAGES_TO_EARN_$PETS]: '发消息赚$Pets',
  [LOCALE_KEYS.PLEASE_DIRECTLY_TYPE_THE_NAME_OF_YOUR_PET]:
    '请直接在输入框中为您的宠物命名，直接输入名字并发送即可',
  [LOCALE_KEYS.PLEASE_GIVE_YOUR_PET_A_NAME_IN_20_WORDS]:
    '名字请控制在20个字符以内',
  [LOCALE_KEYS.PLEASE_CHOOSE_AN_ACTION_TO_TOUCH_YOUR_PET]:
    '请选择一个动作去摸摸你的宠物',
  [LOCALE_KEYS.CLICK_TO_FEED_YOUR_PET_FOOD]: '点击投喂你的小宠物',
  [LOCALE_KEYS.YOU_DON_T_HAVE_ENOUGH_FOOD]: '你没有足够的粮食',
  [LOCALE_KEYS.HI_MY_GOOD_PET]: '你好我的小宠物',
  [LOCALE_KEYS.HI_MY_DEAR_MASTER]: '你好，我亲爱的主人',
  [LOCALE_KEYS.FEED_ALL]: '全部投喂',
  [LOCALE_KEYS.YOU_HAVE_THE_FOOD_]: '拥有的粮食数',
  [LOCALE_KEYS.FEED]: '喂养',
  [LOCALE_KEYS.SEND]: '发送',
  [LOCALE_KEYS.TASK]: '任务',
  [LOCALE_KEYS.ADD_TELEGRAM_GROUP]: '加入社群',
  [LOCALE_KEYS.FOLLOW_TELEGRAM_CHANNEL]: '关注频道',
  [LOCALE_KEYS.FOLLOW_TWITTER]: '关注X',
  [LOCALE_KEYS.LINK_TO_TON_WALLET]: '连接ton钱包',
  [LOCALE_KEYS.INVITE_FRIENDS]: '邀请好友',
  [LOCALE_KEYS.GO_TO_ADD]: '去加入',
  [LOCALE_KEYS.GO_TO_FOLLOW]: '去关注',
  [LOCALE_KEYS.GO_TO_LINK]: '链接钱包',
  [LOCALE_KEYS.INVITE]: '邀请',
  [LOCALE_KEYS.FOOD]: '粮食',
  [LOCALE_KEYS.MESSAGE]: '消息',
  [LOCALE_KEYS.FINISH]: '已完成',
  [LOCALE_KEYS.BUY]: '购买',
  [LOCALE_KEYS.Loading]: '加载中',
  [LOCALE_KEYS.ADOPT_A_PET]: '认养一只宠物',
  [LOCALE_KEYS.THANK_YOU_FOR_FEEDING]:
    '谢谢主人给我投喂，本次投喂产能增加 ${0}',
  [LOCALE_KEYS.CAPACITY_DESCRIPTION]:
    '多喂狗粮，可以提升聊天、互动时候获得的$Pets，喂得越多，同样的聊天、互动行为赚到的$Pets越多！',
  [LOCALE_KEYS.PURCHASE_SUCCEEDS]:
    '您已购买成功，粮食+${0}；快去喂你的宠物吧！',
} as const;
export default lang;
