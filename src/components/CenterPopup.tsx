/* eslint-disable @next/next/no-img-element */
'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { cn } from '@/lib/utils';
import React, { FC, useState } from 'react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { IoCloseSharp } from 'react-icons/io5';
import './center-popup.scss';
import { Button } from './Button';

type CenterPopupProps = {
  title: string;
  subtitle: string;
  cancleText: string;
  confirmText: string;
  needClose: boolean;
  isBlack: boolean;
  plain: boolean;
  plainBtn: boolean;
  isAction: boolean;
  open: boolean;
  children?: React.ReactNode;
  onConfirm: (successCB: () => void) => void;
  onClose: (bol: false) => void;
  className?: string;
};

export const CenterPopup: FC<Partial<CenterPopupProps>> = ({
  title = '',
  subtitle = '',
  cancleText = '',
  confirmText = '',
  needClose = false,
  isBlack = false,
  plain = false,
  plainBtn = false,
  isAction = false,
  open = false,
  onConfirm,
  onClose,
  children,
  className,
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div
          className={cn(
            'centerPopup__container',
            isBlack ? 'is-black' : '',
            plain ? 'plain' : '',
            isAction ? 'action' : '',
            className
          )}
        >
          {needClose && (
            <IoCloseSharp
              className="centerPopup__container__close text-white size-6 absolute top-8 right-8"
              onClick={() => onClose?.(false)}
            />
          )}

          <DialogHeader>
            {title && (
              <DialogTitle className="centerPopup__container__title">
                {title}
              </DialogTitle>
            )}
            {subtitle && (
              <DialogDescription className="centerPopup__container__subtitle">
                {subtitle}
              </DialogDescription>
            )}
          </DialogHeader>

          <div className="centerPopup__container__slot">{children}</div>

          {plainBtn ? (
            <div className="centerPopup__container__btns--plain">
              {cancleText && (
                <div className="btn" onClick={() => onClose?.(false)}>
                  {cancleText}
                </div>
              )}

              {confirmText && (
                <Button
                  title={confirmText}
                  className="btn rtl:!border-l-0 rtl:border-r-[0.5px] rtl:border-[#545458]"
                  disabled={loading}
                  click={() => {
                    setLoading(true);

                    onConfirm?.(() => {
                      setLoading(false);
                    });
                  }}
                ></Button>
              )}
            </div>
          ) : cancleText || confirmText ? (
            <div
              className={cn(
                'centerPopup__container__btns',
                cancleText && confirmText ? 'between' : ''
              )}
            >
              {cancleText && (
                <button
                  className="cus-btn thin-y cancle"
                  onClick={() => onClose?.(false)}
                >
                  {cancleText}
                </button>
              )}

              {confirmText && (
                <Button
                  title={confirmText}
                  className="bg-[#745efe] text-white !w-auto px-4 min-w-[140px]"
                  disabled={loading}
                  click={() => {
                    setLoading(true);
                    onConfirm?.(() => {
                      setLoading(false);
                    });
                  }}
                ></Button>
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
