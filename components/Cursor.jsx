import { useEffect, useState } from 'react';
import { useAnimationFrame } from '../lib/hooks/UseAnimationFrame';
import { useEventListener } from '../lib/hooks/UseEventListener';
import { uuid } from '../lib/util/uuid';
import styles from '../styles/Cursor.module.css';
import { getCursor, getCursorInvId, getCursorViewId } from './cursor/CursorTransfer';
import { createItem } from './inv/Item';
import Playground from './Playground';
import { useStore, createSocketInvViewInStore } from './store';
import { addItemToInv, getView } from './store/InvTransfer';

export default function Cursor() {
  let [pos, setPos] = useState([0, 0]);

  const store = useStore();
  useEffect(() => {
    let viewId = createSocketInvViewInStore(store, getCursorViewId(store), getCursorInvId(store), 0, 0, ['cursor']);
    let view = getView(store, viewId);
    let invId = view.invId;
    let item = createItem(uuid());
    item.imgSrc = '/images/potion.png';
    addItemToInv(store, invId, item, 0, 0);
  }, []);

  const cursor = getCursor(store);
  useEventListener(() => window.document, 'mousemove', cursor.onMouseMove, undefined, []);

  function onAnimationFrame(now) {
    cursor.onAnimationFrame(now);
    setPos([cursor.getCursorScreenX(), cursor.getCursorScreenY()]);
  }
  useAnimationFrame(onAnimationFrame, []);

  const cursorStyle = {
    '--cursor-x': `${pos[0]}px`,
    '--cursor-y': `${pos[1]}px`,
    '--cursor-unit': `${cursor.gridUnit}px`,
  };
  return (
    <div className={styles.cursor} style={cursorStyle}>
      <Playground className={styles.contained} viewIds={[getCursorViewId(store)]} />
    </div>
  );
}
