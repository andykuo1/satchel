import styles from './Modal.module.css';

/**
 * @param {object} props
 * @param {boolean} [props.vertical]
 * @param {boolean} props.open
 * @param {import('react').MouseEventHandler} props.onClose
 * @param {import('react').ReactNode} props.children
 */
export default function Modal({ vertical = false, open, onClose, children }) {
    return (
        <div className={styles.container + ' ' + (!open && styles.hidden) + ' ' + (vertical && styles.vertical)}>
            <div className={styles.padding} onClick={onClose} />
            <dialog className={styles.outer} open={open}>
                <div className={styles.content}>
                    <div className={styles.padding}></div>
                    {children}
                    <div className={styles.padding}></div>
                </div>
            </dialog>
            <div className={styles.padding} onClick={onClose} />
        </div>
    );
}
