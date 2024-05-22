import React, { useState, useEffect, ComponentType } from 'react';

interface WithDragDetectionProps {
  // 这里可以根据需要定义其他 props
  /**
   * 向上拖拽后执行函数
   */
  dragUpCB?: () => void;
}

const withDragDetection = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const ComponentWithDragDetection: React.FC<P & WithDragDetectionProps> = (
    props
  ) => {
    const [isDragging, setIsDragging] = useState(false);
    const [startY, setStartY] = useState(0);

    const handleMouseDown = (event: React.MouseEvent) => {
      setIsDragging(true);
      setStartY(event.clientY);
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (isDragging) {
        const currentY = event.clientY;
        const deltaY = startY - currentY;

        if (deltaY > 0) {
          console.log('向上拖拽');
          props.dragUpCB?.();
          // 在此处处理向上拖拽的逻辑
        } else {
          console.log('未向上拖拽');
          // 你可以根据需要处理其他方向的拖拽逻辑
        }
        setIsDragging(false);
      }
    };

    useEffect(() => {
      if (isDragging) {
        document.addEventListener('mouseup', handleMouseUp);
      } else {
        document.removeEventListener('mouseup', handleMouseUp);
      }

      return () => {
        document.removeEventListener('mouseup', handleMouseUp);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isDragging]);

    return (
      <div onMouseDown={handleMouseDown}>
        <WrappedComponent {...(props as P)} />
      </div>
    );
  };

  return ComponentWithDragDetection;
};

export default withDragDetection;
