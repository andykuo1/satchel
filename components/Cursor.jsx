import { useEffect } from 'react';
import { useAnimationFrame } from '../lib/hooks/UseAnimationFrame';
import { useEventListener } from '../lib/hooks/UseEventListener';
import { useForceUpdate } from '../lib/hooks/UseForceUpdate';
import { uuid } from '../lib/util/uuid';
import styles from '../styles/Cursor.module.css';
import { getCursor, getCursorInvId, getCursorViewId, setHeldItem } from './cursor/CursorTransfer';
import { createItem } from './inv/Item';
import CursorViewRenderer from './renderer/views/CursorViewRenderer';
import { useStore, createCursorInvViewInStore, ViewStore, InvStore } from './store';
import Viewport from './Viewport';

export default function Cursor() {
  const store = useStore();
  const cursor = getCursor(store);
  const view = ViewStore.useValue(store, getCursorViewId(store));
  const inv = InvStore.useValue(store, getCursorInvId(store));

  useEffect(() => {
    createCursorInvViewInStore(store, getCursorViewId(store), getCursorInvId(store));
    let item = createItem(uuid());
    item.width = 2;
    item.height = 2;
    item.imgSrc = '/images/potion.png';
    setHeldItem(cursor, store, item, 0, 0);
  }, []);

  useEventListener(() => window.document, 'mousemove', cursor.onMouseMove, undefined, []);
  
  return (
    <PositionalCursor cursor={cursor}>
      <Viewport gridOffsetX={0} gridOffsetY={0} containerProps={{ className: styles.contained }}>
        <CursorViewRenderer store={store} view={view} inv={inv} />
      </Viewport>
    </PositionalCursor>
  );
}

function PositionalCursor({ cursor, children }) {
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    cursor.onComponentMount(forceUpdate);
  }, []);
  useAnimationFrame(cursor.onAnimationFrame, []);

  let gridUnit = cursor.gridUnit;
  let visible = cursor.visible;
  let cursorX = cursor.getCursorScreenX() - gridUnit / 2;
  let cursorY = cursor.getCursorScreenY() - gridUnit / 2;
  return (
    <div className={styles.cursor}
      style={{
        // @ts-ignore
        '--cursor-x': `${cursorX}px`,
        '--cursor-y': `${cursorY}px`,
        '--cursor-unit': `${gridUnit}px`,
        visibility: visible ? 'unset' : 'hidden',
      }}>
      {children}
    </div>
  );
}
