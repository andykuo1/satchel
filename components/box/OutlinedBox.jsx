import styles from '../../styles/OutlinedBox.module.css';
import Box from './Box';

/**
 * @param {object} props
 * @param {number} [props.x]
 * @param {number} [props.y]
 * @param {number} [props.w]
 * @param {number} [props.h]
 * @param {string} [props.title]
 * @param {boolean} [props.shadow]
 * @param {object} [props.containerProps]
 * @param {import('react').ReactNode} props.children
 */
export default function OutlinedBox({ x = 0, y = 0, w = 1, h = 1, title = "", containerProps = {}, shadow=true, children }) {
  const { className = '', ...props } = containerProps;
  return (
    <Box x={x} y={y} w={w} h={h} containerProps={{
        className: `${className} ${styles.contained} ${styles.subgrid} ${styles.itembox} ${shadow ? styles.outsetShadow : styles.noShadow}`,
        ...props,
      }}>
      <fieldset>
        <legend title={title}>{title}</legend>
        {children}
      </fieldset>
    </Box>
  );
}
