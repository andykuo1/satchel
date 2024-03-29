import { useRef, useState } from 'react';

import { useAnimationFrame } from '../../hooks/UseAnimationFrame';
import { registerView } from '../ViewRegistry';
import ContainerBox from './ContainerBox';
import Styles from './TimerBox.module.css';

registerView('timer', TimerBox);

export default function TimerBox({ store, view }) {
  const prevFrameTime = useRef(0);
  const [time, setTime] = useState(0);
  const [counting, setCounting] = useState(false);

  function onClick() {
    prevFrameTime.current = performance.now();
    setTime(5 * 60 * 1000);
    setCounting(!counting);
  }

  function onAnimationFrame(now) {
    if (counting) {
      return false;
    }
    let deltaTime = now - prevFrameTime.current;
    prevFrameTime.current = now;
    setTime((prev) => {
      if (prev <= 0) {
        setCounting(false);
      }
      return Number(prev - deltaTime);
    });
  }

  useAnimationFrame(onAnimationFrame, [counting]);

  return (
    <ContainerBox w={3} h={2} containerProps={{ className: Styles.container }}>
      <div className={Styles.time}>
        <label className={Styles.hours}>
          {formatTimeDigits(millisToHours(time))}
        </label>
        <span>:</span>
        <label className={Styles.minutes}>
          {formatTimeDigits(millisToMinutes(time))}
        </label>
        <span>:</span>
        <label className={Styles.seconds}>
          {formatTimeDigits(millisToSeconds(time))}
        </label>
      </div>
      <button className={Styles.action} onClick={onClick}>
        O
      </button>
    </ContainerBox>
  );
}

function formatTimeDigits(n) {
  return `${n}`.padStart(2, '0');
}

function millisToSeconds(m) {
  return Math.floor(m / 1000) % 60;
}

function millisToMinutes(m) {
  return Math.floor(m / 1000 / 60) % 60;
}

function millisToHours(m) {
  return Math.floor(m / 1000 / 60 / 60);
}
