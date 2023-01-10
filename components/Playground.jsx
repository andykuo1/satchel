import styles from './Playground.module.css';

import { useEffect, useState } from 'react';
import { containerMouseUpCallback, itemMouseDownCallback } from './cursor/CursorCallback';
import { getCursor } from './cursor/CursorTransfer';
import { InvStore, useStore, ViewStore } from './store';
import { getView, isInvEmpty } from './store/InvTransfer';
import ViewRenderer from './renderer/ViewRenderer';
import Viewport from './Viewport';

export default function Playground({ className = '', topic = '', backgroundProps = {} }) {
  const [pos, setPos] = useState([0, 0]);
  const store = useStore();
  function onWheel(e) {
    const cursor = getCursor(store);
    cursor.onMouseWheel(e);
    setPos([cursor.screenPos[0], cursor.screenPos[1]]);
  }
  return (
    <Viewport gridOffsetX={pos[0]} gridOffsetY={pos[1]} containerProps={{ className }}>
      <div className={styles.background} onWheel={onWheel} {...backgroundProps}></div>
      <Views topic={topic} />
    </Viewport>
  );
}

function Views({ topic = '' }) {
  const store = useStore();
  let viewIds = ViewStore.useKeys(store);
  if (topic) {
    viewIds = viewIds.filter(viewId => getView(store, viewId).topics.includes(topic));
  }
  return (
    <>
      {viewIds.map(viewId => <View key={viewId} store={store} viewId={viewId} />)}
    </>
  );
}

function View({ store, viewId }) {
  const view = ViewStore.useValue(store, viewId);
  const inv = InvStore.useValue(store, view ? view.invId : '');
  useEffect(() => {
    if (!view || !inv) {
      return;
    }
    if (view.type === 'ground') {
      if (isInvEmpty(store, inv.invId)) {
        InvStore.delete(store, inv.invId);
      }
    }
  });
  if (!view || !inv) {
    return null;
  }
  return (
    <ViewRenderer key={viewId}
      store={store}
      view={view}
      inv={inv}
      containerProps={{
        onMouseUp(e) {
          return containerMouseUpCallback(e, store, view);
        }
      }}
      itemProps={{
        onMouseDown(e) {
          return itemMouseDownCallback(e, store, view);
        }
      }} />
  );
}
