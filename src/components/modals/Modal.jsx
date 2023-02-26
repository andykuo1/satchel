import Styles from './Modal.module.css';

/**
 * @param {object} props
 * @param {boolean} [props.vertical]
 * @param {boolean} props.open
 * @param {import('react').MouseEventHandler} props.onClose
 * @param {import('react').ReactNode} props.children
 */
export default function Modal({ vertical = false, open, onClose, children }) {
  return (
    <div
      className={
        Styles.container +
        ' ' +
        (!open && Styles.hidden) +
        ' ' +
        (vertical && Styles.vertical)
      }>
      <div className={Styles.padding} onClick={onClose} />
      <dialog className={Styles.outer} open={open}>
        <div className={Styles.content}>
          <div className={Styles.padding}></div>
          {children}
          <div className={Styles.padding}></div>
        </div>
      </dialog>
      <div className={Styles.padding} onClick={onClose} />
    </div>
  );
}
