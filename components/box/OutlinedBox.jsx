import styles from './OutlinedBox.module.css';
import Box from './Box';

/**
 * @param {object} props
 * @param {number} [props.x]
 * @param {number} [props.y]
 * @param {number} [props.w]
 * @param {number} [props.h]
 * @param {string} [props.title]
 * @param {boolean} [props.left]
 * @param {boolean} [props.right]
 * @param {boolean} [props.top]
 * @param {boolean} [props.bottom]
 * @param {object} [props.containerProps]
 * @param {object} [props.handleProps]
 * @param {import('react').ReactNode} props.children
 */
export default function OutlinedBox({ x = 0, y = 0, w = 1, h = 1, title = '', containerProps = {}, left = false, right = false, top = false, bottom = false, handleProps = {}, children }) {
  const { className: classNameContainer = '', ...propsContainer } = containerProps;
  const outlineSides = `${left && styles.left} ${right && styles.right} ${top && styles.top} ${bottom && styles.bottom}`;
  return (
    <>
    <Box x={x} y={y} w={w} h={h} className={`${styles.box} ${styles.background} ${outlineSides}`}></Box>
    <Box x={x} y={y} w={w} h={h} className={`${styles.box} ${styles.foreground} ${outlineSides}`}>
      <fieldset className={`${styles.container} ${styles.subgrid} ${classNameContainer}`} {...propsContainer}>
        <legend title={title}>{title}</legend>
        {children}
      </fieldset>
      {top && <button className={`${styles.handlebar} ${styles.topbar}`} {...handleProps}></button>}
      {left && <button className={`${styles.handlebar} ${styles.leftbar}`} {...handleProps}></button>}
      {right && <button className={`${styles.handlebar} ${styles.rightbar}`} {...handleProps}></button>}
      {bottom && <button className={`${styles.handlebar} ${styles.bottombar}`} {...handleProps}></button>}
    </Box>
    </>
  );
}
