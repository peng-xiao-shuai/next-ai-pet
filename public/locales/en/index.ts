import { LOCALE_KEYS } from '../keys';

const lang = {
  [LOCALE_KEYS.YOUR_PET]: 'Your Pet',
  [LOCALE_KEYS.NEXT_LEVEL_NEED]: 'next level need',
  [LOCALE_KEYS.SEND_MESSAGES_TO_EARN_$PETS]: 'Send messages to earn $Pets!',
  [LOCALE_KEYS.PLEASE_DIRECTLY_TYPE_THE_NAME_OF_YOUR_PET]:
    'Please directly type the name of your pet',
  [LOCALE_KEYS.PLEASE_GIVE_YOUR_PET_A_NAME_IN_20_WORDS]:
    'Please give your pet a name in 20_words.',
  [LOCALE_KEYS.PLEASE_CHOOSE_AN_ACTION_TO_TOUCH_YOUR_PET]:
    'Please choose an action to touch your pet.',
  [LOCALE_KEYS.CLICK_TO_FEED_YOUR_PET_FOOD]: 'Click to feed your pet food.',
  [LOCALE_KEYS.YOU_DON_T_HAVE_ENOUGH_FOOD]: 'You don’t have enough food.',
  [LOCALE_KEYS.HI_MY_GOOD_PET]: 'Hi,_my good pet.',
  [LOCALE_KEYS.HI_MY_DEAR_MASTER]: 'Hi,my dear master',
  [LOCALE_KEYS.FEED_ALL]: 'Feed all',
  [LOCALE_KEYS.YOU_HAVE_THE_FOOD_]: 'You have the food',
  [LOCALE_KEYS.FEED]: 'Feed',
  [LOCALE_KEYS.SEND]: 'Send',
  [LOCALE_KEYS.TASK]: 'Task',
  [LOCALE_KEYS.ADD_TELEGRAM_GROUP]: 'Add Telegram Group',
  [LOCALE_KEYS.FOLLOW_TELEGRAM_CHANNEL]: 'Follow Telegram Channel',
  [LOCALE_KEYS.FOLLOW_TWITTER]: 'Follow Twitter',
  [LOCALE_KEYS.LINK_TO_TON_WALLET]: 'Link to Ton wallet',
  [LOCALE_KEYS.INVITE_FRIENDS]: 'Invite friends',
  [LOCALE_KEYS.GO_TO_ADD]: 'Go to add',
  [LOCALE_KEYS.GO_TO_FOLLOW]: 'Go to follow',
  [LOCALE_KEYS.GO_TO_LINK]: 'Go to link',
  [LOCALE_KEYS.INVITE]: 'Invite',
  [LOCALE_KEYS.FOOD]: 'Food',
  [LOCALE_KEYS.MESSAGE]: 'Message',
  [LOCALE_KEYS.FINISH]: 'Finish',
  [LOCALE_KEYS.BUY]: 'Buy',
  [LOCALE_KEYS.Loading]: 'Loading',
  [LOCALE_KEYS.ADOPT_A_PET]: 'Adopt a pet',

  [LOCALE_KEYS.THANK_YOU_FOR_FEEDING]:
    'Thanks for feeding me, my master! This feed have improved ${0} capacity of $Pets',
  [LOCALE_KEYS.CAPACITY_DESCRIPTION]:
    'Feeding more dog food can increase the $Pets earned during chatting and interacting. The more you feed the dog, the more $Pets you earn from the same chatting and interacting behaviors!',
  [LOCALE_KEYS.PURCHASE_SUCCEEDS]:
    'You have buyed ${0} food,and it will reach to your account 1 minute later ! Go to feed your pet then!',
} as const;

export default lang;
