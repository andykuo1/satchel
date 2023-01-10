import styles from './Box.module.css';

/**
 * @param {object} props
 * @param {number} [props.x]
 * @param {number} [props.y]
 * @param {number} [props.w]
 * @param {number} [props.h]
 * @param {object} [props.containerProps]
 * @param {import('react').ReactNode} props.children
 */
export default function Box({ x = 0, y = 0, w = 1, h = 1, containerProps = {}, children }) {
  const { className = '', style = {}, ...props } = containerProps;
  const boxStyle = {
    '--box-x': x,
    '--box-y': y,
    '--box-w': w,
    '--box-h': h,
    ...style,
  };
  return (
    <div className={`${styles.box} ${className}`} style={boxStyle} {...props}>
      {children}
    </div>
  );
}
