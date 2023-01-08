import Image from 'next/image';
import styles from '../styles/ItemStack.module.css';

/**
 * @param {object} props
 * @param {Item} props.item
 * @param {number} props.x
 * @param {number} props.y
 * @param {number} props.slotIndex
 */
export default function ItemStack({ item, x, y, slotIndex }) {
  const itemStyle = {
    '--item-x': x,
    '--item-y': y,
  };
  return (
    <div className={styles.item} style={itemStyle} title={item.displayName}>
      <Image src={item.imgSrc} alt={item.displayName} fill={true} />
      {item.stackSize > 0 && <label className={styles.stackSize}>×{item.stackSize}</label>}
    </div>
  );
}
