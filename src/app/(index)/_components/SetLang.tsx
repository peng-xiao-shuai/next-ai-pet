'use client';

import * as React from 'react';
import { FaLanguage } from 'react-icons/fa6';
import { DropdownMenuCheckboxItemProps } from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MdOutlineLanguage } from 'react-icons/md';
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';

type Checked = DropdownMenuCheckboxItemProps['checked'];

export function SetLang() {
  const { lang, setLang } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center">
          <Image
            src="/icons/lang.png"
            alt="lang"
            width={24}
            height={24}
          ></Image>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white !min-w-20">
        <DropdownMenuItem
          onClick={() => {
            setLang('zh');
            location.reload();
          }}
        >
          中文
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setLang('en');
            location.reload();
          }}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setLang('ru');
            location.reload();
          }}
        >
          Pyccknn
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
