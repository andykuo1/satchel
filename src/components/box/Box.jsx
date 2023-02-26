import Styles from './Box.module.css';

/**
 * @param {object} props
 * @param {number} [props.x]
 * @param {number} [props.y]
 * @param {number} [props.w]
 * @param {number} [props.h]
 * @param {object} [props.className]
 * @param {import('react').ReactNode} [props.children]
 */
export default function Box({
  x = 0,
  y = 0,
  w = 1,
  h = 1,
  className = '',
  children = undefined,
}) {
  return (
    <div
      className={`${Styles.container} ${className}`}
      style={{
        // @ts-ignore
        '--box-x': x,
        '--box-y': y,
        '--box-w': w,
        '--box-h': h,
      }}>
      {children}
    </div>
  );
}
