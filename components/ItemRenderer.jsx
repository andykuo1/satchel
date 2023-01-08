import Image from 'next/image';
import styles from '../styles/ItemRenderer.module.css';

/**
 * @typedef {import('./store').Store} Store
 * @typedef {import('./inv/Item').Item} Item
 */

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {Item} props.item
 * @param {number} props.x
 * @param {number} props.y
 * @param {object} [props.containerProps]
 */
export default function ItemRenderer({ store, item, x, y, containerProps = {} }) {
  return (
    <div className={styles.item}
      style={{
        // @ts-ignore
        '--item-x': x,
        '--item-y': y,
        '--item-w': item.width,
        '--item-h': item.height,
      }}
      title={item.displayName}
      {...containerProps}>
      <Image src={item.imgSrc} alt={item.displayName} fill={true} />
      {item.stackSize > 0 && <label className={styles.stackSize}>×{item.stackSize}</label>}
    </div>
  );
}
