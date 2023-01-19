import Image from 'next/image';
import { join } from 'path';

import { prefix } from '../../lib/prefix';
import styles from './ItemRenderer.module.css';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../inv/Item').Item} Item
 */

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {Item} props.item
 * @param {number} props.x
 * @param {number} props.y
 * @param {number} props.w
 * @param {number} props.h
 * @param {object} [props.containerProps]
 */
export default function ItemRenderer({
  store,
  item,
  x,
  y,
  w,
  h,
  containerProps = {},
}) {
  const containerPropsWithItemId = {
    'data-item-id': item.itemId,
    ...containerProps,
  };
  let src = item.imgSrc;
  if (src.startsWith('/')) {
    src = join(prefix, src);
  }
  return (
    <div
      className={styles.item}
      style={{
        // @ts-ignore
        '--item-x': x,
        '--item-y': y,
        '--item-w': w,
        '--item-h': h,
        '--item-bg': item.background,
      }}
      title={item.displayName}
      {...containerPropsWithItemId}>
      <Image src={src} alt={item.displayName} fill={true} />
      {item.stackSize > 0 && (
        <label className={styles.stackSize}>×{item.stackSize}</label>
      )}
    </div>
  );
}

/**
 * @param {HTMLElement} element
 */
export function getItemIdForElement(element) {
  if (element.hasAttribute('data-item-id')) {
    return element.getAttribute('data-item-id');
  } else {
    throw new Error('Cannot get item id for non-item element.');
  }
}

/**
 * @param {HTMLElement} element
 * @returns {HTMLElement}
 */
export function getClosestItemForElement(element) {
  return element.closest('[data-item-id]');
}
