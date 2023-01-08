import { createContext, useEffect, useRef, useState } from 'react';
import { useAnimationFrame } from '../lib/hooks/UseAnimationFrame';
import { useEventListener } from '../lib/hooks/UseEventListener';
import { uuid } from '../lib/util/uuid';
import styles from '../styles/Cursor.module.css';
import { createItem } from './inv/Item';
import Playground from './Playground';
import { createViewInStore, createSocketInvInStore, useStore } from './store';
import { addItemToInv, getInv } from './store/InvTransfer';

const CursorContext = createContext(null);
const CURSOR_INV_ID = 'cursor';
const CURSOR_VIEW_ID = 'cursor';
const CURSOR_GRID_UNIT = 32;

const PLACE_BUFFER_RANGE = 10;
const PLACE_BUFFER_RANGE_SQUARED = PLACE_BUFFER_RANGE * PLACE_BUFFER_RANGE;

export default function Cursor() {
  let clientX = useRef(0);
  let clientY = useRef(0);
  let heldOffsetX = useRef(0);
  let heldOffsetY = useRef(0);
  let startHeldX = useRef(0);
  let startHeldY = useRef(0);
  let ignoreFirstPutDown = useRef(false);

  let [pos, setPos] = useState([0, 0]);

  let store = useStore();
  useEffect(() => {
    let invId = createSocketInvInStore(store, CURSOR_INV_ID);
    let viewId = createViewInStore(store, CURSOR_VIEW_ID, invId, 0, 0, ['cursor']);
    let item = createItem(uuid());
    item.imgSrc = '/images/potion.png';
    addItemToInv(store, invId, item, 0, 0);
  }, []);

  function onMouseMove(e) {
    clientX.current = e.clientX;
    clientY.current = e.clientY;
  }
  useEventListener(() => window.document, 'mousemove', onMouseMove, undefined, []);

  function onAnimationFrame() {
    let posX = clientX.current + heldOffsetX.current * CURSOR_GRID_UNIT;
    let posY = clientY.current + heldOffsetY.current * CURSOR_GRID_UNIT;
    setPos([posX, posY]);

    if (ignoreFirstPutDown.current
      && distanceSquared(clientX.current, clientY.current, startHeldX.current, startHeldY.current) >= PLACE_BUFFER_RANGE_SQUARED) {
      // This is a drag motion. Next putDown should be intentful.
      ignoreFirstPutDown.current = false;
    }
  }
  useAnimationFrame(onAnimationFrame, []);

  const cursorStyle = {
    '--cursor-x': `${pos[0]}px`,
    '--cursor-y': `${pos[1]}px`,
    '--cursor-unit': `${CURSOR_GRID_UNIT}px`,
  };
  return (
    <div className={styles.cursor} style={cursorStyle}>
      <Playground className={styles.contained} viewIds={[CURSOR_INV_ID]} />
    </div>
  );
}
