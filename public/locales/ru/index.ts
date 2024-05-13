import { LOCALE_KEYS } from '../keys';

const lang = {
  [LOCALE_KEYS.YOUR_PET]: 'Твой питомец',
  [LOCALE_KEYS.NEXT_LEVEL_NEED]: 'Требования следующего уровня',
  [LOCALE_KEYS.SEND_MESSAGES_TO_EARN_$PETS]:
    'Отправить сообщение и заработать $Pets',
  [LOCALE_KEYS.PLEASE_DIRECTLY_TYPE_THE_NAME_OF_YOUR_PET]:
    'Пожалуйста, назови своего питомца, просто введи имя и отправь',
  [LOCALE_KEYS.PLEASE_GIVE_YOUR_PET_A_NAME_IN_20_WORDS]:
    'Имя должно быть не более 20 символов',
  [LOCALE_KEYS.PLEASE_CHOOSE_AN_ACTION_TO_TOUCH_YOUR_PET]:
    'Выбери действие, чтобы погладить своего питомца',
  [LOCALE_KEYS.CLICK_TO_FEED_YOUR_PET_FOOD]:
    'Нажмите, чтобы покормить своего маленького питомца',
  [LOCALE_KEYS.YOU_DON_T_HAVE_ENOUGH_FOOD]: 'У вас недостаточно еды',
  [LOCALE_KEYS.HI_MY_GOOD_PET]: 'Привет, мой маленький питомец',
  [LOCALE_KEYS.HI_MY_DEAR_MASTER]: 'Привет, мой дорогой хозяин',
  [LOCALE_KEYS.FEED_ALL]: 'Всё покормить',
  [LOCALE_KEYS.YOU_HAVE_THE_FOOD_]: 'Количество еды',
  [LOCALE_KEYS.FEED]: 'кормить',
  [LOCALE_KEYS.SEND]: 'Отправить',
  [LOCALE_KEYS.TASK]: 'Задания',
  [LOCALE_KEYS.ADD_TELEGRAM_GROUP]: 'Присоединиться к сообществу',
  [LOCALE_KEYS.FOLLOW_TELEGRAM_CHANNEL]: 'Подписаться на канал',
  [LOCALE_KEYS.FOLLOW_TWITTER]: 'Подписаться на X',
  [LOCALE_KEYS.LINK_TO_TON_WALLET]: 'Подключить кошелёк ton',
  [LOCALE_KEYS.INVITE_FRIENDS]: 'Пригласить друзей',
  [LOCALE_KEYS.GO_TO_ADD]: 'Присоединиться',
  [LOCALE_KEYS.GO_TO_FOLLOW]: 'Подписаться',
  [LOCALE_KEYS.GO_TO_LINK]: 'Подключить кошелёк',
  [LOCALE_KEYS.INVITE]: 'Пригласить',
  [LOCALE_KEYS.FOOD]: 'Еда',
  [LOCALE_KEYS.MESSAGE]: 'Новости',
  [LOCALE_KEYS.FINISH]: 'Завершено',
  [LOCALE_KEYS.BUY]: 'Покупка',
  [LOCALE_KEYS.Loading]: 'Загрузка',
  [LOCALE_KEYS.ADOPT_A_PET]: 'Усыновить питомца',
  [LOCALE_KEYS.THANK_YOU_FOR_FEEDING]:
    'Спасибо, что покормили меня, мой хозяин! Этот корм улучшил ${0} емкость $Pets',
  [LOCALE_KEYS.CAPACITY_DESCRIPTION]:
    'Чем больше кормите собачьим кормом, тем больше $Pets вы зарабатываете во время чата и взаимодействия, чем больше кормите, тем больше $Pets вы зарабатываете за одинаковые чаты и взаимодействия!',
  [LOCALE_KEYS.PURCHASE_SUCCEEDS]:
    'Вы купили еду ${0}, и она поступит на ваш счет через 1 минуту! Тогда идите кормить своего питомца!',
} as const;
export default lang;
