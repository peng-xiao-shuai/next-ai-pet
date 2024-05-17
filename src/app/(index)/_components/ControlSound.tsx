import { Fade } from '@/components/Fade';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export const ControlSound = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Error playing audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    // 在组件挂载时开始播放音乐
    if (audioRef.current) {
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          setIsPlaying(false);
          console.error('Error playing audio:', error);
        });
    }

    // 在组件卸载时暂停音乐
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        // eslint-disable-next-line react-hooks/exhaustive-deps
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  return (
    <div>
      <audio ref={audioRef} loop>
        <source src="/bgm.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <Fade
        visibleNode={
          <Image
            src="/icons/play.png"
            width={28}
            height={28}
            alt="play music"
          ></Image>
        }
        onChange={(val, setVal) => {
          if (isPlaying != val) {
            setVal(isPlaying)
          }
        }}
        onClick={() => {
          togglePlayPause();
        }}
      >
        <Image
          src="/icons/pause.png"
          width={28}
          height={28}
          alt="pause music"
        ></Image>
      </Fade>
    </div>
  );
};
