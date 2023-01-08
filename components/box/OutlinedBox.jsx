import styles from '../../styles/OutlinedBox.module.css';
import Box from './Box';

/**
 * @param {object} props
 * @param {number} [props.x]
 * @param {number} [props.y]
 * @param {number} [props.w]
 * @param {number} [props.h]
 * @param {string} [props.title]
 * @param {object} [props.containerProps]
 * @param {import('react').ReactNode} props.children
 */
export default function OutlinedBox({ x = 0, y = 0, w = 1, h = 1, title = "", containerProps = {}, children }) {
  return (
    <Box x={x} y={y} w={w} h={h} containerProps={containerProps}>
      <fieldset className={styles.contained + ' ' + styles.subgrid + ' ' + styles.itembox + ' ' + styles.outsetGrid}>
        <legend title={title}>{title}</legend>
        {children}
      </fieldset>
    </Box>
  );
}
