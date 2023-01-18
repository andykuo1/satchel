import { useEffect, useRef, useState } from 'react';

import { ViewStore, useStore } from '../../stores';
import { getCursor } from '../../stores/transfer/CursorTransfer';
import { getView } from '../../stores/transfer/InvTransfer';
import { getViewRenderer } from '../ViewRegistry';
import CursorLanding from '../cursor/CursorLanding';
import Viewport from '../viewport/Viewport';
import Wiring from '../wiring/Wiring';
import styles from './Playground.module.css';

export default function Playground({
  className = '',
  topic = '',
  backgroundProps = {},
}) {
  const [pos, setPos] = useState([0, 0]);
  const store = useStore();

  function onWheel(e) {
    const cursor = getCursor(store);
    cursor.onMouseWheel(e);
    setPos([cursor.screenPos[0], cursor.screenPos[1]]);
  }

  // Keep it centered.
  const resizeState = useRef(null);
  function onResize(e) {
    const { x, y, animationFrameHandle } = resizeState.current;
    let dx = x - window.innerWidth;
    let dy = y - window.innerHeight;
    const cursor = getCursor(store);
    cursor.screenPos[0] -= dx / 2;
    cursor.screenPos[1] -= dy / 2;
    cancelAnimationFrame(animationFrameHandle);
    resizeState.current = {
      x: window.innerWidth,
      y: window.innerHeight,
      animationFrameHandle: requestAnimationFrame(() =>
        setPos([cursor.screenPos[0], cursor.screenPos[1]]),
      ),
    };
  }

  useEffect(() => {
    resizeState.current = {
      x: window.innerWidth,
      y: window.innerHeight,
      animationFrameHandle: null,
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <Viewport
      gridOffsetX={pos[0]}
      gridOffsetY={pos[1]}
      containerProps={{ className }}>
      <div
        className={styles.background}
        onWheel={onWheel}
        {...backgroundProps}></div>
      <CursorLanding />
      <Wiring />
      <Views topic={topic} />
    </Viewport>
  );
}

function Views({ topic = '' }) {
  const store = useStore();
  let viewIds = ViewStore.useKeys(store);
  if (topic) {
    viewIds = viewIds.filter((viewId) =>
      getView(store, viewId).topics.includes(topic),
    );
  }
  return (
    <>
      {viewIds.map((viewId) => (
        <View key={viewId} store={store} viewId={viewId} />
      ))}
    </>
  );
}

function View({ store, viewId }) {
  const view = ViewStore.useValue(store, viewId);
  if (!view) {
    return null;
  }
  let Renderer = getViewRenderer(view.type);
  if (!Renderer) {
    return null;
  }
  return <Renderer store={store} view={view} />;
}
