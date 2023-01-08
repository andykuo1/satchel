import styles from '../../styles/OutlinedBox.module.css';
import Box from './Box';

export default function OutlinedBox({ x = 0, y = 0, w = 1, h = 1, title = "", children }) {
  return (
    <Box x={x} y={y} w={w} h={h}>
      <fieldset className={styles.contained + ' ' + styles.subgrid + ' ' + styles.itembox + ' ' + styles.outsetGrid}>
        <legend title={title}>{title}</legend>
        {children}
      </fieldset>
    </Box>
  );
}
