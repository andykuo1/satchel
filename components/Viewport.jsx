import styles from './Viewport.module.css';

/**
 * @param {object} props
 * @param {number} props.gridOffsetX
 * @param {number} props.gridOffsetY
 * @param {import('react').ReactNode} props.children
 * @param {object} [props.containerProps]
 * @param {object} [props.backgroundProps]
 */
export default function Viewport({ gridOffsetX, gridOffsetY, children, containerProps = {}, backgroundProps = {} }) {
    const { className: classNameContainer = {}, style: styleContainer = {}, ...propsContainer } = containerProps;
    return (
        <div className={`${styles.view} ${styles.grid} ${classNameContainer}`}
            style={{
                // @ts-ignore
                '--grid-offset-x': `${gridOffsetX}px`,
                '--grid-offset-y': `${gridOffsetY}px`,
                ...styleContainer,
            }}
            {...propsContainer}>
            <div className={styles.background} {...backgroundProps}></div>
            {children}
        </div>
    );
}
