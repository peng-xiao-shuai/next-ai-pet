import CountUp, { type CountUpProps } from 'react-countup';
import { FC, useState, useEffect } from 'react';

export const NumberRoll: FC<CountUpProps> = (props) => {
  const [start, setStart] = useState(0);
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setStart(props.end);
        clearTimeout(timer);
      },
      props.duration ? props.duration * 1000 : 400
    );
  }, [props.duration, props.end]);
  return (
    <CountUp decimal="" separator="" duration={0.4} {...props} start={start}>
      {({ countUpRef }) => (
        <span className={props.className} ref={countUpRef} />
      )}
    </CountUp>
  );
};
