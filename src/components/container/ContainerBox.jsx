import Box from '../box/Box';
import { handleMouseDownCallback } from '../cursor/CursorCallback';
import styles from './ContainerBox.module.css';
import ContainerHandles from './ContainerHandles';

/**
 * @typedef {import('../../stores').Store} Store
 * @typedef {import('../../inv/View').View} View
 */

/**
 * @param {object} props
 * @param {Store} props.store
 * @param {View} props.view
 * @param {boolean} [props.left]
 * @param {boolean} [props.right]
 * @param {boolean} [props.top]
 * @param {boolean} [props.bottom]
 * @param {import('react').ReactNode} props.children
 */
export default function ContainerBox({
  store,
  view,
  left = false,
  right = true,
  top = false,
  bottom = true,
  children,
}) {
  if (!view) {
    return null;
  }
  function onHandleMouseDown(e) {
    return handleMouseDownCallback(e, store, view);
  }
  const x = view.coordX;
  const y = view.coordY;
  const w = view.width;
  const h = view.height;
  const outlineSides = `${left && styles.left} ${right && styles.right} ${
    top && styles.top
  } ${bottom && styles.bottom}`;
  return (
    <>
      <Box
        x={x}
        y={y}
        w={w}
        h={h}
        className={`${styles.box} ${styles.background} ${outlineSides}`}></Box>
      <Box
        x={x}
        y={y}
        w={w}
        h={h}
        className={`${styles.box} ${styles.foreground} ${outlineSides}`}>
        <div className={styles.content}>{children}</div>
        <ContainerHandles
          left={left}
          right={right}
          top={top}
          bottom={bottom}
          handleProps={{ onMouseDown: onHandleMouseDown }}
        />
      </Box>
    </>
  );
}
