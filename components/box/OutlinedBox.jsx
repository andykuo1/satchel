import styles from './OutlinedBox.module.css';
import Box from './Box';

/**
 * @param {object} props
 * @param {number} [props.x]
 * @param {number} [props.y]
 * @param {number} [props.w]
 * @param {number} [props.h]
 * @param {string} [props.title]
 * @param {'in'|'out'|'one'|'none'} [props.shadow]
 * @param {object} [props.containerProps]
 * @param {import('react').ReactNode} props.children
 */
export default function OutlinedBox({ x = 0, y = 0, w = 1, h = 1, title = "", containerProps = {}, shadow='out', children }) {
  const { className = '', ...propsContainer } = containerProps;
  return (
    <Box x={x} y={y} w={w} h={h} containerProps={{
        className: `${className} ${styles.container} ${styles.subgrid} ${styles.itembox} ${
          shadow === 'out' ? styles.outsetShadow
            : shadow === 'in' ? styles.insetShadow
            : shadow === 'one' ? styles.oneShadow
            : styles.noShadow}`,
        ...propsContainer,
      }}>
      <fieldset className={`${styles.contained}`}>
        <legend title={title}>{title}</legend>
        {children}
      </fieldset>
    </Box>
  );
}
