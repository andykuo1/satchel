import { useAnimationFrame } from '../../hooks/UseAnimationFrame';
import { useForceUpdate } from '../../hooks/UseForceUpdate';
import { CursorStore, useStore } from '../../stores';
import { getHeldItem, hasHeldItem } from '../../stores/transfer/CursorTransfer';
import { getPackedInfo } from '../../stores/transfer/Unpacker';
import { findEmptyViewArea, getViewAtCoords } from '../Intersection';
import styles from './CursorLanding.module.css';

export default function LandingCursor() {
  const store = useStore();
  const cursor = CursorStore.get(store);
  const forceUpdate = useForceUpdate();
  useAnimationFrame(forceUpdate, []);

  let [valid, nextCoordX, nextCoordY, width, height] = getLanding(
    cursor,
    store,
  );
  if (typeof valid !== 'boolean') {
    return null;
  }
  let gridUnit = cursor.gridUnit;
  let screenX =
    nextCoordX * gridUnit -
    cursor.getCursorWorldX() +
    cursor.getCursorScreenX();
  let screenY =
    nextCoordY * gridUnit -
    cursor.getCursorWorldY() +
    cursor.getCursorScreenY();
  return (
    <div
      className={`${styles.landing} ${valid && styles.valid}`}
      style={{
        // @ts-ignore
        '--cursor-x': `${screenX}px`,
        '--cursor-y': `${screenY}px`,
        '--cursor-w': `${width}`,
        '--cursor-h': `${height}`,
        '--cursor-unit': `${gridUnit}px`,
      }}></div>
  );
}

/**
 * @returns {[boolean, number, number, number, number]}
 */
export function getLanding(cursor, store) {
  if (!hasHeldItem(store)) {
    return [null, 0, 0, 0, 0];
  }
  let heldItem = getHeldItem(store);
  let packedInfo = getPackedInfo(store, heldItem);
  if (!packedInfo) {
    return [null, 0, 0, 0, 0];
  }
  let { width, height } = packedInfo;
  let gridUnit = cursor.gridUnit;
  let coordX = Math.floor(cursor.getCursorWorldX() / gridUnit);
  let coordY = Math.floor(cursor.getCursorWorldY() / gridUnit);
  if (getViewAtCoords(store, coordX, coordY)) {
    return [null, 0, 0, 0, 0];
  }

  let nextCoords = [0, 0];
  let result = findEmptyViewArea(
    nextCoords,
    store,
    coordX,
    coordY,
    width,
    height,
  );
  if (!result) {
    return [false, coordX, coordY, width, height];
  }
  return [true, nextCoords[0], nextCoords[1], width, height];
}
