import styles from './ContainerBox.module.css';
import Box from './Box';
import ContainerHandles from './ContainerHandles';

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
 * @param {object} [props.backgroundProps]
 * @param {object} [props.handleProps]
 * @param {import('react').ReactNode} props.children
 */
export default function ContainerBox({
  x = 0, y = 0,
  w = 1, h = 1,
  title = '',
  left = false, right = true,
  top = false, bottom = true,
  containerProps = {},
  handleProps = {},
  children
}) {
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
      <ContainerHandles left={left} right={right} top={top} bottom={bottom} handleProps={handleProps}/>
    </Box>
    </>
  );
}
