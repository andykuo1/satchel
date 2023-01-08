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
  let [pos, setPos] = useState([0, 0]);
  const forceUpdate = useForceUpdate();

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
    cursor.onComponentMount(forceUpdate);
  }, []);

  useEventListener(() => window.document, 'mousemove', cursor.onMouseMove, undefined, []);

  function onAnimationFrame(now) {
    cursor.onAnimationFrame(now);
    setPos([cursor.getCursorScreenX(), cursor.getCursorScreenY()]);
  }
  useAnimationFrame(onAnimationFrame, []);
  
  return (
    <div className={styles.cursor}
      style={{
        // @ts-ignore
        '--cursor-x': `${pos[0] - cursor.gridUnit / 2}px`,
        '--cursor-y': `${pos[1] - cursor.gridUnit / 2}px`,
        '--cursor-unit': `${cursor.gridUnit}px`,
        visibility: cursor.visible ? 'unset' : 'hidden',
      }}>
      <Playground className={styles.contained} viewIds={[getCursorViewId(store)]} />
    </div>
  );
}
