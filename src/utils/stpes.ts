import { LOCALE_KEYS } from '@@/locales';
import { StepType } from '@reactour/tour';

export enum STEP_SELECTOR {
  INPUT = 'input-step',
  FIRST = 'first-step',
  DOG_BOWL = 'dog-bowl',
  SHARE = 'share-step',
  PHOTO_ALBUM = 'photo-album-step',
}

export type _Steps = StepType & {
  _contentArg?: any[];
  specialEventTrigger?: string[];
};

export const _steps: _Steps[] = [
  {
    selector: '#' + STEP_SELECTOR.INPUT,
    content: LOCALE_KEYS.SEND_MESSAGES_TO_EARN_$PETS,
    padding: { popover: [0, 0] },
    styles: {
      popover: (base) => ({
        ...base,
        width: '180px',
        left: 'unset',
        right: '20px',
      }),
    },
  },
  {
    selector: '#' + STEP_SELECTOR.FIRST,
    content: LOCALE_KEYS.PLEASE_CHOOSE_AN_ACTION_TO_TOUCH_YOUR_PET,
    padding: { popover: [40, 0] },
    styles: {
      popover: (base) => ({
        ...base,
        width: '250px',
      }),
    },
    specialEventTrigger: ['HIGHLIGHT_ACTION_BTN'],
  },
  {
    selector: '#' + STEP_SELECTOR.DOG_BOWL,
    content: LOCALE_KEYS.CLICK_TO_FEED_YOUR_PET_FOOD,
    position: 'right',
    styles: {
      popover: (base) => ({
        ...base,
        width: '200px',
      }),
    },
    specialEventTrigger: ['HIGHLIGHT_FEED_FOOD'],
  },
  {
    selector: '#' + STEP_SELECTOR.SHARE,
    content: LOCALE_KEYS.SHARE_TEXT,
    position: 'bottom',
    styles: {
      popover: (base) => ({
        ...base,
        width: '200px',
      }),
    },
    _contentArg: [1000],
    specialEventTrigger: ['HIGHLIGHT_SHARE'],
  },
  {
    selector: '#' + STEP_SELECTOR.PHOTO_ALBUM,
    content: LOCALE_KEYS.CARD_TEXT,
    position: 'bottom',
    styles: {
      popover: (base) => ({
        ...base,
        width: '320px',
      }),
    },
    specialEventTrigger: ['HIGHLIGHT_PHOTO_ALBUM'],
  },
];
