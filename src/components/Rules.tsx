import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AiFillQuestionCircle } from 'react-icons/ai';
import { FC } from 'react';

export const Rules: FC<{
  className?: string;
  title?: string;
  children: React.ReactNode;
}> = ({ className, title, children }) => {
  return (
    <Dialog>
      <DialogTrigger>
        <AiFillQuestionCircle
          className={`${className} size-[13px] ml-1 text-[#737373]`}
        ></AiFillQuestionCircle>
      </DialogTrigger>
      <DialogContent className="text-white !p-6 !bg-[#2F2F3B]">
        <DialogHeader>
          <DialogTitle className="mb-4">{title || '说明'}</DialogTitle>
          <DialogDescription>{children}</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
