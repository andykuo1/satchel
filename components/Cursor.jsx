import { useEffect, useState } from 'react';
import { useAnimationFrame } from '../lib/hooks/UseAnimationFrame';
import { useEventListener } from '../lib/hooks/UseEventListener';
import { useForceUpdate } from '../lib/hooks/UseForceUpdate';
import { uuid } from '../lib/util/uuid';
import styles from '../styles/Cursor.module.css';
import { getCursor, getCursorInvId, getCursorViewId } from './cursor/CursorTransfer';
import { createItem } from './inv/Item';
import Playground from './Playground';
import { useStore, createCursorInvViewInStore } from './store';
import { addItemToInv, getView } from './store/InvTransfer';

export default function Cursor() {
  const store = useStore();
  const cursor = getCursor(store);

  useEffect(() => {
    let viewId = createCursorInvViewInStore(store, getCursorViewId(store), getCursorInvId(store));
    let view = getView(store, viewId);
    let invId = view.invId;
    let item = createItem(uuid());
    item.width = 2;
    item.height = 2;
    item.imgSrc = '/images/potion.png';
    addItemToInv(store, invId, item, 0, 0);
  }, []);

  useEventListener(() => window.document, 'mousemove', cursor.onMouseMove, undefined, []);
  
  return (
    <PositionalCursor cursor={cursor}>
      <Playground className={styles.contained} topic="cursor" pannable={false} />
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
