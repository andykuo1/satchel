import Image from 'next/image';
import styles from '../styles/ItemStack.module.css';
import { itemMouseDownCallback } from './CursorCallback';

/**
 * @typedef {import('./inv/View').View} View
 * @typedef {import('./store').Store} Store
 */

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {Item} props.item
 * @param {number} props.x
 * @param {number} props.y
 * @param {number} props.slotIndex
 * @param {View} props.view
 * @param {import('react').RefObject<HTMLElement>} props.containerRef
 */
export default function ItemStack({ store, item, x, y, slotIndex, view, containerRef }) {
  const itemStyle = {
    '--item-x': x,
    '--item-y': y,
  };

  function onMouseDown(e) {
    return itemMouseDownCallback(e, store, item, view, containerRef.current);
  }

  return (
    <div className={styles.item} style={itemStyle}
      title={item.displayName}
      onMouseDown={onMouseDown}>
      <Image src={item.imgSrc} alt={item.displayName} fill={true} />
      {item.stackSize > 0 && <label className={styles.stackSize}>×{item.stackSize}</label>}
    </div>
  );
}

/**
 * @param {DOMRect} elementBoundingRect
 * @param {number} clientX
 * @param {number} unitSize
 * @returns {number}
 */
export function getClientCoordX(elementBoundingRect, clientX, unitSize) {
  return Math.trunc((clientX - elementBoundingRect.x) / unitSize);
}

/**
 * @param {DOMRect} elementBoundingRect
 * @param {number} clientY
 * @param {number} unitSize
 * @returns {number}
 */
export function getClientCoordY(elementBoundingRect, clientY, unitSize) {
  return Math.trunc((clientY - elementBoundingRect.y) / unitSize);
}
