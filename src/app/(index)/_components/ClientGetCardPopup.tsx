import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';
import { LOCALE_KEYS } from '@@/locales';
import Image from 'next/image';
import { FC } from 'react';
import { Cards, cacheCard } from './ClientCardDrawer';
import { filterImage } from '@/utils/business';

type CenterPopupProps = {
  open?: boolean;
  cardData: Cards;
  onClose?: (bol: false) => void;
};
export const ClientGetCardPopup: FC<CenterPopupProps> = ({
  open = false,
  cardData,
  onClose,
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`!block !w-full border-none text-white shadow-none data-[state=open]:!zoom-in-100`}
      >
        <Image
          src="/images/card-bg.png"
          width={278}
          height={373}
          alt="card background"
          style={{
            height: '373px',
            width: '278px',
          }}
          className="absolute top-12 right-0"
        ></Image>

        <div className="relative flex items-center justify-center">
          <Image
            src="/images/star.png"
            width={140}
            height={53}
            alt="star"
          ></Image>

          <span className="absolute bottom-0 w-full text-center text-2xl">
            {t(LOCALE_KEYS.CONGRATULATIONS)}
          </span>
        </div>

        <div className="mt-[10px] mb-4 text-white/60 font-sans text-sm w-full text-center">
          {cardData?.resourceType && t(cacheCard[cardData.resourceType]?.desc)}
        </div>

        <div className="relative z-20 flex justify-center items-center">
          <Image
            src="/images/shine.png"
            width={375}
            height={375}
            alt="shine"
          ></Image>

          <div
            className={cn(
              `border-[10px] w-[236px] h-[309px] absolute top-0 rounded-[20px] overflow-hidden`
            )}
            style={{
              borderColor:
                cardData?.resourceType &&
                cacheCard[cardData.resourceType]?.color,
            }}
          >
            <div
              className={`absolute z-10 left-2/4 top-[-1px] -translate-x-2/4 px-2 py-1 rounded-b-2xl min-w-10 border-t-0 border-[3px] border-[#FAF1F5]`}
              style={{
                background:
                  cardData?.resourceType &&
                  cacheCard[cardData.resourceType]?.color,
              }}
            >
              {cardData?.resourceType &&
                cacheCard[cardData.resourceType]?.label}
            </div>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={filterImage(cardData?.url)}
              alt=""
              className="border-[3px] border-[#FAF1F5] rounded-[8px] w-full h-full"
            ></img>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
