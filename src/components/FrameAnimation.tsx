'use client';
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, FC, useRef } from 'react';

const FrameAnimation: FC<{
  /**
   * 需要请求资源的路径
   */
  baseUrl: string;
  /**
   * 加载完成后的数据，由 onAllLoaded 函数传递出去的数据
   */
  data?: Array<HTMLImageElement>;
  totalFrames: number;
  loopIndex: number;
  className?: string;
  /**
   * 设置canvas 大小，避免摸排
   */
  width: number;
  height: number;

  /**
   * 延时 单位s
   */
  initialDelay?: number;

  /**
   * data-sal 属性
   */
  salAttributes?: object & { [key: string]: string };
  /**
   * 帧数
   */
  frameNumber?: number;

  children?: React.ReactNode;

  /**
   * 是否全部加载完成在播放动画
   */
  allLoaded?: boolean;

  /**
   * 图片首次加载完成后触发，不保证是第一帧图片加载完成触发
   */
  onStart?: () => void;
  /**
   * 每次结束执行，如果 loop = -1 则只会执行一次，大于 -1 则会在最后一帧渲染后执行
   */
  onLoop?: () => void;
  /**
   * 全部图片加载完成后触发
   */
  onAllLoaded?: (images: Array<HTMLImageElement>) => void;
}> = ({
  baseUrl,
  data,
  totalFrames,
  width,
  height,
  initialDelay = 0,
  loopIndex = 1,
  className = '',
  salAttributes = {},
  frameNumber = 30,
  children,
  allLoaded,
  onLoop,
  onStart,
  onAllLoaded,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameIndex = useRef<number>(0);
  const images = useRef<Array<HTMLImageElement>>([]);
  const requestRef = useRef<number>();
  const isStart = useRef(false);
  const isAllLoaded = useRef(false);
  const isLoop = useRef(false);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const [startAnimation, setStartAnimation] = useState(false); // 控制动画开始的状态

  // 预加载所有图片
  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null; // 初始化timeout ID
    // 添加初始延时后开始动画
    timeoutId = setTimeout(() => {
      for (let i = 1; i < totalFrames; i++) {
        if (!images.current[i]) {
          /**
           * 如果data存在数据则不去请求资源
           */
          if (data?.[i]) {
            images.current[i] = data[i];
          } else {
            const img = new Image();
            img.onload = () => {
              images.current[i] = img;
              if (i === 1 && canvasRef.current && startAnimation) {
                // 确保至少有一帧可画且画布已挂载
                drawFrame(1);
              }
            };
            img.src = `${baseUrl}${
              i < 10 ? '00' + i : i < 100 ? '0' + i : i
            }.png`;
          }
        }
      }
    }, initialDelay * 1000);
    return () => {
      timeoutId && clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseUrl, totalFrames, startAnimation, initialDelay, data]);

  // 绘制帧
  const drawFrame = (frame: number): void => {
    if (onStart && frame == 1 && !isStart.current) {
      onStart?.();
      isStart.current = true;
    }
    if (
      images.current.length === totalFrames &&
      onAllLoaded &&
      !isAllLoaded.current
    ) {
      onAllLoaded?.(images.current);
      isAllLoaded.current = true;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (ctx && images.current[frame]) {
      ctx.clearRect(0, 0, canvas!.width, canvas!.height);
      ctx.drawImage(images.current[frame], 0, 0, canvas!.width, canvas!.height);
    }
  };

  // 动画循环
  const animate = (time: number): void => {
    if (previousTimeRef.current === undefined) {
      previousTimeRef.current = time;
    }
    const timeSinceLastFrame = time - previousTimeRef.current;

    // 在这里调整你的帧率，1000 / 60 表示大约 60 FPS
    if (
      timeSinceLastFrame > 1000 / frameNumber &&
      (!allLoaded || images.current.length === totalFrames)
    ) {
      frameIndex.current =
        frameIndex.current >= totalFrames
          ? loopIndex == -1
            ? totalFrames
            : loopIndex
          : frameIndex.current + 1;

      if (frameIndex.current >= totalFrames && onLoop) {
        if (!isLoop.current) {
          isLoop.current = true;
          onLoop?.();
        }
      } else {
        isLoop.current = false;
      }

      drawFrame(frameIndex.current);
      previousTimeRef.current = time;
    }

    requestRef.current = window.requestAnimationFrame(animate);
  };

  // 使用requestAnimationFrame来启动动画
  useEffect(() => {
    if (startAnimation) {
      requestRef.current = requestAnimationFrame(animate);
      return () => {
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loopIndex, totalFrames, startAnimation]);

  // 初始化时的延迟启动
  useEffect(() => {
    const canvas = canvasRef.current;
    let timeoutId: NodeJS.Timeout | null = null; // 初始化timeout ID
    // const startAnimationFunction = () => {
    // 添加初始延时后开始动画
    timeoutId = setTimeout(() => {
      setStartAnimation(true);
    }, initialDelay * 1000);
    // };

    // // 如果设置了data-sal属性，则监听sal:in事件
    // if (canvas && salAttributes['data-sal']) {
    //   canvas.addEventListener('sal:in', startAnimationFunction);
    // } else if (!salAttributes['data-sal']) {
    //   // 如果没有设置data-sal属性，则直接应用初始延时
    //   startAnimationFunction();
    // }

    // return () => {
    //   if (canvas && salAttributes['data-sal']) {
    //     canvas.removeEventListener('sal:in', startAnimationFunction);
    //   }

    //   if (timeoutId) {
    //     clearTimeout(timeoutId); // 清除延时
    //   }
    // };
  }, [initialDelay, salAttributes]);

  return (
    <div className={`${className}`} {...salAttributes}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        width={width}
        height={height}
      />
      {children}
    </div>
  );
};

export default FrameAnimation;
