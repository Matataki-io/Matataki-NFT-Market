// test 暂不使用

import React from 'react';
import {
  useTransition,
  useSpring,
  useChain,
  config,
  animated,
  useSpringRef,
} from '@react-spring/web';

const Card = ({ list }: any) => {
  const transApi = useSpringRef();
  const transition = useTransition(list, {
    ref: transApi,
    trail: 400 / list.length,
    from: { opacity: 0, y: 10 },
    enter: { opacity: 1, y: 0 },
    leave: { opacity: 0, y: 10 },
  });

  useChain([transApi], [0, 0.1]);

  return (
    <div className='container'>
      {transition((style, i, _, idx) => (
        <animated.div style={{ ...style }}>test</animated.div>
      ))}
    </div>
  );
};

export default Card;
