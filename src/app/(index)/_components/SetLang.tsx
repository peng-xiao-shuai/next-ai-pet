'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/useTranslation';
import Image from 'next/image';

export function SetLang() {
  const { lang, setLang } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Image src="/icons/lang.png" alt="lang" width={24} height={24}></Image>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white !min-w-20">
        <DropdownMenuRadioGroup
          value={lang}
          onValueChange={(v: string) => {
            if (lang !== v) {
              setLang(v as typeof lang);
              location.reload();
            }
          }}
        >
          <DropdownMenuRadioItem value="zh">中文</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">English</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="ru">Pyccknn</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
