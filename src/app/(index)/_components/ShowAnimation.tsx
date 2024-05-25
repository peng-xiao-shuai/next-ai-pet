import FrameAnimation from '@/components/FrameAnimation';
import React, { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { useBusWatch } from '@/hooks/use-bus-watch';
import Image, { StaticImageData } from 'next/image';

export enum VideoName {
  FOOD = 'food',
  FEED = 'feed',
  NONE = 'none',
}

const FrameProps: {
  [k in Exclude<VideoName, VideoName.NONE>]: {
    data: (() => void) | StaticImageData;
  };
} = {
  // [VideoName.KISS]: {
  //   baseUrl: '/images/kiss.gif',
  //   // totalFrames: 75,
  // },
  // [VideoName.TOUCH]: {
  //   baseUrl: '/images/touch.gif',
  //   // totalFrames: 53,
  // },
  // [VideoName.HUG]: {
  //   baseUrl: '/images/hug.gif',
  //   // totalFrames: 51,
  // },
  [VideoName.FOOD]: {
    data: function () {
      import('@@/images/food.gif').then((res) => {
        this.data = res.default;
      });
    },
  },
  [VideoName.FEED]: {
    data: function () {
      import('@@/images/feed.gif').then((res) => {
        this.data = res.default;
      });
    },
  },
};

const videoCache: Record<
  Exclude<VideoName, VideoName.NONE>,
  HTMLImageElement[]
> = {
  [VideoName.FOOD]: [],
  [VideoName.FEED]: [],
};

export const VideoPlayer: React.FC<{
  name: VideoName;
  onEnd: () => void;
}> = ({ name, onEnd }) => {
  const [imageData, setImageData] = useState<HTMLImageElement[]>([]);
  const [visible, setVisible] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const [isLoop, setIsLoop] = useState(false);

  const onAllLoaded = (images: HTMLImageElement[]) => {
    if (name !== VideoName.NONE && !videoCache[name].length) {
      videoCache[name] = images;
    }
    setIsLoader(true);
    setVisible(true);
  };
  const onLoop = () => {
    setIsLoop(true);
  };

  useEffect(() => {
    if (name != VideoName.NONE) {
      // setIsLoader(Boolean(videoCache[name].length));
      setIsLoader(true);
      setImageData(videoCache[name]);
      setVisible(true);

      const timer = setTimeout(
        () => {
          setIsLoop(true);
          clearTimeout(timer);
        },
        name === VideoName.FOOD ? 2000 : 2400
      );
    }
  }, [name]);

  useEffect(() => {
    Object.keys(FrameProps).forEach((key) => {
      const _key = key as Exclude<VideoName, VideoName.NONE>;

      if (typeof FrameProps[_key].data === 'function') {
        (FrameProps[_key].data as () => void)();
      }
    });
  }, []);

  // useBusWatch('fetchIdle', () => {
  //   const timer = setTimeout(() => {
  //     Object.keys(videoCache).forEach((key, index) => {
  //       const K = key as Exclude<VideoName, VideoName.NONE>;
  //       if (videoCache[K].length == FrameProps[K].totalFrames) {
  //       } else {
  //         console.log(FrameProps[K].baseUrl);

  //         for (let i = 1; i < FrameProps[K].totalFrames; i++) {
  //           if (!videoCache[K][i]) {
  //             const img = new Image();
  //             img.onload = () => {
  //               videoCache[K][i] = img;
  //             };
  //             img.src = `${FrameProps[K].baseUrl}${
  //               i < 10 ? '00' + i : i < 100 ? '0' + i : i
  //             }.png`;
  //           }
  //         }
  //       }

  //       if (index === Object.keys(videoCache).length - 1) {
  //         clearTimeout(timer);
  //       }
  //     });
  //   }, 1000);
  // });

  if (name == VideoName.NONE || !FrameProps[name] || !visible) {
    return <></>;
  }

  return (
    <>
      <m.div
        className="z-50"
        animate={
          isLoader && !isLoop
            ? { opacity: 1, scale: 1, display: 'block' }
            : {
                opacity: 0,
                scale: 1,
                transitionEnd: {
                  display: 'none',
                },
              }
        }
        transition={{ type: 'spring', duration: 1 }}
        onAnimationComplete={(definition: any) => {
          if (definition.opacity != 1) {
            onEnd();
            setIsLoop(false);
          }
        }}
      >
        <div className="fixed flex items-center left-0 top-0 w-full h-full bg-black/30 z-[60]">
          {/* <FrameAnimation
            className="z-50"
            height={750}
            width={750}
            loopIndex={-1}
            initialDelay={0.1}
            frameNumber={30}
            allLoaded
            data={imageData}
            {...FrameProps[name]}
            onLoop={onLoop}
            onAllLoaded={onAllLoaded}
          ></FrameAnimation> */}
          <Image
            src={FrameProps[name].data as StaticImageData}
            width={200}
            height={200}
            alt={name}
            className="mx-auto"
          ></Image>
        </div>
      </m.div>
    </>
  );
};
