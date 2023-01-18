import { useCallback, useRef } from 'react';

import { useAnimationFrame } from '../../hooks/UseAnimationFrame';
import { ViewStore, useStore } from '../../stores';
import { getItemAtSlotIndex } from '../../stores/transfer/InvTransfer';
import styles from './Wiring.module.css';

let DELTATIME = 0;
let VALUE = 0;
let COUNT = 0;

export default function Wiring() {
  const canvasRef = useRef(null);
  const store = useStore();

  const onAnimationFrame = useCallback(function onAnimationFrame(now) {
    let startTime = now;
    /** @type {HTMLCanvasElement} */
    let canvas = canvasRef.current;
    let ctx = canvas.getContext('2d');

    let canvasWidth = canvas.width;
    let canvasHeight = canvas.height;

    let computedStyle = getComputedStyle(canvas);
    let sx = computedStyle.getPropertyValue('--grid-offset-x');
    let x = Number(sx.substring(0, sx.length - 2));
    let sy = computedStyle.getPropertyValue('--grid-offset-y');
    let y = Number(sy.substring(0, sy.length - 2));
    let su = computedStyle.getPropertyValue('--grid-unit');
    let u = Number(su.substring(0, su.length - 2));
    let w = canvas.parentElement.clientWidth;
    let h = canvas.parentElement.clientHeight;
    if (canvasWidth !== w || canvasHeight !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    ctx.clearRect(0, 0, w, h);

    let connectedItems = [];
    for (let viewId of ViewStore.keys(store)) {
      ctx.setTransform(1, 0, 0, 1, x, y);
      let view = ViewStore.get(store, viewId);
      if (view.type === 'connectorOut') {
        let item = getItemAtSlotIndex(store, view.invId, 0);
        if (item) {
          connectedItems.push(item);
        }
      }
      if (!view.topics.includes('workspace')) {
        continue;
      }
      let viewX = view.coordX;
      let viewY = view.coordY;
      let viewW = view.width;
      let viewH = view.height;
      ctx.fillStyle = 'green';
      ctx.translate(viewX * u, viewY * u);
      ctx.fillRect(0, 0, viewW * u, viewH * u);
      // ctx.roundRect(0, 0, viewW * u, viewH * u, 20);
      // ctx.fill();
    }
    for (let item of connectedItems) {
      ctx.setTransform(1, 0, 0, 1, x, y);
      let inView = ViewStore.get(store, item.metadata.inViewId);
      let outView = ViewStore.get(store, item.metadata.outViewId);
      ctx.beginPath();
      let ax = (inView.coordX + 1) * u + 8;
      let ay = (inView.coordY + 0.5) * u;
      let bx = outView.coordX * u;
      let by = (outView.coordY + 0.5) * u;
      let dx = bx - ax;
      let dy = by - ay;
      let mx = (Math.sign(dy) * (bx + ax)) / 2 + ax;
      let my = (Math.sign(dy) * (by + ay)) / 2 + ay;
      ctx.strokeStyle = 'red';
      ctx.arc(ax, ay, 8, 0, Math.PI * 2);
      ctx.moveTo(ax, ay);
      // ctx.bezierCurveTo(ax, dx, bx, my / 2, bx, by);
      ctx.lineTo(bx, by);
      ctx.arc(bx, by, 8, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.resetTransform();

    ctx.fillStyle = 'white';
    ctx.fillText(`${DELTATIME}`, 10, 10);

    let endTime = performance.now();
    VALUE += endTime - startTime;
    ++COUNT;
    if (COUNT >= 60) {
      DELTATIME = Math.round((VALUE * 100) / 60) / 100;
      VALUE = 0;
      COUNT = 0;
    }
  }, []);

  useAnimationFrame(onAnimationFrame, []);
  return <canvas ref={canvasRef} className={styles.canvas} />;
}
