import styles from './ContainerHandles.module.css';

/**
 * @param {object} props
 * @param {boolean} [props.left]
 * @param {boolean} [props.right]
 * @param {boolean} [props.top]
 * @param {boolean} [props.bottom]
 * @param {object} [props.handleProps]
 */
export default function ContainerHandles({ left = false, right = true, top = false, bottom = true, handleProps = {} }) {
    const { className: classNameHandle = '', ...propsHandle } = handleProps;
    return (
        <>
        {top && <button className={`${styles.handlebar} ${styles.topbar} ${classNameHandle}}`} {...propsHandle}></button>}
        {left && <button className={`${styles.handlebar} ${styles.leftbar} ${classNameHandle}`} {...propsHandle}></button>}
        {right && <button className={`${styles.handlebar} ${styles.rightbar} ${classNameHandle}`} {...propsHandle}></button>}
        {bottom && <button className={`${styles.handlebar} ${styles.bottombar} ${classNameHandle}`} {...propsHandle}></button>}
        </>
    );
}
