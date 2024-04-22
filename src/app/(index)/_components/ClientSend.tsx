'use client';
import { cn } from '@/lib/utils';
import { filterImage } from '@/utils/business';
import { debounce } from '@/utils/debounce-throttle';
import Image from 'next/image';
import { FC, useState } from 'react';
import { toast } from 'sonner';
import { ClientTips } from './ClientTips';

export const ClientSendMsg: FC<{
  sendMsg: () => void;
}> = ({ sendMsg }) => {
  const [message, setMessage] = useState('');
  const [tools, setTools] = useState([]);

  const clickTool = ({ name, label }: Indexes<string>) => {
    switch (name) {
      case 'LET_ME_SEE_U':
        toast('coming soon');
        // sendPreinstall('photo', label);
        break;
      case 'TAKE_ACTION':
        toast('coming soon');
        break;
      case 'ASMR':
        toast('coming soon');
        break;
      case 'ROLE_PLAY':
        toast('coming soon');
        // TODO
        // sceneRef.value.open();
        break;
      case 'HOT_DATE':
        toast('coming soon');
        // TODO
        // sceneRef.value.open(true);
        break;

      default:
        break;
    }
  };

  return (
    <>
      {/* <div
        className="tools-bar flex items-center flex-nowrap ml-6 pb-4 overflow-x-auto"
        style={{
          unicodeBidi: 'normal',
        }}
      >
        {tools?.map((tool: any, index: number) => (
          <div key={index}>
            <div
              className="tool relative flex justify-center items-center mr-10 w-9 h-9"
              onClick={() => {
                clickTool(tool);
              }}
            >
              <Image
                className="tool__icon"
                width={33}
                height={33}
                src={filterImage(tool.iconUrl)}
                alt=""
              />

              <GuideStep tool={tool}></GuideStep>
            </div>
          </div>
        ))}
      </div> */}
      <div className="input-container relative m-3 leading-none text-white">
        <ClientTips
          className="right-0 -translate-y-[120%] w-56"
          cornerClassName="bottom-0 translate-y-2/4 right-6"
          text={'Send messages to earn growth points!'}
        ></ClientTips>

        <textarea
          value={message}
          className="textarea-dom pr-[72px] pl-4 w-full h-12 rounded-3xl bg-[#302c4f] resize-none !outline-none leading-[theme(height.12)] rtl:pr-4 rtl:pl-[72px]"
          placeholder={`Message`}
          maxLength={200}
          onChange={({ target }) => {
            setMessage(target.value);
          }}
          onBlur={({ target }) => {
            /**
             * FIX Ios 软键盘消失页面不会掉下来
             */
            window.scrollTo(0, 200);
          }}
          onKeyUp={(e) => {
            if (e.key === 'Enter') {
              sendMsg();
            }
          }}
        />
        <div className="btn-wrapper absolute top-2/4 -translate-y-2/4 right-4 rtl:right-[unset] rtl:left-4">
          <Image
            onClick={() => {
              sendMsg();
            }}
            width={30}
            height={30}
            className="send-icon"
            alt="send"
            src="/icons/send.png"
          ></Image>
        </div>
      </div>
    </>
  );
};
