import styles from '../../styles/Box.module.css';

export default function Box({ x = 0, y = 0, w = 1, h = 1, children }) {
  const boxStyle = {
    '--box-x': x,
    '--box-y': y,
    '--box-w': w,
    '--box-h': h,
  };
  return (
    <div className={styles.box} style={boxStyle}>
      {children}
    </div>
  );
}
