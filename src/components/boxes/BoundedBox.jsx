import Box from '../box/Box';
import { handleMouseDownCallback } from '../cursor/CursorCallback';
import Styles from './BoundedBox.module.css';
import BoundedBoxHandles from './BoundedBoxHandles';

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
export default function BoundedBox({
  store,
  view,
  left = true,
  right = true,
  top = true,
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
  const outlineSides = `${left && Styles.left} ${right && Styles.right} ${
    top && Styles.top
  } ${bottom && Styles.bottom}`;
  return (
    <>
      <Box
        x={x}
        y={y}
        w={w}
        h={h}
        className={`${Styles.box} ${Styles.background} ${outlineSides}`}></Box>
      <Box
        x={x}
        y={y}
        w={w}
        h={h}
        className={`${Styles.box} ${Styles.foreground} ${outlineSides}`}>
        <div className={Styles.content}>{children}</div>
        <BoundedBoxHandles
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
