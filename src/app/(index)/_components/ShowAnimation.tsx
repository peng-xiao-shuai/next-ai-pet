import FrameAnimation from '@/components/FrameAnimation';
import React, { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';

export enum VideoName {
  KISS = 'kiss',
  TOUCH = 'touch',
  HUG = 'hug',
  FOOD = 'food',
  FEED = 'feed',
  NONE = 'none',
}

const FrameProps = {
  [VideoName.KISS]: {
    baseUrl: '/animation/kiss/',
    totalFrames: 75,
  },
  [VideoName.TOUCH]: {
    baseUrl: '/animation/touch/',
    totalFrames: 53,
  },
  [VideoName.HUG]: {
    baseUrl: '/animation/hug/',
    totalFrames: 51,
  },
  [VideoName.FOOD]: {
    baseUrl: '/animation/food/',
    totalFrames: 52,
  },
  [VideoName.FEED]: {
    baseUrl: '/animation/feed/',
    totalFrames: 53,
  },
};

const videoCache: {
  [key: string]: HTMLImageElement[];
} = {
  [VideoName.KISS]: [],
  [VideoName.TOUCH]: [],
  [VideoName.HUG]: [],
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
    if (!videoCache[name].length) {
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
      setIsLoader(Boolean(videoCache[name].length));
      setImageData(videoCache[name]);
    }
  }, [name]);

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
        transition={{ type: 'spring', duration: 0.5 }}
        onAnimationComplete={(definition: any) => {
          if (definition.opacity != 1) {
            onEnd();
            setIsLoop(false);
          }
        }}
      >
        <div className="fixed left-0 top-0 w-full h-full bg-black/30 z-40">
          <FrameAnimation
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
          ></FrameAnimation>
        </div>
      </m.div>
    </>
  );
};
