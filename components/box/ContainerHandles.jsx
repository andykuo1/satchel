import styles from './ContainerHandles.module.css';

export default function ContainerHandles({ left = false, right = false, top = false, bottom = false, handleProps = {} }) {
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
